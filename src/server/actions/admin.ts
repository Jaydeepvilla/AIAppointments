"use server";

import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { eq, and, desc, or, ilike, sql, count } from "drizzle-orm";
import { db } from "../db";
import {
  conversations,
  leadProfiles,
  escalationRequests,
  conversationMessages,
  conversationEvents,
  conversationFeedback,
  users,
  profiles,
  memberships,
  organizations,
  sessions,
  refreshTokens,
  loginHistory,
  auditLogs,
} from "../db/schema";
import { membershipRepository } from "../repositories/membership";
import { conversationsRepository } from "../repositories/conversations";
import { messagesRepository } from "../repositories/messages";
import { leadsRepository } from "../repositories/leads";
import { escalationsRepository } from "../repositories/escalations";
import { summariesRepository } from "../repositories/summaries";
import { escalationService } from "../services/escalation";
import { logoutAllDevices } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { analyzePasswordStrength } from "@/lib/auth/security-checks";
import { auditService } from "../services/audit";

/**
 * Helper to fetch verified organization ID for the authenticated user
 */
async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const userMemberships = await membershipRepository.getByUser(userId);
  if (userMemberships.length === 0) throw new Error("No organization found");
  return userMemberships[0].organizationId;
}

/**
 * Helper to assert that the logged-in user is an Administrator or Owner.
 */
async function assertAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [member] = await db
    .select()
    .from(memberships)
    .where(
      and(
        eq(memberships.userId, userId),
        or(eq(memberships.role, "admin"), eq(memberships.role, "owner"))
      )
    )
    .limit(1);

  if (!member) {
    throw new Error("Forbidden: Administrator access required");
  }

  return { userId, organizationId: member.organizationId };
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 1: Conversations Actions (Pre-existing)
   ───────────────────────────────────────────────────────────────────────────── */

export async function getConversationsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    
    // Get conversations with lead profiles where available
    const list = await db
      .select({
        id: conversations.id,
        status: conversations.status,
        metadata: conversations.metadata,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        leadProfile: {
          id: leadProfiles.id,
          name: leadProfiles.name,
          email: leadProfiles.email,
          phone: leadProfiles.phone,
          status: leadProfiles.status,
          leadScore: leadProfiles.leadScore,
        },
      })
      .from(conversations)
      .leftJoin(leadProfiles, eq(conversations.leadProfileId, leadProfiles.id))
      .where(eq(conversations.organizationId, orgId))
      .orderBy(desc(conversations.updatedAt));

    return { success: true, data: list };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load conversations" };
  }
}

