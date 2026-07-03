import { eq } from "drizzle-orm";
import { db } from "../db";
import { bookingRules } from "../db/schema";

export interface NewBookingRules {
  organizationId: string;
  minLeadTime?: number;
  maxLookahead?: number;
  defaultBufferBefore?: number;
  defaultBufferAfter?: number;
  allowRescheduling?: boolean;
  allowCancellation?: boolean;
  cancellationLeadTime?: number;
}

export const rulesRepository = {
  async getByOrganization(organizationId: string) {
    const [rules] = await db
      .select()
      .from(bookingRules)
      .where(eq(bookingRules.organizationId, organizationId));
    return rules || null;
  },

  async upsert(rules: NewBookingRules) {
    const existing = await this.getByOrganization(rules.organizationId);
    if (existing) {
      const [updated] = await db
        .update(bookingRules)
        .set({
          ...rules,
          updatedAt: new Date(),
        })
        .where(eq(bookingRules.organizationId, rules.organizationId))
        .returning();
      return updated;
    } else {
      const [inserted] = await db.insert(bookingRules).values(rules).returning();
      return inserted;
    }
  },
};
