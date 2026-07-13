import { RecommendationAction, RecommendationState } from "../types";
import { calculateGlobalAIReadiness } from "../../ai-readiness-engine";

export function getAiReadinessRecommendations(state: RecommendationState): RecommendationAction[] {
  const globalReadiness = calculateGlobalAIReadiness(state);
  
  // Extract improvements from all domains
  const improvements: RecommendationAction[] = [];
  
  for (const domain of Object.values(globalReadiness.domains)) {
    improvements.push(...domain.improvements);
  }
  
  return improvements;
}
