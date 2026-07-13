import { BusinessState } from "../health-engine/types";
import { GapAnalysisResult } from "./types";
import { calculateBusinessInfoGaps } from "./calculators/business-info";
import { calculateServiceGaps } from "./calculators/services";
import { calculateStaffGaps } from "./calculators/staff";
import { calculateDocumentGaps } from "./calculators/documents";
import { calculateIntegrationGaps } from "./calculators/integrations";
import { RecommendationAction } from "../recommendation-engine/types";

export interface GlobalGapAnalysis {
  overallCompleteness: number; // 0-100
  totalMissingItems: number;
  breakdown: {
    businessInfo: GapAnalysisResult;
    services: GapAnalysisResult;
    staff: GapAnalysisResult;
    documents: GapAnalysisResult;
    integrations: GapAnalysisResult;
  };
  recommendations: RecommendationAction[];
}

export function runGapAnalysis(state: BusinessState): GlobalGapAnalysis {
  const businessInfo = calculateBusinessInfoGaps(state);
  const services = calculateServiceGaps(state);
  const staff = calculateStaffGaps(state);
  const documents = calculateDocumentGaps(state);
  const integrations = calculateIntegrationGaps(state);

  const totalScore = (
    businessInfo.score +
    services.score +
    staff.score +
    documents.score +
    integrations.score
  ) / 5;

  const totalMissingItems = 
    businessInfo.missingItems.length +
    services.missingItems.length +
    staff.missingItems.length +
    documents.missingItems.length +
    integrations.missingItems.length;

  const allRecommendations = [
    ...businessInfo.recommendations,
    ...services.recommendations,
    ...staff.recommendations,
    ...documents.recommendations,
    ...integrations.recommendations
  ].sort((a, b) => {
    // Sort critical first
    const pA = a.impact === "High" ? 3 : a.impact === "Medium" ? 2 : 1;
    const pB = b.impact === "High" ? 3 : b.impact === "Medium" ? 2 : 1;
    return pB - pA;
  });

  return {
    overallCompleteness: Math.round(totalScore),
    totalMissingItems,
    breakdown: {
      businessInfo,
      services,
      staff,
      documents,
      integrations
    },
    recommendations: allRecommendations
  };
}

export * from "./types";
