import { HealthScoreResult, BusinessState } from "../health-engine/types";
import { checkPricing } from "../billing-engine/pricing-engine";
import { checkPayments } from "../billing-engine/payment-engine";
import { checkTaxes } from "../billing-engine/tax-engine";
import { checkDeposits } from "../billing-engine/deposit-engine";
import { checkRefundPolicy } from "../billing-engine/refund-engine";
import { checkMemberships } from "../billing-engine/membership-engine";
import { checkGiftCards } from "../billing-engine/gift-card-engine";

export function calculateBillingQualityScore(state: BusinessState): HealthScoreResult {
  let score = 100;
  const missingRequirements: string[] = [];
  const exactActions: string[] = [];
  const recommendations: string[] = [];

  const billingAccounts = state.billingAccounts || [];
  const paymentMethods = state.paymentMethods || [];
  const taxRates = state.taxRates || [];

  // 1. Check payment processor configuration
  const hasStripe = billingAccounts.length > 0;
  if (!hasStripe) {
    score -= 30;
    missingRequirements.push("Payment Integration");
    exactActions.push("Connect your Stripe processor under Billing settings");
  } else {
    recommendations.push("Stripe payment integration configured");
  }

  // 2. Check active payment method linked
  const hasCard = paymentMethods.length > 0;
  if (hasStripe && !hasCard) {
    score -= 30;
    missingRequirements.push("Payment Methods");
    exactActions.push("Link a credit card or debit card to capture client payments");
  } else if (hasCard) {
    recommendations.push("Valid billing payment method configured");
  }

  // 3. Tax Rates configuration check
  if (taxRates.length === 0) {
    score -= 15;
    missingRequirements.push("Tax Rates Configuration");
    exactActions.push("Set up sales tax rates under tax settings to calculate correct booking charges");
  } else {
    recommendations.push(`${taxRates.length} standard tax rates configured`);
  }

  // 4. Cancellation/Refund Policy text
  const cancellationPolicyText = state.settings?.bookingPreferences?.cancellationPolicyText;
  if (!cancellationPolicyText) {
    score -= 25;
    missingRequirements.push("Refund & Cancellation Text");
    exactActions.push("Provide explicit cancellation or refund policy text in booking settings");
  } else {
    recommendations.push("Cancellation & refund policy rules established");
  }

  score = Math.max(0, score);

  let status: HealthScoreResult["status"] = "Excellent";
  if (score < 50) status = "Critical";
  else if (score < 80) status = "Needs Attention";
  else if (score < 100) status = "Good";

  const formula = "Score = 100% - 30% (No Payment Gateway) - 30% (No Payment Methods) - 15% (No Tax Rates) - 25% (No Refund/Cancellation Text)";
  let whyLow = "Your billing setup is missing payment methods or tax guidelines, preventing you from capture and payouts.";
  if (score === 100) {
    whyLow = "Excellent! Billing portals, payment cards, tax rules, and cancellation text are fully active.";
  } else if (score >= 70) {
    whyLow = "Payment connections are configured, but some tax profiles or cancellation policy disclosures are missing.";
  }

  return {
    score,
    status,
    reason: score === 100 ? "Your billing system is fully configured." : "Your billing configuration needs attention to securely accept payments.",
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
