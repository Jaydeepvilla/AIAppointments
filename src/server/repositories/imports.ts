import { eq } from "drizzle-orm";
import { db } from "../db";
import { websiteImports } from "../db/schema";

export interface NewWebsiteImport {
  organizationId: string;
  sourceId: string;
  url: string;
  status: string;
  pagesFound?: number;
  pagesScraped?: number;
  errorMessage?: string | null;
  metadata?: Record<string, any>;
}

export const importsRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(websiteImports)
      .where(eq(websiteImports.organizationId, organizationId))
      .orderBy(websiteImports.createdAt);
  },

  async getById(id: string) {
    const [item] = await db
      .select()
      .from(websiteImports)
      .where(eq(websiteImports.id, id));
    return item || null;
  },

  async create(item: NewWebsiteImport) {
    const [newItem] = await db.insert(websiteImports).values(item).returning();
    return newItem;
  },

  async update(id: string, item: Partial<NewWebsiteImport>) {
    const [updated] = await db
      .update(websiteImports)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(websiteImports.id, id))
      .returning();
    return updated;
  },
};
