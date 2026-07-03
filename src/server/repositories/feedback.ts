import { eq, avg } from "drizzle-orm";
import { db } from "../db";
import { conversationFeedback } from "../db/schema";

export interface NewConversationFeedback {
  organizationId: string;
  conversationId: string;
  rating: number;
  comments?: string | null;
}

export const feedbackRepository = {
  async listByConversation(conversationId: string) {
    return db
      .select()
      .from(conversationFeedback)
      .where(eq(conversationFeedback.conversationId, conversationId))
      .orderBy(conversationFeedback.createdAt);
  },

  async create(fb: NewConversationFeedback) {
    const [newFb] = await db.insert(conversationFeedback).values(fb).returning();
    return newFb;
  },

  async getAverageRating(organizationId: string) {
    const [result] = await db
      .select({ value: avg(conversationFeedback.rating) })
      .from(conversationFeedback)
      .where(eq(conversationFeedback.organizationId, organizationId));
    return result?.value ? parseFloat(result.value) : 0;
  },
};
