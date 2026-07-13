import { snapshotRepository } from "@/server/repositories/snapshots";
import { OverallHealthResult } from "../health-engine/overall";

export const SnapshotEngine = {
  /**
   * Save a snapshot of the business's current state to the database.
   */
  async saveSnapshot(organizationId: string, healthState: OverallHealthResult, progressPercentage: number, readinessScore: number) {
    return snapshotRepository.save({
      organizationId,
      healthScore: healthState.overallScore,
      knowledgeScore: healthState.modules.knowledge.score,
      crmScore: healthState.modules.channels.score,
      websiteScore: healthState.modules.staff.score,
      aiScore: healthState.modules.billing.score,
      automationScore: healthState.modules.booking.score,
      bookingScore: healthState.modules.booking.score,
      progressPercentage,
      readinessScore
    });
  },

  /**
   * Get the latest snapshot to compare against.
   */
  async getLatestSnapshot(organizationId: string) {
    return snapshotRepository.getLatest(organizationId);
  },

  /**
   * Get the trend over a specific period.
   */
  async getHistoricalData(organizationId: string, daysAgo: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    return snapshotRepository.getForPeriod(organizationId, startDate, endDate);
  }
};
