import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkGiftCards(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const services = state.services || [];

  // Check if they have high value services (spa/salon often use gift cards)
  const hasPremiumServices = services.some(s => s.price && parseFloat(s.price) >= 80);

  if (hasPremiumServices) {
    recommendations.push({
      id: "billing-missing-gift-cards",
      title: "Set Up Digital Gift Cards",
      description: "Offering gift cards is a highly effective way to increase revenue and acquire new customers for premium services.",
      primaryCtaText: "Configure Gift Cards",
      primaryCtaHref: "/billing",
      estimatedTimeMinutes: 15,
      impact: "Medium",
      impactReason: "Boosts customer acquisition for premium offerings.",
      confidence: 75,
      confidenceReason: "High-value services detected."
    });
  }

  return recommendations;
}
