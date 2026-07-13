import { RecommendationAction, RecommendationState } from "./types";
import { getBookingRecommendations } from "./calculators/booking-rules";
import { getKnowledgeRecommendations } from "./calculators/knowledge-rules";
import { getAiRecommendations } from "./calculators/ai-rules";
import { getAutomationRecommendations } from "./calculators/automation-rules";
import { getKnowledgeEngineRecommendations } from "../knowledge-engine";
import { getCrmEngineRecommendations } from "../crm-engine";
import { generateAppointmentRecommendations } from "../appointment-engine";
import { generateStaffRecommendations } from "../staff-engine";
import { generateBillingRecommendations } from "../billing-engine";
import { getAiReadinessRecommendations } from "./calculators/ai-readiness-rules";
import { runGapAnalysis } from "../gap-analysis-engine";
import { runIndustryBenchmark } from "../industry-benchmark-engine";
import { getAutomationOpportunities } from "../automation-engine";
import { calculatePriorityScore } from "./priority-engine";

export function getNextBestAction(state: RecommendationState): RecommendationAction | null {
  // 1. Gather all potential recommendations from the rule engines
  let candidates: RecommendationAction[] = [
    ...getBookingRecommendations(state),
    ...getKnowledgeRecommendations(state),
    ...getAiRecommendations(state),
    ...getAutomationRecommendations(state),
    ...getKnowledgeEngineRecommendations(state),
    ...getCrmEngineRecommendations(state),
    ...generateAppointmentRecommendations(state),
    ...generateStaffRecommendations(state),
    ...generateBillingRecommendations(state),
    ...getAiReadinessRecommendations(state),
    ...(runGapAnalysis(state).recommendations || []),
    ...(runIndustryBenchmark(state).recommendations || []),
    ...getAutomationOpportunities(state as any),
  ];

  if (candidates.length === 0) return null;

  // 2. Filter out dismissed and snoozed recommendations
  const { dismissed, snoozed } = state.recommendationHistory || { dismissed: [], snoozed: {} };
  
  candidates = candidates.filter((action) => {
    // Check if permanently dismissed
    if (dismissed.includes(action.id)) {
      return false;
    }

    // Check if snoozed and the snooze date is still in the future
    if (snoozed[action.id]) {
      const snoozeDate = new Date(snoozed[action.id]);
      if (new Date() < snoozeDate) {
        return false;
      }
    }

    return true;
  });

  if (candidates.length === 0) return null;

  // 3. Score all remaining candidates
  const scoredCandidates = candidates.map(action => ({
    ...action,
    priorityScore: calculatePriorityScore(action)
  }));

  // 4. Sort by priority score (descending)
  scoredCandidates.sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));

  // 5. Return the highest priority action
  return scoredCandidates[0];
}
