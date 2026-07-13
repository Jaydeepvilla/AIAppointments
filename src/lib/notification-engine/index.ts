import { NotificationCenter } from "./center";
import { NotificationHistory } from "./history";
import { groupNotifications, deduplicateNotifications } from "./utils";
import { RulesEngineState } from "./rules";
import { SmartNotification, NotificationPriority, NotificationSeverity, NotificationCategory } from "./types";
import { SystemEvent } from "../event-engine";

export * from "./types";
export * from "./utils";
export * from "./rules";
export * from "./history";
export * from "./center";

export const NotificationEngine = {
  /**
   * Evaluates a system event and decides whether to create a notification.
   * Maintains backward compatibility for EventEngine.
   */
  async evaluateEvent(event: SystemEvent) {
    const recent = await NotificationHistory.getActiveNotifications(event.organizationId);
    const isDuplicate = recent.some((n) =>
      n.category === (event.type.includes("alert") ? "alert" : "setup") &&
      n.title.includes(event.category)
    );

    if (isDuplicate) {
      return null;
    }

    let priority: NotificationPriority = "medium";
    let severity: NotificationSeverity = "info";
    let category: NotificationCategory = "setup";
    let title = "Setup Update";
    let description = `Activity detected in ${event.category.replace("_", " ")}`;

    if (event.impact === "critical") {
      priority = "urgent";
      severity = "critical";
      category = "alert";
      title = "Action Required";
    } else if (event.impact === "high") {
      priority = "high";
      severity = "warning";
      category = "setup";
    }

    return NotificationHistory.createNotification({
      organizationId: event.organizationId,
      title,
      description,
      priority,
      severity,
      category,
      metadata: event.metadata || {},
    });
  },

  /**
   * Evaluates the setup state and synchronizes database smart notifications.
   */
  async sync(orgId: string, state: RulesEngineState): Promise<SmartNotification[]> {
    return NotificationCenter.syncNotifications(orgId, state);
  },

  /**
   * Retrieves active, grouped notifications for the UI.
   */
  async getSmartNotifications(orgId: string) {
    const list = await NotificationHistory.getActiveNotifications(orgId);
    return list;
  },

  /**
   * Dismisses a notification.
   */
  async dismiss(id: string) {
    return NotificationHistory.dismiss(id);
  },

  /**
   * Marks a notification as read.
   */
  async markAsRead(id: string) {
    return NotificationHistory.markAsRead(id);
  },

  /**
   * Snoozes a notification until a future date.
   */
  async snooze(id: string, until: Date) {
    return NotificationHistory.snooze(id, until);
  },
};
