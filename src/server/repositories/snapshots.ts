import { eq, desc, and, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { businessSnapshots } from "../db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type BusinessSnapshot = InferSelectModel<typeof businessSnapshots>;
export type NewBusinessSnapshot = InferInsertModel<typeof businessSnapshots>;

export const snapshotRepository = {
  async save(data: NewBusinessSnapshot) {
    const [snapshot] = await db.insert(businessSnapshots).values(data).returning();
    return snapshot;
  },

  async getLatest(organizationId: string) {
    const [snapshot] = await db
      .select()
      .from(businessSnapshots)
      .where(eq(businessSnapshots.organizationId, organizationId))
      .orderBy(desc(businessSnapshots.createdAt))
      .limit(1);
    return snapshot || null;
  },

  async getForPeriod(organizationId: string, startDate: Date, endDate: Date) {
    return db
      .select()
      .from(businessSnapshots)
      .where(
        and(
          eq(businessSnapshots.organizationId, organizationId),
          gte(businessSnapshots.createdAt, startDate),
          lte(businessSnapshots.createdAt, endDate)
        )
      )
      .orderBy(desc(businessSnapshots.createdAt));
  },
};
