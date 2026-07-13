import { ConfidenceLevel, ConfidenceScore } from "../ai-readiness-engine/types";

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 30) return "Low";
  return "Critical";
}

export function buildConfidenceScore(baseScore: number, reasons: string[]): ConfidenceScore {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, baseScore));
  return {
    score: clampedScore,
    level: getConfidenceLevel(clampedScore),
    reasons,
  };
}
