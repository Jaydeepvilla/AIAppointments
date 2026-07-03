import { eq } from "drizzle-orm";
import { db } from "../db";
import { conversationSummaries } from "../db/schema";

export interface NewConversationSummary {
  organizationId: string;
  conversationId: string;
  summaryText: string;
  actionItems?: string[];
  intentsList?: string[];
}

export const summariesRepository = {
  async findByConversation(conversationId: string) {
    const [summary] = await db
      .select()
      .from(conversationSummaries)
      .where(eq(conversationSummaries.conversationId, conversationId));
    return summary || null;
  },

  async upsert(summary: NewConversationSummary) {
    const existing = await this.findByConversation(summary.conversationId);
    if (existing) {
      const [updated] = await db
        .update(conversationSummaries)
        .set({
          summaryText: summary.summaryText,
          actionItems: summary.actionItems || existing.actionItems,
          intentsList: summary.intentsList || existing.intentsList,
        })
        .where(eq(conversationSummaries.conversationId, summary.conversationId))
        .returning();
      return updated;
    } else {
      const [newSummary] = await db
        .insert(conversationSummaries)
        .values({
          organizationId: summary.organizationId,
          conversationId: summary.conversationId,
          summaryText: summary.summaryText,
          actionItems: summary.actionItems || [],
          intentsList: summary.intentsList || [],
        })
        .returning();
      return newSummary;
    }
  },
};
