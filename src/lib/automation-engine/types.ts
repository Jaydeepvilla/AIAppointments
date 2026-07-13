import { RecommendationAction } from "../recommendation-engine/types";
import { BusinessState } from "../health-engine/types";

export type AutomationStatus = "idle" | "generating" | "preview" | "published" | "error";

export interface AutomationAction extends RecommendationAction {
  automationType: "generate_document" | "generate_faq" | "generate_policy" | "import_website" | "suggest_categories" | "suggest_tags" | "suggest_hours";
  targetResourceType: string;
  targetResourceName: string;
}

export interface AutomationPreview {
  id: string;
  title: string;
  content: string;
  metadata?: any;
}

export interface AutomationEngineState extends BusinessState {
  // Add any automation-specific state here if needed
}
