import { notificationRepository } from "@/server/repositories/notifications";
import { SmartNotification } from "./types";

export const NotificationHistory = {
  /**
   * Retrieves active, non-dismissed notifications for an organization from DB.
   */
  async getActiveNotifications(orgId: string): Promise<SmartNotification[]> {
    const list = await notificationRepository.list(orgId, 50);
    return list.map((record) => ({
      id: record.id,
      organizationId: record.organizationId,
      title: record.title,
      description: record.description,
      priority: record.priority as any,
      severity: record.severity as any,
      category: record.category as any,
      isRead: record.isRead,
      isDismissed: record.isDismissed,
      actionUrl: record.actionUrl,
      snoozeUntil: record.snoozeUntil,
      expiresAt: record.expiresAt,
      metadata: record.metadata as any,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));
  },

  /**
   * Saves a new notification to the database.
   */
  async createNotification(data: Omit<SmartNotification, "id" | "isRead" | "isDismissed" | "createdAt" | "updatedAt">) {
    return notificationRepository.create({
      organizationId: data.organizationId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      severity: data.severity,
      category: data.category,
      actionUrl: data.actionUrl || null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      snoozeUntil: data.snoozeUntil ? new Date(data.snoozeUntil) : null,
      metadata: data.metadata || {},
    });
  },

  /**
   * Snoozes a notification until a future date.
   */
  async snooze(id: string, until: Date) {
    return notificationRepository.snooze(id, until);
  },

  /**
   * Dismisses a notification permanently.
   */
  async dismiss(id: string) {
    return notificationRepository.dismiss(id);
  },

  /**
   * Marks a notification as read.
   */
  async markAsRead(id: string) {
    return notificationRepository.markAsRead(id);
  },
};
