import { AutomationAction, AutomationEngineState } from "./types";
import { detectMissingDocuments } from "./document-generator";
import { detectMissingFaqs } from "./faq-generator";
import { detectWebsiteImport } from "./website-importer";
import { detectMissingCategories } from "./category-suggester";
import { detectMissingTags } from "./tag-suggester";
import { detectMissingBusinessHours } from "./hours-suggester";

export * from "./types";
export * from "./document-generator";
export * from "./faq-generator";
export * from "./website-importer";
export * from "./category-suggester";
export * from "./tag-suggester";
export * from "./hours-suggester";

export function getAutomationOpportunities(state: AutomationEngineState): AutomationAction[] {
  const opportunities: AutomationAction[] = [
    ...detectMissingDocuments(state),
    ...detectMissingFaqs(state),
    ...detectWebsiteImport(state),
    ...detectMissingCategories(state),
    ...detectMissingTags(state),
    ...detectMissingBusinessHours(state),
  ];

  return opportunities;
}
