import { useMemo } from "react";
import { SetupState } from "@/lib/setup-engine/types";
import {
  getRecommendation,
  getReadinessScore,
  getAiConfidence,
  getDailyGoals,
  getTimeline,
} from "@/lib/setup-engine";

export function useSetupEngine(state: SetupState) {
  return useMemo(() => {
    return {
      recommendation: getRecommendation(state),
      readiness: getReadinessScore(state),
      confidence: getAiConfidence(state),
      dailyGoals: getDailyGoals(state),
      timeline: getTimeline(state),
    };
  }, [state]);
}
