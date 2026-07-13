import { AutomationAction, AutomationEngineState, AutomationPreview } from "./types";

export function detectMissingCategories(state: AutomationEngineState): AutomationAction[] {
  const actions: AutomationAction[] = [];
  
  // We check if there are any documents or if documents lack categories
  const hasCategories = (state.documents || []).some((doc: any) => doc.category);

  if (!hasCategories) {
    actions.push({
      id: `automation-suggest-categories`,
      title: `Suggest Knowledge Categories`,
      description: `Automatically create a standard folder structure for your industry to organize your knowledge base.`,
      primaryCtaText: "Generate Categories",
      primaryCtaHref: "#",
      primaryCtaAction: "suggest_categories",
      impact: "Medium",
      automationType: "suggest_categories",
      targetResourceType: "category",
      targetResourceName: "Industry Categories",
      estimatedTimeMinutes: 1,
      impactReason: "Categorization is standard for knowledge retrieval",
      confidence: 90,
      confidenceReason: "Automatically suggested by industry",
    });
  }

  return actions;
}

export function generateCategoryPreview(state: AutomationEngineState): AutomationPreview {
  const industry = state.organization?.industry || "General";
  
  // Return a JSON representation
  const categories = [
    { name: "General Policies", slug: "general-policies", icon: "file-text" },
    { name: "Services & Pricing", slug: "services-pricing", icon: "tag" },
    { name: "Customer Support", slug: "customer-support", icon: "life-buoy" },
    { name: "Staff Guidelines", slug: "staff-guidelines", icon: "users" }
  ];

  return {
    id: crypto.randomUUID(),
    title: `Suggested Categories for ${industry}`,
    content: JSON.stringify(categories, null, 2),
  };
}
