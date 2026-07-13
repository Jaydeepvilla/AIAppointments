import { activityRepository } from "@/server/repositories/activity";

export const HistoryEngine = {
  /**
   * Get the most recent setup tasks completed by the organization.
   */
  async getRecentlyCompletedTasks(organizationId: string, limit = 10) {
    const history = await activityRepository.list(organizationId, limit);
    return history.map(log => ({
      task: log.task,
      completedAt: log.createdAt,
      businessImpact: log.impact,
      category: log.category
    }));
  },

  /**
   * Get activities from the last N days.
   */
  async getActivitiesSince(organizationId: string, daysAgo: number = 7) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return activityRepository.getSince(organizationId, date);
  }
};
