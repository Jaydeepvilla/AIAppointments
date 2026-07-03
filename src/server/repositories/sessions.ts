import { eq } from "drizzle-orm";
import { db } from "../db";
import { conversationSessions } from "../db/schema";

export interface NewConversationSession {
  organizationId: string;
  conversationId: string;
  state: Record<string, any>;
  expiresAt?: Date | null;
}

export const sessionsRepository = {
  async findByConversation(conversationId: string) {
    const [sess] = await db
      .select()
      .from(conversationSessions)
      .where(eq(conversationSessions.conversationId, conversationId));
    return sess || null;
  },

  async upsert(session: NewConversationSession) {
    // Attempt to update first, if not exists then insert
    const existing = await this.findByConversation(session.conversationId);
    if (existing) {
      const [updated] = await db
        .update(conversationSessions)
        .set({
          state: session.state,
          expiresAt: session.expiresAt !== undefined ? session.expiresAt : existing.expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(conversationSessions.conversationId, session.conversationId))
        .returning();
      return updated;
    } else {
      const [newSess] = await db
        .insert(conversationSessions)
        .values(session)
        .returning();
      return newSess;
    }
  },

  async delete(conversationId: string) {
    await db
      .delete(conversationSessions)
      .where(eq(conversationSessions.conversationId, conversationId));
  },
};
