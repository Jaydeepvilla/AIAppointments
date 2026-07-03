import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { knowledgeSources } from "../db/schema";

export interface NewKnowledgeSource {
  organizationId: string;
  name: string;
  type: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export const sourcesRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(knowledgeSources)
      .where(eq(knowledgeSources.organizationId, organizationId))
      .orderBy(knowledgeSources.createdAt);
  },

  async getById(id: string) {
    const [item] = await db
      .select()
      .from(knowledgeSources)
      .where(eq(knowledgeSources.id, id));
    return item || null;
  },

  async getByType(organizationId: string, type: string) {
    const [item] = await db
      .select()
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.organizationId, organizationId),
          eq(knowledgeSources.type, type)
        )
      );
    return item || null;
  },

  async create(item: NewKnowledgeSource) {
    const [newItem] = await db.insert(knowledgeSources).values(item).returning();
    return newItem;
  },

  async update(id: string, item: Partial<NewKnowledgeSource>) {
    const [updated] = await db
      .update(knowledgeSources)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(knowledgeSources.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(knowledgeSources).where(eq(knowledgeSources.id, id));
  },
};
