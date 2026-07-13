import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";
import { checkPricing } from "./pricing-engine";
import { checkPayments } from "./payment-engine";
import { checkTaxes } from "./tax-engine";
import { checkDeposits } from "./deposit-engine";
import { checkRefundPolicy } from "./refund-engine";
import { checkMemberships } from "./membership-engine";
import { checkGiftCards } from "./gift-card-engine";

export function generateBillingRecommendations(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];

  // Enforce dependency logic: Pricing -> Payments -> Taxes -> Deposits -> Refund Policy -> Memberships -> Gift Cards
  const pricingRecs = checkPricing(state);
  if (pricingRecs.length > 0) return pricingRecs;

  const paymentRecs = checkPayments(state);
  if (paymentRecs.length > 0) return paymentRecs;

  const taxRecs = checkTaxes(state);
  if (taxRecs.length > 0) return taxRecs;

  const depositRecs = checkDeposits(state);
  if (depositRecs.length > 0) return depositRecs;

  const refundRecs = checkRefundPolicy(state);
  if (refundRecs.length > 0) return refundRecs;

  // Memberships and Gift Cards can be suggested together if no dependencies block them
  recommendations.push(...checkMemberships(state));
  recommendations.push(...checkGiftCards(state));

  return recommendations;
}
