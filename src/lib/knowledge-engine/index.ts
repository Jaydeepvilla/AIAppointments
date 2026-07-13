import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";
import { getMissingPolicies } from "./missing-policies";
import { getMissingFaqs } from "./missing-faqs";
import { getMissingGuides } from "./missing-guides";
import { getDuplicateRecommendations } from "./duplicate-detection";
import { getWeakContentRecommendations } from "./weak-content";
import { getWebsiteImportSuggestions } from "./website-imports";

export function getKnowledgeEngineRecommendations(state: RecommendationState): RecommendationAction[] {
  return [
    ...getMissingPolicies(state),
    ...getMissingFaqs(state),
    ...getMissingGuides(state),
    ...getDuplicateRecommendations(state),
    ...getWeakContentRecommendations(state),
    ...getWebsiteImportSuggestions(state)
  ];
}
