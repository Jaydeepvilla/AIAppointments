import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkDeposits(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const settings = state.settings || {};
  const preferences = settings.bookingPreferences || {};
  const services = state.services || [];

  const highValueServices = services.filter(s => s.price && parseFloat(s.price) >= 100);

  if (highValueServices.length > 0 && !preferences.depositEnabled) {
    recommendations.push({
      id: "billing-missing-deposits",
      title: "Configure Deposits for High-Value Services",
      description: "You have services priced over $100. Enabling deposits protects your time from no-shows and late cancellations.",
      primaryCtaText: "Configure Deposits",
      primaryCtaHref: "/settings/booking",
      estimatedTimeMinutes: 5,
      impact: "High",
      impactReason: "Reduces no-shows and secures revenue.",
      confidence: 90,
      confidenceReason: "High value services detected without deposit rules."
    });
  }

  return recommendations;
}
