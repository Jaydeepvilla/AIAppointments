import { ActivityEngine } from "../activity-engine";
import { NotificationEngine } from "../notification-engine";
import { SetupTaskCategory, ImpactLevel } from "../types/progress";

export interface SystemEvent {
  type: string;
  organizationId: string;
  category: SetupTaskCategory;
  impact: ImpactLevel;
  metadata?: Record<string, any>;
  generateNotification?: boolean;
}

export const EventEngine = {
  /**
   * Dispatches a system event.
   * Logs the activity and optionally triggers notifications.
   */
  async dispatch(event: SystemEvent) {
    // 1. Log Activity
    const activity = await ActivityEngine.logActivity(
      event.organizationId,
      event.type,
      event.category,
      event.impact,
      event.metadata
    );

    // 2. Trigger Notification if needed
    if (event.generateNotification) {
      await NotificationEngine.evaluateEvent(event);
    }

    return activity;
  },
};
