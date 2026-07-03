import { eq } from "drizzle-orm";
import { db } from "../db";
import { conversationMessages } from "../db/schema";

export interface NewConversationMessage {
  organizationId: string;
  conversationId: string;
  sender: "user" | "assistant" | "system";
  content: string;
  intentDetected?: string | null;
  confidenceScore?: string;
  citations?: Array<{
    docId: string;
    chunkId: string;
    name: string;
    content: string;
  }>;
}

export const messagesRepository = {
  async listByConversation(conversationId: string) {
    return db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.conversationId, conversationId))
      .orderBy(conversationMessages.createdAt);
  },

  async create(msg: NewConversationMessage) {
    const [newMsg] = await db.insert(conversationMessages).values(msg).returning();
    return newMsg;
  },

  async createMany(msgs: NewConversationMessage[]) {
    if (msgs.length === 0) return [];
    return db.insert(conversationMessages).values(msgs).returning();
  },
};
