import { eq, desc, and, gte } from "drizzle-orm";
import { db } from "../db";
import { businessActivityLog } from "../db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type ActivityLog = InferSelectModel<typeof businessActivityLog>;
export type NewActivityLog = InferInsertModel<typeof businessActivityLog>;

export const activityRepository = {
  async log(data: NewActivityLog) {
    const [log] = await db.insert(businessActivityLog).values(data).returning();
    return log;
  },

  async list(organizationId: string, limit = 50) {
    return db
      .select()
      .from(businessActivityLog)
      .where(eq(businessActivityLog.organizationId, organizationId))
      .orderBy(desc(businessActivityLog.createdAt))
      .limit(limit);
  },

  async getSince(organizationId: string, date: Date) {
    return db
      .select()
      .from(businessActivityLog)
      .where(
        and(
          eq(businessActivityLog.organizationId, organizationId),
          gte(businessActivityLog.createdAt, date)
        )
      )
      .orderBy(desc(businessActivityLog.createdAt));
  },
};
