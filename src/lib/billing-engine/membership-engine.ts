import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkMemberships(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const services = state.services || [];

  // Check if they have many low cost services that could be bundled
  const lowCostServices = services.filter(s => s.price && parseFloat(s.price) < 50);

  // Simple heuristic: if they have at least 3 low-cost services, a membership plan could be beneficial
  if (lowCostServices.length >= 3) {
    recommendations.push({
      id: "billing-missing-memberships",
      title: "Configure Membership Plans",
      description: "You have several affordable services. Bundle them into a recurring membership plan to generate predictable monthly revenue.",
      primaryCtaText: "Generate Membership Plan",
      primaryCtaHref: "/billing",
      estimatedTimeMinutes: 20,
      impact: "High",
      impactReason: "Increases recurring revenue predictability.",
      confidence: 70,
      confidenceReason: "3+ low-cost services found."
    });
  }

  return recommendations;
}
