import { RecommendationAction } from "./types";

export function calculatePriorityScore(action: RecommendationAction): number {
  let score = 0;

  // 1. Base score from impact
  switch (action.impact) {
    case "High":
      score += 500;
      break;
    case "Medium":
      score += 250;
      break;
    case "Low":
      score += 100;
      break;
  }

  // 2. Penalty for estimated time (we prefer quick wins)
  // Deduct 2 points for every minute it takes
  score -= (action.estimatedTimeMinutes * 2);

  // 3. Dependency Boosts
  // Hardcoded dependency logic where foundational items get artificial boosts to guarantee they appear first.
  
  const foundationalIds = [
    "booking_missing_hours",
    "automation_missing_channels",
    "booking_missing_services",
    "knowledge_missing_website"
  ];

  if (foundationalIds.includes(action.id)) {
    score += 1000; 
  }

  const secondaryFoundationalIds = [
    "ai_missing_prompt",
    "knowledge_low_faq"
  ];

  if (secondaryFoundationalIds.includes(action.id)) {
    score += 500;
  }

  // 4. Confidence Penalty
  // If the engine is not confident, we lower the priority to avoid bad recommendations
  if (action.confidence < 80) {
    score -= (100 - action.confidence);
  }

  return score;
}
