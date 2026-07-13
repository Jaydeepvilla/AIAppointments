import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";
import { getImportDetection } from "./import-detection";
import { getMissingDataRecommendations } from "./missing-data";
import { getVipRecommendations } from "./vip-identification";
import { getDuplicateCustomers } from "./duplicate-customers";
import { getSegmentationRecommendations } from "./segmentation";

export function getCrmEngineRecommendations(state: RecommendationState): RecommendationAction[] {
  return [
    ...getImportDetection(state),
    ...getMissingDataRecommendations(state),
    ...getVipRecommendations(state),
    ...getDuplicateCustomers(state),
    ...getSegmentationRecommendations(state)
  ];
}
