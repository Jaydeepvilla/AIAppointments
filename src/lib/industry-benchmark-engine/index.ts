import { BusinessState } from "../health-engine/types";
import { getIndustryTemplate } from "../industry-template-engine";
import { BenchmarkAnalysisResult } from "./types";
import { compareServicesFeatures } from "./calculators/compare-features";
import { compareDocumentsAndPolicies } from "./calculators/recommended-documents";
import { compareAutomationsAndIntegrations } from "./calculators/recommended-automations";
import { RecommendationAction } from "../recommendation-engine/types";
import { IndustryFeature } from "../industry-template-engine/types";

export interface GlobalBenchmarkAnalysis {
  isApplicable: boolean;
  industryName: string;
  overallReadiness: number; // 0-100
  completedFeatures: IndustryFeature[];
  missingFeatures: IndustryFeature[];
  recommendations: RecommendationAction[];
}

export function runIndustryBenchmark(state: BusinessState): GlobalBenchmarkAnalysis {
  const industryStr = state.organization?.industry;
  const template = getIndustryTemplate(industryStr);

  if (!template) {
    return {
      isApplicable: false,
      industryName: "Unknown",
      overallReadiness: 0,
      completedFeatures: [],
      missingFeatures: [],
      recommendations: []
    };
  }

  const services = compareServicesFeatures(state, template);
  const docs = compareDocumentsAndPolicies(state, template);
  const automations = compareAutomationsAndIntegrations(state, template);

  const totalScore = (services.readinessScore + docs.readinessScore) / 2; // Automations excluded from base score

  const allRecommendations = [
    ...services.recommendations,
    ...docs.recommendations,
    ...automations.recommendations
  ].sort((a, b) => {
    const pA = a.impact === "High" ? 3 : a.impact === "Medium" ? 2 : 1;
    const pB = b.impact === "High" ? 3 : b.impact === "Medium" ? 2 : 1;
    return pB - pA;
  });

  return {
    isApplicable: true,
    industryName: template.name,
    overallReadiness: Math.round(totalScore),
    completedFeatures: [
      ...services.completedFeatures,
      ...docs.completedFeatures,
      ...automations.completedFeatures
    ],
    missingFeatures: [
      ...services.missingFeatures,
      ...docs.missingFeatures,
      ...automations.missingFeatures
    ],
    recommendations: allRecommendations
  };
}

export * from "./types";
