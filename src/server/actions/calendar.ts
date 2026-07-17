"use server";

import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { calendarConnections, bookingRules } from "../db/schema";
import { membershipRepository } from "../repositories/membership";
import { calendarRepository } from "../repositories/calendar";
import { rulesRepository } from "../repositories/rules";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getCalendarConnectionsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const list = await calendarRepository.listConnections(orgId);
    return { success: true, connections: list };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load calendar connections" };
  }
}

export async function connectCalendarAction(data: {
  staffMemberId?: string | null;
  provider: string;
  email: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: string | null; // ISO Date String
  externalCalendarId?: string | null;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    const expiresDate = data.expiresAt ? new Date(data.expiresAt) : null;
    
    // Upsert logic: if connection for same staff and provider exists, update it
    const existing = await calendarRepository.findConnectionByStaffAndProvider(
      data.staffMemberId || null,
      data.provider
    );

    if (existing) {
      const updated = await calendarRepository.updateConnection(existing.id, {
        email: data.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: expiresDate,
        externalCalendarId: data.externalCalendarId || "primary",
        syncStatus: "active",
      });
      await calendarRepository.logSyncEvent(orgId, existing.id, "sync_started", { action: "reconnected" });
      revalidatePath("/settings");
      return { success: true, connection: updated };
    } else {
      const conn = await calendarRepository.createConnection({
        organizationId: orgId,
        staffMemberId: data.staffMemberId || null,
        provider: data.provider,
        email: data.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: expiresDate,
        externalCalendarId: data.externalCalendarId || "primary",
        syncStatus: "active",
      });
      await calendarRepository.logSyncEvent(orgId, conn.id, "sync_started", { action: "connected" });
      revalidatePath("/settings");
      return { success: true, connection: conn };
    }
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to connect calendar" };
  }
}

export async function disconnectCalendarAction(connectionId: string) {
  try {
    const orgId = await getVerifiedOrgId();

    const [existing] = await db
      .select()
      .from(calendarConnections)
      .where(and(eq(calendarConnections.id, connectionId), eq(calendarConnections.organizationId, orgId)));
    if (!existing) throw new Error("Connection not found");

    await calendarRepository.deleteConnection(connectionId);
    
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to disconnect calendar" };
  }
}

export async function getCalendarSyncLogsAction(connectionId: string) {
  try {
    const orgId = await getVerifiedOrgId();

    const [existing] = await db
      .select()
      .from(calendarConnections)
      .where(and(eq(calendarConnections.id, connectionId), eq(calendarConnections.organizationId, orgId)));
    if (!existing) throw new Error("Connection not found");

    const logs = await calendarRepository.getSyncLogs(connectionId);
    return { success: true, logs };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load sync logs" };
  }
}

// Booking Rules
export async function getBookingRulesAction() {
  try {
    const orgId = await getVerifiedOrgId();
    let rules = await rulesRepository.getByOrganization(orgId);
    
    if (!rules) {
      // Seed default rules
      rules = await rulesRepository.upsert({
        organizationId: orgId,
        minLeadTime: 2,
        maxLookahead: 30,
        defaultBufferBefore: 0,
        defaultBufferAfter: 0,
        allowRescheduling: true,
        allowCancellation: true,
        cancellationLeadTime: 24,
      });
    }

    return { success: true, rules };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load booking rules" };
  }
}

export async function saveBookingRulesAction(data: {
  minLeadTime: number;
  maxLookahead: number;
  defaultBufferBefore: number;
  defaultBufferAfter: number;
  allowRescheduling: boolean;
  allowCancellation: boolean;
  cancellationLeadTime: number;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    const rules = await rulesRepository.upsert({
      organizationId: orgId,
      ...data,
    });

    revalidatePath("/settings");
    return { success: true, rules };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save booking rules" };
  }
}
