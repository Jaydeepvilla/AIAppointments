import { BusinessState, HealthScoreResult } from "../health-engine/types";
import { generateAppointmentRecommendations } from "../appointment-engine";

export function calculateAppointmentQualityScore(state: BusinessState): HealthScoreResult {
  let score = 100;
  const missingRequirements: string[] = [];
  const exactActions: string[] = [];
  const recommendations: string[] = [];
  
  const hasCalendar = (state.calendarConnections && state.calendarConnections.length > 0) || !!state.settings?.googleCalendarId || !!state.settings?.outlookCalendarId;
  const services = state.services || [];
  
  // 1. Calendar connection check
  if (!hasCalendar) {
    score -= 25;
    missingRequirements.push("Calendar Sync");
    exactActions.push("Sync a Google or Outlook calendar to manage slot availability");
  } else {
    recommendations.push("Calendar linked successfully");
  }

  // 2. Services check
  if (services.length === 0) {
    score -= 25;
    missingRequirements.push("Active Services");
    exactActions.push("Configure at least one service with price and duration");
  } else {
    recommendations.push(`${services.length} services configured`);
  }

  // 3. Cancellation policy cutoff check
  const allowCancel = state.settings?.bookingPreferences?.allowCancellation ?? true;
  const cancelLeadTime = state.settings?.bookingPreferences?.cancellationLeadTime ?? 24;
  if (!allowCancel || !cancelLeadTime || cancelLeadTime < 12) {
    score -= 25;
    missingRequirements.push("Cancellation Cutoff");
    exactActions.push("Configure cancellation policies and set lead times to at least 12 hours");
  } else {
    recommendations.push(`Cancellation policy set at ${cancelLeadTime}h cutoff`);
  }

  // 4. Deposits check
  const highValueServices = services.filter(s => s.price && parseFloat(s.price) >= 100);
  const depositEnabled = state.settings?.bookingPreferences?.depositEnabled ?? false;
  if (highValueServices.length > 0 && !depositEnabled) {
    score -= 25;
    missingRequirements.push("Deposit Policies");
    exactActions.push("Enable card deposits for premium services over $100 to reduce no-shows");
  } else if (highValueServices.length > 0 && depositEnabled) {
    recommendations.push("Stripe deposits enabled for premium services");
  }

  let status: HealthScoreResult["status"] = "Excellent";
  if (score < 50) status = "Critical";
  else if (score < 80) status = "Needs Attention";
  else if (score < 95) status = "Good";

  const formula = "Score = 100% - 25% (No Calendar Linked) - 25% (No Services Configured) - 25% (Cutoff < 12h) - 25% (High Value with No Deposits)";
  let whyLow = "Your calendar configuration has structural vulnerabilities, leaving you open to double-bookings or unpaid no-shows.";
  if (score === 100) {
    whyLow = "Excellent! Operating schedules, synced calendars, and protection rules are fully set up.";
  } else if (score >= 75) {
    whyLow = "Your booking setup is functional, but lacks advanced cancellation or deposit protections.";
  }

  return {
    score,
    status,
    reason: score === 100 ? "All booking systems and rules are fully configured." : "Your booking configuration needs attention to protect calendar space.",
    confidence: 100,
    missingRequirements,
    recommendations,
    lastUpdated: new Date().toISOString(),
    maxScore: 100,
    formula,
    whyLow,
    exactActions,
  };
}
