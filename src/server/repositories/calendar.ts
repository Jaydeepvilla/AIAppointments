import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { calendarConnections, calendarSyncLogs } from "../db/schema";

export interface NewCalendarConnection {
  organizationId: string;
  staffMemberId?: string | null;
  provider: string;
  email: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
  externalCalendarId?: string | null;
  syncStatus?: string;
}

export const calendarRepository = {
  async listConnections(organizationId: string) {
    return db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.organizationId, organizationId))
      .orderBy(calendarConnections.provider);
  },

  async findConnectionById(id: string) {
    const [conn] = await db
      .select()
      .from(calendarConnections)
      .where(eq(calendarConnections.id, id));
    return conn || null;
  },

  async findConnectionByStaffAndProvider(staffMemberId: string | null, provider: string) {
    const conditions = [
      eq(calendarConnections.provider, provider),
    ];
    
    if (staffMemberId) {
      conditions.push(eq(calendarConnections.staffMemberId, staffMemberId));
    } else {
      // organization level
      // Drizzle handles null comparison using eq or isNull, let's use isNull or handle in conditions
      // Wait, we can construct the query directly
    }

    let query = db.select().from(calendarConnections);

    if (staffMemberId) {
      return (
        await query.where(
          and(eq(calendarConnections.staffMemberId, staffMemberId), eq(calendarConnections.provider, provider))
        )
      )[0] || null;
    } else {
      // Drizzle raw condition or standard helper: import isNull from drizzle-orm
      // Let's import isNull and use it!
      const { isNull } = require("drizzle-orm");
      return (
        await query.where(
          and(isNull(calendarConnections.staffMemberId), eq(calendarConnections.provider, provider))
        )
      )[0] || null;
    }
  },

  async createConnection(conn: NewCalendarConnection) {
    const [newConn] = await db.insert(calendarConnections).values(conn).returning();
    return newConn;
  },

  async updateConnection(id: string, updates: Partial<NewCalendarConnection>) {
    const [updated] = await db
      .update(calendarConnections)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(calendarConnections.id, id))
      .returning();
    return updated;
  },

  async deleteConnection(id: string) {
    await db.delete(calendarConnections).where(eq(calendarConnections.id, id));
  },

  // Sync Logs
  async logSyncEvent(organizationId: string, connectionId: string, eventType: string, details: Record<string, any>) {
    const [log] = await db
      .insert(calendarSyncLogs)
      .values({
        organizationId,
        connectionId,
        eventType,
        details,
      })
      .returning();
    return log;
  },

  async getSyncLogs(connectionId: string, limit = 20) {
    return db
      .select()
      .from(calendarSyncLogs)
      .where(eq(calendarSyncLogs.connectionId, connectionId))
      .orderBy(desc(calendarSyncLogs.createdAt))
      .limit(limit);
  },
};
