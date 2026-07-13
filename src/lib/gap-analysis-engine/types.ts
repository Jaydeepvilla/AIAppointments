import { BusinessState } from "../health-engine/types";
import { RecommendationAction } from "../recommendation-engine/types";

export interface GapAnalysisResult {
  score: number; // 0-100 percentage
  completeness: number; // 0-100 percentage of required fields filled
  missingItems: string[];
  recommendations: RecommendationAction[];
}

export type GapCalculator = (state: BusinessState) => GapAnalysisResult;
