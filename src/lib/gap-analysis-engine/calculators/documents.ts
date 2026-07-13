import { BusinessState } from "../../health-engine/types";
import { GapCalculator, GapAnalysisResult } from "../types";
import { RecommendationAction } from "../../recommendation-engine/types";

export const calculateDocumentGaps: GapCalculator = (state: BusinessState) => {
  const missingItems: string[] = [];
  const recommendations: RecommendationAction[] = [];
  let score = 100;
  
  const faqs = state.faqs || [];
  
  // Baseline checks
  const faqText = faqs.map(f => `${f.question} ${f.answer}`).join(" ").toLowerCase();
  
  const hasCancellationPolicy = faqText.includes("cancel") || faqText.includes("reschedule") || faqText.includes("no show");
  const hasRefundPolicy = faqText.includes("refund") || faqText.includes("money back");
  
  if (!hasCancellationPolicy) {
    missingItems.push("Cancellation Policy");
    score -= 15;
    recommendations.push({
      id: "missing-docs-cancellation",
      title: "Add Cancellation Policy",
      description: "You have not defined a cancellation or no-show policy in your knowledge base.",
      impactReason: "The AI cannot inform customers about late fees or cancellation windows.",
      impact: "High",
      estimatedTimeMinutes: 10,
      confidence: 90,
      confidenceReason: "Data check",
      primaryCtaText: "Configure Policy",
      primaryCtaHref: "/settings/booking"
    });
  }

  if (!hasRefundPolicy) {
    missingItems.push("Refund Policy");
    score -= 10;
    recommendations.push({
      id: "missing-docs-refund",
      title: "Add Refund Policy",
      description: "There is no information on refunds in your knowledge base.",
      impactReason: "The AI will have to transfer the chat to a human if asked about refunds.",
      impact: "Medium",
      estimatedTimeMinutes: 10,
      confidence: 85,
      confidenceReason: "Data check",
      primaryCtaText: "Configure Policy",
      primaryCtaHref: "/settings/booking"
    });
  }

  return {
    score: Math.max(0, score),
    completeness: Math.max(0, score),
    missingItems,
    recommendations
  };
};
