import { activityRepository } from "@/server/repositories/activity";
import { SetupTaskCategory, ImpactLevel } from "../types/progress";

export const ActivityEngine = {
  /**
   * Logs a business activity setup event.
   */
  async logActivity(
    organizationId: string, 
    task: string, 
    category: SetupTaskCategory, 
    impact: ImpactLevel = "medium",
    metadata: Record<string, any> = {}
  ) {
    return activityRepository.log({
      organizationId,
      task,
      category,
      impact,
      metadata
    });
  },

  /**
   * Gets the recent activity history for an organization.
   */
  async getHistory(organizationId: string, limit = 10) {
    return activityRepository.list(organizationId, limit);
  }
};
