import { RecommendationAction } from "../recommendation-engine/types";
import { AIReadinessResult } from "../ai-readiness-engine/types";
import crypto from "crypto";

export function generateImprovementsFromReadiness(
  readiness: AIReadinessResult
): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];

  // Generate improvements based on missing information
  for (const missing of readiness.coverage.missingInformation) {
    recommendations.push({
      id: crypto.randomUUID(),
      title: `Add missing ${missing}`,
      description: `AI cannot answer questions about ${missing.toLowerCase()}. Adding this will improve ${readiness.domain} coverage.`,
      primaryCtaText: "Fix Now",
      primaryCtaHref: "/settings", // Default, should be overridden by domain logic
      estimatedTimeMinutes: 5,
      impact: "High",
      impactReason: `Increases AI ability to answer ${readiness.domain} questions.`,
      confidence: 100,
      confidenceReason: "Data is explicitly missing from configuration.",
    });
  }

  return recommendations;
}
