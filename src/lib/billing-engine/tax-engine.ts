import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkTaxes(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const taxProfiles = state.taxProfiles || [];
  const taxRates = state.taxRates || [];
  const services = state.services || [];

  const hasPricedServices = services.some(s => s.price && parseFloat(s.price) > 0);
  
  if (!hasPricedServices) return recommendations;

  // If we have payment methods but no tax configured
  if (taxProfiles.length === 0 && taxRates.length === 0) {
    recommendations.push({
      id: "billing-missing-tax",
      title: "Configure Taxes",
      description: "Ensure your compliance by setting up regional tax rates (GST/VAT) for your services.",
      primaryCtaText: "Configure Taxes",
      primaryCtaHref: "/billing",
      estimatedTimeMinutes: 10,
      impact: "Medium",
      impactReason: "Required for legal and accounting compliance.",
      confidence: 85,
      confidenceReason: "No tax profiles detected for priced services."
    });
  }

  return recommendations;
}
