import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkPayments(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const billingAccounts = state.billingAccounts || [];
  const paymentMethods = state.paymentMethods || [];
  const services = state.services || [];

  const hasPricedServices = services.some(s => s.price && parseFloat(s.price) > 0);

  if (!hasPricedServices) return recommendations; // Payments not critical if no prices

  if (billingAccounts.length === 0 || paymentMethods.length === 0) {
    recommendations.push({
      id: "billing-missing-payments",
      title: "Configure Payment Methods",
      description: "You have priced services but no online payment methods configured. Connect Stripe or Razorpay to accept payments.",
      primaryCtaText: "Configure Payments",
      primaryCtaHref: "/billing",
      estimatedTimeMinutes: 10,
      impact: "High",
      impactReason: "Crucial for capturing revenue automatically.",
      confidence: 95,
      confidenceReason: "Pricing exists but no payment gateways found."
    });
  }

  return recommendations;
}
