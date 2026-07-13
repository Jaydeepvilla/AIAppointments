import { BusinessState, HealthScoreResult, ReadyStatus } from "../types";

export function calculateBookingReadiness(state: BusinessState): HealthScoreResult {
  let score = 0;
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;

  // 1. Business Hours (20%)
  if (state.settings?.businessHours && Object.keys(state.settings.businessHours).length > 0) {
    score += 20;
  } else {
    missingRequirements.push("Business Hours");
    recommendations.push("Set your operating hours so customers know when you are open.");
  }

  // 2. Services (30%)
  if (state.services && state.services.length > 0) {
    score += 30;
  } else {
    missingRequirements.push("Services");
    recommendations.push("Add at least one service that customers can book.");
    confidence -= 20; // High confidence drop if no services exist
  }

  // 3. Staff/Calendar (20%)
  if (state.staff && state.staff.length > 0) {
    score += 20;
  } else {
    missingRequirements.push("Staff or Calendar Sync");
    recommendations.push("Assign staff members or sync a calendar to handle appointments.");
  }

  // 4. Booking Rules & Policies (30%)
  // E.g., Cancellation policy, buffers, confirmation messages
  let rulesScore = 0;
  if (state.settings?.cancellationPolicy) rulesScore += 10;
  else recommendations.push("Add a cancellation policy to reduce no-shows.");

  if (state.settings?.scheduling?.bufferTime !== undefined) rulesScore += 10;
  else recommendations.push("Set buffer times between appointments to prevent overlapping.");

  if (state.settings?.notifications?.appointmentConfirmation) rulesScore += 10;
  else recommendations.push("Enable automated appointment confirmation messages.");

  score += rulesScore;

  if (rulesScore < 30) {
    missingRequirements.push("Booking Rules & Policies");
  }

  let status: ReadyStatus;
  if (score >= 80) status = "Ready";
  else if (score >= 50) status = "Partially Ready";
  else status = "Not Ready";

  let reason = "";
  if (score === 100) reason = "All booking systems and rules are fully configured.";
  else if (score >= 80) reason = "Your booking system is operational, but missing some optional policies.";
  else reason = `Your booking system cannot accept appointments effectively. Missing ${missingRequirements.length} critical items.`;

  return {
    score,
    status,
    reason,
    confidence,
    missingRequirements,
    recommendations,
    lastUpdated: new Date().toISOString()
  };
}
