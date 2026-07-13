import { BusinessState } from "../health-engine/types";

export type ImpactLevel = "High" | "Medium" | "Low";

export interface RecommendationAction {
  id: string; // Unique identifier for the recommendation
  title: string;
  description: string; // "Why it matters"
  primaryCtaText: string;
  primaryCtaHref: string;
  primaryCtaAction?: string; // Optional server action or AI generation trigger
  estimatedTimeMinutes: number;
  impact: ImpactLevel;
  impactReason: string;
  confidence: number;
  confidenceReason: string;
  priorityScore?: number; // Calculated dynamically by the priority engine
}

// Extends the base BusinessState with Recommendation History
export interface RecommendationState extends BusinessState {
  recommendationHistory: {
    dismissed: string[];
    snoozed: Record<string, string>; // Record of recommendationId to ISO Date string of when it should reappear
  };
  qualityScoresHistory?: {
    date: string;
    knowledgeScore: number;
    crmScore: number;
  }[];
  crmSegments?: {
    id: string;
    name: string;
    filters: any;
  }[];
}