export async function getConversationDetailsAction(conversationId: string) {
  try {
    const orgId = await getVerifiedOrgId();
    
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, conversationId), eq(conversations.organizationId, orgId)));
      
    if (!conv) {
      throw new Error("Conversation not found");
    }

    const messages = await messagesRepository.listByConversation(conversationId);
    const summary = await summariesRepository.findByConversation(conversationId);
    
    let leadProfile = null;
    let leadAnswersList: any[] = [];
    if (conv.leadProfileId) {
      leadProfile = await leadsRepository.findProfileById(conv.leadProfileId);
      leadAnswersList = await leadsRepository.listAnswers(conv.leadProfileId);
    }

    const feedback = await db
      .select()
      .from(conversationFeedback)
      .where(eq(conversationFeedback.conversationId, conversationId));

    const events = await db
      .select()
      .from(conversationEvents)
      .where(eq(conversationEvents.conversationId, conversationId))
      .orderBy(conversationEvents.createdAt);

    return {
      success: true,
      data: {
        conversation: conv,
        messages,
        summary,
        leadProfile,
        leadAnswers: leadAnswersList,
        feedback: feedback[0] || null,
        events,
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load conversation details" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 2: Leads Actions (Pre-existing)
   ───────────────────────────────────────────────────────────────────────────── */

export async function getLeadsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const list = await leadsRepository.listProfiles(orgId);
    
    // Fetch answers for each lead to show complete overview
    const fullLeads = await Promise.all(
      list.map(async (lead) => {
        const answers = await leadsRepository.listAnswers(lead.id);
        const scores = await leadsRepository.listScores(lead.id);
        return {
          ...lead,
          answers,
          scores: scores[0] || null,
        };
      })
    );

    return { success: true, data: fullLeads };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load leads" };
  }
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  try {
    const orgId = await getVerifiedOrgId();
    
    const [existing] = await db
      .select()
      .from(leadProfiles)
      .where(and(eq(leadProfiles.id, leadId), eq(leadProfiles.organizationId, orgId)));
      
    if (!existing) {
      throw new Error("Lead profile not found");
    }

    await leadsRepository.updateProfile(leadId, { status });
    
    revalidatePath("/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update lead status" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 3: Escalations Actions (Pre-existing)
   ───────────────────────────────────────────────────────────────────────────── */

export async function getEscalationsAction(status?: string) {
  try {
    const orgId = await getVerifiedOrgId();
    const list = await escalationsRepository.list(orgId, status);
    
    // Join details
    const fullList = await Promise.all(
      list.map(async (esc) => {
        const conversation = await conversationsRepository.findById(esc.conversationId);
        let leadProfile = null;
        if (conversation?.leadProfileId) {
          leadProfile = await leadsRepository.findProfileById(conversation.leadProfileId);
        }
        return {
          ...esc,
          conversation,
          leadProfile,
        };
      })
    );

    return { success: true, data: fullList };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load escalations" };
  }
}

export async function resolveEscalationAction(escalationId: string, notes?: string) {
  try {
    const orgId = await getVerifiedOrgId();
    
    const [existing] = await db
      .select()
      .from(escalationRequests)
      .where(and(eq(escalationRequests.id, escalationId), eq(escalationRequests.organizationId, orgId)));
      
    if (!existing) {
      throw new Error("Escalation request not found");
    }

    await escalationService.resolveEscalation(escalationId, notes);
    
    revalidatePath("/escalations");
    revalidatePath("/conversations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to resolve escalation" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 4: Analytics Actions (Pre-existing)
   ───────────────────────────────────────────────────────────────────────────── */

export async function getAnalyticsAction() {
  try {
    const orgId = await getVerifiedOrgId();

    // Fetch lists
    const convs = await db.select().from(conversations).where(eq(conversations.organizationId, orgId));
    const leads = await db.select().from(leadProfiles).where(eq(leadProfiles.organizationId, orgId));
    const escalations = await db.select().from(escalationRequests).where(eq(escalationRequests.organizationId, orgId));
    const feedbackList = await db.select().from(conversationFeedback).where(eq(conversationFeedback.organizationId, orgId));
    
    // Calculations
    const totalConversations = convs.length;
    const activeConversations = convs.filter((c) => c.status === "active").length;
    const closedConversations = convs.filter((c) => c.status === "closed").length;
    const escalatedConversations = convs.filter((c) => c.status === "escalated").length;

    // Funnel calculations
    const funnelStages = {
      New: leads.filter((l) => l.status === "New").length,
      Qualified: leads.filter((l) => l.status === "Qualified").length,
      Hot: leads.filter((l) => l.status === "Hot").length,
      Booked: leads.filter((l) => l.status === "Booked").length,
      Escalated: leads.filter((l) => l.status === "Escalated").length,
      Closed: leads.filter((l) => l.status === "Closed").length,
    };

    const totalLeads = leads.length;
    const qualifiedLeadsCount = leads.filter((l) =>
      ["Qualified", "Hot", "Booked"].includes(l.status)
    ).length;
    
    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeadsCount / totalLeads) * 100) : 0;
    
    const totalScore = leads.reduce((sum, l) => sum + l.leadScore, 0);
    const averageLeadScore = totalLeads > 0 ? Math.round(totalScore / totalLeads) : 0;

    // Feedback rating
    const totalRating = feedbackList.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = feedbackList.length > 0 ? parseFloat((totalRating / feedbackList.length).toFixed(1)) : 0;

    // Extract intents count from conversation messages
    const recentMessages = await db
      .select({ intentDetected: conversationMessages.intentDetected })
      .from(conversationMessages)
      .where(eq(conversationMessages.organizationId, orgId));

    const intentCounts: Record<string, number> = {
      booking: 0,
      pricing: 0,
      emergency: 0,
      human_request: 0,
      location: 0,
      general: 0,
    };

    recentMessages.forEach((msg) => {
      if (msg.intentDetected && intentCounts[msg.intentDetected] !== undefined) {
        intentCounts[msg.intentDetected]++;
      }
    });

    return {
      success: true,
      data: {
        conversations: {
          total: totalConversations,
          active: activeConversations,
          closed: closedConversations,
          escalated: escalatedConversations,
        },
        funnel: funnelStages,
        leads: {
          total: totalLeads,
          qualified: qualifiedLeadsCount,
          conversionRate,
          averageScore: averageLeadScore,
        },
        escalations: {
          total: escalations.length,
          pending: escalations.filter((e) => e.status === "pending").length,
          resolved: escalations.filter((e) => e.status === "resolved").length,
        },
        feedback: {
          total: feedbackList.length,
          averageRating,
        },
        intents: intentCounts,
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load analytics" };
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 5: Custom User Administration Actions
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Retrieves a list of users inside the organization, supporting search, status filters, and pagination.
 */
export async function getAdminUsersAction(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { organizationId } = await assertAdmin();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    // Build conditions based on search and status filters
    const searchFilter = params.search
      ? or(ilike(users.name, `%${params.search}%`), ilike(users.email, `%${params.search}%`))
      : undefined;

    const statusFilter = params.status && params.status !== "all"
      ? eq(users.status, params.status)
      : undefined;

    // Construct query filters
    const conditions = [];
    conditions.push(sql`users.id IN (SELECT user_id FROM memberships WHERE organization_id = ${organizationId})`);
    if (searchFilter) conditions.push(searchFilter);
    if (statusFilter) conditions.push(statusFilter);

    const filterCondition = and(...conditions);

    // Get users list
    const userRecords = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        status: users.status,
        createdAt: users.createdAt,
        role: memberships.role,
      })
      .from(users)
      .innerJoin(memberships, and(eq(memberships.userId, users.id), eq(memberships.organizationId, organizationId)))
      .where(filterCondition)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [totalRes] = await db
      .select({ value: count(users.id) })
      .from(users)
      .innerJoin(memberships, and(eq(memberships.userId, users.id), eq(memberships.organizationId, organizationId)))
      .where(filterCondition);

    const totalCount = totalRes?.value || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      users: userRecords,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error: any) {
    console.error("getAdminUsersAction error:", error);
    return { success: false, error: error.message || "Failed to load users" };
  }
}

/**
 * Returns detail side-panel info for selected user: profile details, sessions, login history, and audit trail.
 */
export async function getAdminUserProfileDetailAction(targetUserId: string) {
  try {
    const { organizationId } = await assertAdmin();

    // Verify target user is in same organization
    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "Access Denied: User not in your organization" };
    }

    const [userRecord] = await db.select().from(users).where(eq(users.id, targetUserId)).limit(1);
    if (!userRecord) return { success: false, error: "User not found" };

    const [profileRecord] = await db.select().from(profiles).where(eq(profiles.userId, targetUserId)).limit(1);
    
    const userSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, targetUserId))
      .orderBy(desc(sessions.createdAt));

    const history = await db
      .select()
      .from(loginHistory)
      .where(eq(loginHistory.userId, targetUserId))
      .orderBy(desc(loginHistory.loginAt))
      .limit(10);

    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.userId, targetUserId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(20);

    return {
      success: true,
      data: {
        user: {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          firstName: userRecord.firstName,
          lastName: userRecord.lastName,
          avatar: userRecord.avatar,
          status: userRecord.status,
          createdAt: userRecord.createdAt,
          suspendedAt: userRecord.suspendedAt,
          deletedAt: userRecord.deletedAt,
          role: membershipRecord.role,
        },
        profile: profileRecord || null,
        sessions: userSessions,
        history,
        auditLogs: logs,
      },
    };
  } catch (error: any) {
    console.error("getAdminUserProfileDetailAction error:", error);
    return { success: false, error: error.message || "Failed to load user details" };
  }
}

/**
 * Suspends user account and invalidates all session tokens.
 */
export async function suspendUserAction(targetUserId: string) {
  try {
    const { userId: adminUserId, organizationId } = await assertAdmin();

    // Verify target membership and prevent self-suspension
    if (targetUserId === adminUserId) {
      return { success: false, error: "You cannot suspend your own administrative account" };
    }

    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "User not found in your organization" };
    }

    await db
      .update(users)
      .set({ status: "suspended", suspendedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    // Force log out the suspended user from all active connections
    await logoutAllDevices(targetUserId);

    await auditService.log({
      userId: adminUserId,
      action: "user_suspension",
      resource: "users",
      resourceId: targetUserId,
      metadata: { targetUserId },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("suspendUserAction error:", error);
    return { success: false, error: error.message || "Failed to suspend user" };
  }
}

/**
 * Activates suspended user account.
 */
export async function activateUserAction(targetUserId: string) {
  try {
    const { userId: adminUserId, organizationId } = await assertAdmin();

    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "User not found in your organization" };
    }

    await db
      .update(users)
      .set({ status: "active", suspendedAt: null, updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    await auditService.log({
      userId: adminUserId,
      action: "user_activation",
      resource: "users",
      resourceId: targetUserId,
      metadata: { targetUserId },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("activateUserAction error:", error);
    return { success: false, error: error.message || "Failed to activate user" };
  }
}

/**
 * Soft deletes user (sets status to 'deactivated' and deleted_at = now).
 */
export async function deleteUserAction(targetUserId: string) {
  try {
    const { userId: adminUserId, organizationId } = await assertAdmin();

    if (targetUserId === adminUserId) {
      return { success: false, error: "You cannot delete your own administrative account" };
    }

    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "User not found in your organization" };
    }

    await db
      .update(users)
      .set({ status: "deactivated", deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    await logoutAllDevices(targetUserId);

    await auditService.log({
      userId: adminUserId,
      action: "user_deletion",
      resource: "users",
      resourceId: targetUserId,
      metadata: { targetUserId },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("deleteUserAction error:", error);
    return { success: false, error: error.message || "Failed to delete user" };
  }
}

/**
 * Restores a soft-deleted user.
 */
export async function restoreUserAction(targetUserId: string) {
  try {
    const { userId: adminUserId, organizationId } = await assertAdmin();

    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "User not found in your organization" };
    }

    await db
      .update(users)
      .set({ status: "active", deletedAt: null, updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    await auditService.log({
      userId: adminUserId,
      action: "user_restoration",
      resource: "users",
      resourceId: targetUserId,
      metadata: { targetUserId },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("restoreUserAction error:", error);
    return { success: false, error: error.message || "Failed to restore user" };
  }
}

/**
 * Resets user password (administrator override).
 */
export async function resetUserPasswordAction(targetUserId: string, newPasswordVal: string) {
  try {
    const { userId: adminUserId, organizationId } = await assertAdmin();

    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "User not found in your organization" };
    }

    const [user] = await db.select().from(users).where(eq(users.id, targetUserId)).limit(1);
    if (!user) return { success: false, error: "User not found" };

    // Validate password complexity
    const strengthResult = analyzePasswordStrength(newPasswordVal, user.email, user.firstName || "", user.lastName || "");
    if (strengthResult.score < 4) {
      return {
        success: false,
        error: "Password does not meet complexity requirements: " + strengthResult.unmetRequirements.join(", "),
      };
    }

    const passwordHashVal = await hashPassword(newPasswordVal);

    await db
      .update(users)
      .set({ passwordHash: passwordHashVal, updatedAt: new Date() })
      .where(eq(users.id, targetUserId));

    // Force logout target user so they must log in using the newly assigned password
    await logoutAllDevices(targetUserId);

    await auditService.log({
      userId: adminUserId,
      action: "admin_password_reset",
      resource: "users",
      resourceId: targetUserId,
      metadata: { targetUserId },
    });

    return { success: true };
  } catch (error: any) {
    console.error("resetUserPasswordAction error:", error);
    return { success: false, error: error.message || "Failed to reset user password" };
  }
}

/**
 * Forcefully logs out user from all active connections.
 */
export async function forceLogoutUserAction(targetUserId: string) {
  try {
    const { userId: adminUserId, organizationId } = await assertAdmin();

    const [membershipRecord] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, targetUserId), eq(memberships.organizationId, organizationId)))
      .limit(1);

    if (!membershipRecord) {
      return { success: false, error: "User not found in your organization" };
    }

    await logoutAllDevices(targetUserId);

    await auditService.log({
      userId: adminUserId,
      action: "force_logout",
      resource: "sessions",
      resourceId: targetUserId,
      metadata: { targetUserId },
    });

    return { success: true };
  } catch (error: any) {
    console.error("forceLogoutUserAction error:", error);
    return { success: false, error: error.message || "Failed to force logout user" };
  }
}
