import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkReminders(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const reminders = state.appointmentReminders || [];
  
  if (reminders.length === 0) {
    recommendations.push({
      id: "appointment-missing-reminders",
      title: "No Appointment Reminders Configured",
      description: "You haven't set up any automated email or SMS reminders for upcoming appointments.",
      primaryCtaText: "Configure Reminders",
      primaryCtaHref: "/settings/appointments/reminders",
      estimatedTimeMinutes: 5,
      impact: "High",
      impactReason: "Automated reminders are the #1 way to reduce no-shows.",
      confidence: 100,
      confidenceReason: "Zero reminders found in the database.",
    });
    return recommendations;
  }

  // Check if they only have one type of reminder
  const hasEmail = reminders.some(r => r.type === "email");
  const hasSms = reminders.some(r => r.type === "sms");

  if (hasEmail && !hasSms) {
    recommendations.push({
      id: "appointment-missing-sms-reminders",
      title: "Missing SMS Reminders",
      description: "You have email reminders configured, but no SMS reminders. Text messages have a much higher open rate.",
      primaryCtaText: "Add SMS Reminders",
      primaryCtaHref: "/settings/appointments/reminders",
      estimatedTimeMinutes: 3,
      impact: "Medium",
      impactReason: "Customers often miss emails but rarely miss texts.",
      confidence: 90,
      confidenceReason: "SMS is missing.",
    });
  }

  // Check timing (e.g. only reminding 1 week in advance, no 24hr reminder)
  // Since sendAt is an absolute timestamp in DB, we'd normally check rule templates if we had them.
  // For this generic check, we'll look at the businessSettings notificationPreferences
  const notifPrefs = state.settings?.notificationPreferences || {};
  if (!notifPrefs.reminderTiming24h) {
    recommendations.push({
      id: "appointment-missing-24h-reminder",
      title: "Missing 24-Hour Reminder",
      description: "You aren't sending a reminder 24 hours before the appointment. This is the most critical time to remind customers.",
      primaryCtaText: "Update Timing",
      primaryCtaHref: "/settings/appointments/reminders",
      estimatedTimeMinutes: 2,
      impact: "High",
      impactReason: "24 hours gives them exactly enough time to cancel within the window or prepare.",
      confidence: 85,
      confidenceReason: "Best practice is 24 hours.",
    });
  }

  return recommendations;
}
