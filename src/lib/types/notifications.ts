export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationSeverity = "info" | "warning" | "critical";
export type NotificationCategory = "setup" | "alert" | "ai_improvement" | "website_change";

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
  actionUrl?: string;
  snoozeUntil?: Date;
  expiresAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsNextAction {
  title: string;
  reason: string;
  estimatedMinutes: number;
  impact: string;
  actionUrl: string;
  ctaText: string;
}

export interface AiImprovement {
  id: string;
  title: string;
  description: string;
  category: string;
  canGenerate: boolean;
  actionUrl?: string;
}

export interface WebsiteChangeAlert {
  id: string;
  type: "new_page" | "updated_page" | "pricing_change" | "deleted_page" | "broken_page";
  url: string;
  description: string;
  detectedAt: Date;
}
