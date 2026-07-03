"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import {
  conversations,
  leadProfiles,
  escalationRequests,
  conversationMessages,
  conversationEvents,
  conversationFeedback,
  leadAnswers,
} from "../db/schema";
import { membershipRepository } from "../repositories/membership";
import { conversationsRepository } from "../repositories/conversations";
import { messagesRepository } from "../repositories/messages";
import { leadsRepository } from "../repositories/leads";
import { escalationsRepository } from "../repositories/escalations";
import { summariesRepository } from "../repositories/summaries";
import { escalationService } from "../services/escalation";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

// 1. Conversations actions
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

// 2. Leads Actions
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

// 3. Escalations Actions
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

// 4. Analytics Actions
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
