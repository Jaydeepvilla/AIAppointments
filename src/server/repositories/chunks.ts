import { eq } from "drizzle-orm";
import { db } from "../db";
import { knowledgeChunks } from "../db/schema";

export interface NewKnowledgeChunk {
  organizationId: string;
  documentId: string;
  content: string;
  chunkIndex: number;
  tokenCount: number;
  metadata?: Record<string, any>;
}

export const chunksRepository = {
  async listByDocument(documentId: string) {
    return db
      .select()
      .from(knowledgeChunks)
      .where(eq(knowledgeChunks.documentId, documentId))
      .orderBy(knowledgeChunks.chunkIndex);
  },

  async create(chunk: NewKnowledgeChunk) {
    const [newChunk] = await db.insert(knowledgeChunks).values(chunk).returning();
    return newChunk;
  },

  async createMany(chunks: NewKnowledgeChunk[]) {
    if (chunks.length === 0) return [];
    return db.insert(knowledgeChunks).values(chunks).returning();
  },

  async deleteByDocument(documentId: string) {
    await db.delete(knowledgeChunks).where(eq(knowledgeChunks.documentId, documentId));
  },
};
