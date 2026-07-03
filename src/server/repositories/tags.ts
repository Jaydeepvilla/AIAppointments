import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { knowledgeTags, knowledgeDocumentTags } from "../db/schema";

export interface NewKnowledgeTag {
  organizationId: string;
  name: string;
  slug: string;
}

export const tagsRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(knowledgeTags)
      .where(eq(knowledgeTags.organizationId, organizationId))
      .orderBy(knowledgeTags.name);
  },

  async getBySlug(organizationId: string, slug: string) {
    const [tag] = await db
      .select()
      .from(knowledgeTags)
      .where(and(eq(knowledgeTags.organizationId, organizationId), eq(knowledgeTags.slug, slug)));
    return tag || null;
  },

  async create(tag: NewKnowledgeTag) {
    const [newTag] = await db.insert(knowledgeTags).values(tag).returning();
    return newTag;
  },

  async delete(id: string) {
    await db.delete(knowledgeTags).where(eq(knowledgeTags.id, id));
  },

  async addTagToDocument(documentId: string, tagId: string) {
    const [newLink] = await db
      .insert(knowledgeDocumentTags)
      .values({ documentId, tagId })
      .returning();
    return newLink;
  },

  async removeTagFromDocument(documentId: string, tagId: string) {
    await db
      .delete(knowledgeDocumentTags)
      .where(
        and(
          eq(knowledgeDocumentTags.documentId, documentId),
          eq(knowledgeDocumentTags.tagId, tagId)
        )
      );
  },

  async listTagsForDocument(documentId: string) {
    return db
      .select({
        id: knowledgeTags.id,
        name: knowledgeTags.name,
        slug: knowledgeTags.slug,
      })
      .from(knowledgeDocumentTags)
      .innerJoin(knowledgeTags, eq(knowledgeDocumentTags.tagId, knowledgeTags.id))
      .where(eq(knowledgeDocumentTags.documentId, documentId));
  },
};
