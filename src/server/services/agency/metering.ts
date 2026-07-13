import { db } from "../../db";
import { resellerUsage } from "../../db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export type MeteredMetric = "conversations" | "tokens" | "bookings" | "calls" | "messages" | "contacts" | "storage";

export const agencyMetering = {
  /**
   * Retrieves or registers the active usage period row for an organization metric
   */
  async getActiveUsageRow(organizationId: string, metric: MeteredMetric) {
    const now = new Date();

    // Search for active period row
    const activeRow = await db.query.resellerUsage.findFirst({
      where: and(
        eq(resellerUsage.organizationId, organizationId),
        eq(resellerUsage.metricName, metric),
        lte(resellerUsage.billingPeriodStart, now),
        gte(resellerUsage.billingPeriodEnd, now)
      ),
    });

    if (activeRow) {
      return activeRow;
    }

    // Provision new 30-day billing cycle row
    const billingPeriodStart = new Date();
    const billingPeriodEnd = new Date(billingPeriodStart.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Default limit mappings based on standard reseller plans
    let limitCount = 1000; // default safe fallback limit
    if (metric === "conversations") limitCount = 500;
    if (metric === "calls") limitCount = 100;
    if (metric === "bookings") limitCount = 50;
    if (metric === "tokens") limitCount = 250000;

    const [newRow] = await db
      .insert(resellerUsage)
      .values({
        organizationId,
        metricName: metric,
        usageCount: 0,
        limitCount,
        billingPeriodStart,
        billingPeriodEnd,
      })
      .returning();

    return newRow;
  },

  /**
   * Increments consumption metric by amount (e.g. calls, AI token usage)
   */
  async recordUsage(organizationId: string, metric: MeteredMetric, amount = 1): Promise<number> {
    try {
      const activeRow = await this.getActiveUsageRow(organizationId, metric);

      const [updated] = await db
        .update(resellerUsage)
        .set({
          usageCount: activeRow.usageCount + amount,
          updatedAt: new Date(),
        })
        .where(eq(resellerUsage.id, activeRow.id))
        .returning();

      return updated.usageCount;
    } catch (e) {
      console.error("[Agency Metering] Failed to record usage count:", e);
      return 0;
    }
  },

  /**
   * Verifies if client organization has available quota for a metric
   */
  async checkQuotaAvailable(organizationId: string, metric: MeteredMetric): Promise<boolean> {
    try {
      const activeRow = await this.getActiveUsageRow(organizationId, metric);
      if (!activeRow.limitCount) {
        return true; // unlimited
      }

      const isWithinLimit = activeRow.usageCount < activeRow.limitCount;
      if (!isWithinLimit) {
        console.warn(`[Agency Metering] Quota exceeded for org ${organizationId} on metric "${metric}". Usage: ${activeRow.usageCount}/${activeRow.limitCount}`);
      }
      return isWithinLimit;
    } catch (e) {
      console.error("[Agency Metering] Failed to verify quota:", e);
      return true; // fail open to not block core services
    }
  },

  /**
   * Returns a breakdown of all resource usage for an organization
   */
  async getUsageBreakdown(organizationId: string) {
    const now = new Date();
    return db
      .select()
      .from(resellerUsage)
      .where(
        and(
          eq(resellerUsage.organizationId, organizationId),
          lte(resellerUsage.billingPeriodStart, now),
          gte(resellerUsage.billingPeriodEnd, now)
        )
      );
  }
};
