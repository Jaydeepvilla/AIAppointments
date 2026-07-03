import { eq, desc, and } from "drizzle-orm";
import { db } from "../db";
import { escalationRequests } from "../db/schema";

export interface NewEscalationRequest {
  organizationId: string;
  conversationId: string;
  reason: string;
  status?: string;
  notes?: string | null;
}

export const escalationsRepository = {
  async findById(id: string) {
    const [esc] = await db
      .select()
      .from(escalationRequests)
      .where(eq(escalationRequests.id, id));
    return esc || null;
  },

  async findPendingByConversation(conversationId: string) {
    const [esc] = await db
      .select()
      .from(escalationRequests)
      .where(
        and(
          eq(escalationRequests.conversationId, conversationId),
          eq(escalationRequests.status, "pending")
        )
      );
    return esc || null;
  },

  async list(organizationId: string, status?: string) {
    let query = db
      .select()
      .from(escalationRequests)
      .where(eq(escalationRequests.organizationId, organizationId));

    if (status) {
      query = db
        .select()
        .from(escalationRequests)
        .where(
          and(
            eq(escalationRequests.organizationId, organizationId),
            eq(escalationRequests.status, status)
          )
        );
    }

    return query.orderBy(desc(escalationRequests.createdAt));
  },

  async create(esc: NewEscalationRequest) {
    const [newEsc] = await db.insert(escalationRequests).values(esc).returning();
    return newEsc;
  },

  async update(id: string, updates: Partial<NewEscalationRequest>) {
    const [updated] = await db
      .update(escalationRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(escalationRequests.id, id))
      .returning();
    return updated;
  },
};
