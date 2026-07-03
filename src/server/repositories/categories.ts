import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { knowledgeCategories } from "../db/schema";

export interface NewKnowledgeCategory {
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
}

export const categoriesRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(knowledgeCategories)
      .where(eq(knowledgeCategories.organizationId, organizationId))
      .orderBy(knowledgeCategories.name);
  },

  async getById(id: string) {
    const [item] = await db
      .select()
      .from(knowledgeCategories)
      .where(eq(knowledgeCategories.id, id));
    return item || null;
  },

  async getBySlug(organizationId: string, slug: string) {
    const [item] = await db
      .select()
      .from(knowledgeCategories)
      .where(
        and(
          eq(knowledgeCategories.organizationId, organizationId),
          eq(knowledgeCategories.slug, slug)
        )
      );
    return item || null;
  },

  async create(item: NewKnowledgeCategory) {
    const [newItem] = await db.insert(knowledgeCategories).values(item).returning();
    return newItem;
  },

  async update(id: string, item: Partial<NewKnowledgeCategory>) {
    const [updated] = await db
      .update(knowledgeCategories)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(knowledgeCategories.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(knowledgeCategories).where(eq(knowledgeCategories.id, id));
  },
};
