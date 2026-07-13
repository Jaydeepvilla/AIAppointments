import { SmartNotification, GroupedNotifications } from "./types";

/**
 * Deduplicates notifications by ruleId.
 * Keeps only the most recent one.
 */
export function deduplicateNotifications(notifications: SmartNotification[]): SmartNotification[] {
  const seenRules = new Set<string>();
  const result: SmartNotification[] = [];

  for (const notif of notifications) {
    const ruleId = notif.metadata?.ruleId || notif.id;
    if (!seenRules.has(ruleId)) {
      seenRules.add(ruleId);
      result.push(notif);
    }
  }

  return result;
}

/**
 * Group notifications according to dashboard widget requirements:
 * - whatsNext: Single highest priority next action (category: setup / priority: high/urgent / low read/dismiss status)
 * - needsAttention: Critical/Warning alerts (category: alert / severity: critical/warning)
 * - aiImprovements: category: ai_improvement
 * - websiteUpdates: category: website_change
 * - knowledgeUpdates: category: knowledge
 * - recent: All active sorted by date
 */
export function groupNotifications(notifications: SmartNotification[]): GroupedNotifications {
  const now = new Date();

  // Filter out dismissed, snoozed, and expired notifications
  const active = notifications.filter((n) => {
    if (n.isDismissed) return false;
    if (n.snoozeUntil && new Date(n.snoozeUntil) > now) return false;
    if (n.expiresAt && new Date(n.expiresAt) < now) return false;
    return true;
  });

  // Deduplicate
  const uniqueActive = deduplicateNotifications(active);

  // Whats Next Action: Sort by priority, severity, and date
  const sortedForNext = [...uniqueActive].sort((a, b) => {
    const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
    const severityWeight = { critical: 3, warning: 2, info: 1 };

    const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    if (pDiff !== 0) return pDiff;

    const sDiff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
    if (sDiff !== 0) return sDiff;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Find the single highest priority "setup" category notification for What's Next
  const whatsNext = sortedForNext.find((n) => n.category === "setup") || sortedForNext[0] || null;

  // Group other notifications
  const needsAttention = uniqueActive.filter(
    (n) => n.id !== whatsNext?.id && (n.category === "alert" || n.severity === "critical" || n.severity === "warning")
  );

  const aiImprovements = uniqueActive.filter(
    (n) => n.id !== whatsNext?.id && n.category === "ai_improvement"
  );

  const websiteUpdates = uniqueActive.filter(
    (n) => n.id !== whatsNext?.id && n.category === "website_change"
  );

  const knowledgeUpdates = uniqueActive.filter(
    (n) => n.id !== whatsNext?.id && n.category === "knowledge"
  );

  return {
    whatsNext,
    needsAttention,
    aiImprovements,
    websiteUpdates,
    knowledgeUpdates,
    recent: uniqueActive.slice(0, 10),
  };
}

/**
 * Calculates snooze expiration date based on input minutes.
 */
export function calculateSnoozeDate(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
