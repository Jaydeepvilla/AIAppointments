export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationSeverity = "info" | "warning" | "critical";
export type NotificationCategory =
  | "setup"
  | "alert"
  | "ai_improvement"
  | "website_change"
  | "knowledge";

export interface SmartNotification {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  priority: NotificationPriority;
  severity: NotificationSeverity;
  category: NotificationCategory;
  isRead: boolean;
  isDismissed: boolean;
  actionUrl?: string | null;
  snoozeUntil?: Date | string | null;
  expiresAt?: Date | string | null;
  metadata: {
    businessImpact?: string;
    sourceEngine?: string;
    actionText?: string;
    reason?: string;
    estimatedMinutes?: number;
    ruleId?: string;
    [key: string]: any;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GroupedNotifications {
  whatsNext: SmartNotification | null;
  needsAttention: SmartNotification[];
  aiImprovements: SmartNotification[];
  websiteUpdates: SmartNotification[];
  knowledgeUpdates: SmartNotification[];
  recent: SmartNotification[];
}
