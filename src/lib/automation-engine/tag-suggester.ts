import { AutomationAction, AutomationEngineState, AutomationPreview } from "./types";

export function detectMissingTags(state: AutomationEngineState): AutomationAction[] {
  const actions: AutomationAction[] = [];
  
  // Check if any documents have tags
  const hasTags = (state.documents || []).some((doc: any) => doc.tags && doc.tags.length > 0);

  if (!hasTags) {
    actions.push({
      id: `automation-suggest-tags`,
      title: `Suggest Knowledge Tags`,
      description: `Automatically generate standard tags to make your knowledge base easily searchable by the AI.`,
      primaryCtaText: "Generate Tags",
      primaryCtaHref: "#",
      primaryCtaAction: "suggest_tags",
      impact: "Low",
      automationType: "suggest_tags",
      targetResourceType: "tag",
      targetResourceName: "Industry Tags",
      estimatedTimeMinutes: 1,
      impactReason: "Tags assist the AI in grouping answers together",
      confidence: 90,
      confidenceReason: "Automatically suggested by industry",
    });
  }

  return actions;
}

export function generateTagPreview(state: AutomationEngineState): AutomationPreview {
  const industry = state.organization?.industry || "General";
  
  const tags = [
    { name: "Pricing", slug: "pricing" },
    { name: "Emergency", slug: "emergency" },
    { name: "Booking", slug: "booking" },
    { name: "Policy", slug: "policy" }
  ];

  return {
    id: crypto.randomUUID(),
    title: `Suggested Tags for ${industry}`,
    content: JSON.stringify(tags, null, 2),
  };
}
