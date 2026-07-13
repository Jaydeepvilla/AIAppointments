import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkBookingRules(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const rules = state.rules?.[0]; 

  if (!rules) return []; // Handled by cancellation-policy

  if (rules.minLeadTime === 0) {
    recommendations.push({
      id: "appointment-min-lead-time-zero",
      title: "Same-Day Bookings Enabled with No Lead Time",
      description: "Customers can book an appointment for the current minute. This might result in unexpected arrivals without preparation.",
      primaryCtaText: "Set Lead Time",
      primaryCtaHref: "/settings/appointments",
      estimatedTimeMinutes: 2,
      impact: "High",
      impactReason: "Zero lead time causes operational chaos and staff stress.",
      confidence: 95,
      confidenceReason: "Almost all businesses require at least some minimum notice.",
    });
  }

  if (rules.maxLookahead > 90) {
    recommendations.push({
      id: "appointment-max-lookahead-high",
      title: "Booking Allowed Too Far in Advance",
      description: `Customers can book up to ${rules.maxLookahead} days in advance. This often leads to high cancellation rates.`,
      primaryCtaText: "Reduce Booking Window",
      primaryCtaHref: "/settings/appointments",
      estimatedTimeMinutes: 2,
      impact: "Medium",
      impactReason: "Long booking windows increase no-shows as people forget their appointments.",
      confidence: 80,
      confidenceReason: "Most service businesses restrict bookings to 30-60 days.",
    });
  }

  // Check if business hours are completely missing in settings
  const hasBusinessHours = state.settings?.businessHours && Object.keys(state.settings.businessHours).length > 0;
  if (!hasBusinessHours) {
    recommendations.push({
      id: "appointment-missing-business-hours",
      title: "Missing Business Hours",
      description: "You haven't defined your regular business hours. The AI won't know when to generally schedule customers.",
      primaryCtaText: "Set Hours",
      primaryCtaHref: "/settings/appointments",
      estimatedTimeMinutes: 5,
      impact: "High",
      impactReason: "Business hours are the foundation of any scheduling system.",
      confidence: 100,
      confidenceReason: "Hours are completely missing.",
    });
  }

  return recommendations;
}
