import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";
import { checkCancellationPolicy } from "./cancellation-policy";
import { checkBookingRules } from "./booking-rules";
import { checkBuffers } from "./buffers";
import { checkReminders } from "./reminders";

export function generateAppointmentRecommendations(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];

  // Execute all calculators
  recommendations.push(...checkCancellationPolicy(state));
  recommendations.push(...checkBookingRules(state));
  recommendations.push(...checkBuffers(state));
  recommendations.push(...checkReminders(state));

  // The priority engine will sort and score these
  return recommendations;
}
