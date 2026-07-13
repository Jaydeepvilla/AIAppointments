import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";
import { checkCoverage } from "./coverage";
import { checkWorkingHours } from "./working-hours";
import { checkProfileCompletion } from "./profile-completion";

export function generateStaffRecommendations(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];

  // Execute all calculators
  recommendations.push(...checkCoverage(state));
  recommendations.push(...checkWorkingHours(state));
  recommendations.push(...checkProfileCompletion(state));

  return recommendations;
}
