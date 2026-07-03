import { eq } from "drizzle-orm";
import { db } from "../db";
import { vectorEmbeddings } from "../db/schema";

export interface NewVectorEmbedding {
  organizationId: string;
  chunkId: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

export const embeddingsRepository = {
  async listByChunk(chunkId: string) {
    return db
      .select()
      .from(vectorEmbeddings)
      .where(eq(vectorEmbeddings.chunkId, chunkId));
  },

  async create(embedding: NewVectorEmbedding) {
    const [newEmbedding] = await db.insert(vectorEmbeddings).values(embedding).returning();
    return newEmbedding;
  },

  async deleteByChunk(chunkId: string) {
    await db.delete(vectorEmbeddings).where(eq(vectorEmbeddings.chunkId, chunkId));
  },
};
