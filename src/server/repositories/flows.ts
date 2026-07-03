import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { qualificationFlows } from "../db/schema";

export interface NewQualificationQuestion {
  organizationId: string;
  question: string;
  answerType: "text" | "single_select" | "multi_select" | "number";
  options?: string[] | null;
  isRequired?: boolean;
  order?: number;
}

export const flowsRepository = {
  async list(organizationId: string) {
    return db
      .select()
      .from(qualificationFlows)
      .where(eq(qualificationFlows.organizationId, organizationId))
      .orderBy(qualificationFlows.order);
  },

  async create(item: NewQualificationQuestion) {
    const [newItem] = await db.insert(qualificationFlows).values(item).returning();
    return newItem;
  },

  async update(id: string, organizationId: string, item: Partial<NewQualificationQuestion>) {
    const [updated] = await db
      .update(qualificationFlows)
      .set({ ...item, updatedAt: new Date() })
      .where(and(eq(qualificationFlows.id, id), eq(qualificationFlows.organizationId, organizationId)))
      .returning();
    return updated;
  },

  async delete(id: string, organizationId: string) {
    await db
      .delete(qualificationFlows)
      .where(and(eq(qualificationFlows.id, id), eq(qualificationFlows.organizationId, organizationId)));
  },
};
