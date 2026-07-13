import { RecommendationAction } from "../recommendation-engine/types";
import { BusinessState } from "../health-engine/types";

export type ConfidenceLevel = "Excellent" | "Good" | "Fair" | "Low" | "Critical";

export interface ConfidenceScore {
  score: number; // 0 to 100
  level: ConfidenceLevel;
  reasons: string[];
}

export interface QuestionCoverage {
  question: string;
  canAnswer: boolean;
  confidence: number;
  missingData: string[];
}

export interface DomainCoverageReport {
  domain: string;
  coveragePercentage: number;
  coveredQuestions: number;
  totalQuestions: number;
  questions: QuestionCoverage[];
  missingInformation: string[];
}

export interface AIReadinessResult {
  domain: string;
  readinessScore: number;
  confidence: ConfidenceScore;
  coverage: DomainCoverageReport;
  improvements: RecommendationAction[];
  lastUpdated: string;
}
