import { BusinessState } from "../health-engine/types";
import { RecommendationAction } from "../recommendation-engine/types";
import { IndustryTemplate, IndustryFeature } from "../industry-template-engine/types";

export interface BenchmarkAnalysisResult {
  industry: string;
  readinessScore: number; // 0-100
  completedFeatures: IndustryFeature[];
  missingFeatures: IndustryFeature[];
  recommendations: RecommendationAction[];
}

export type BenchmarkCalculator = (state: BusinessState, template: IndustryTemplate) => BenchmarkAnalysisResult;
