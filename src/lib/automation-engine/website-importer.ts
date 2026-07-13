import { AutomationAction, AutomationEngineState, AutomationPreview } from "./types";

export function detectWebsiteImport(state: AutomationEngineState): AutomationAction[] {
  const actions: AutomationAction[] = [];
  
  const hasWebsiteUrl = !!state.organization?.website;
  const isImported = state.settings?.websiteImportStatus === "completed";
  const isPending = state.settings?.websiteImportStatus === "pending" || state.settings?.websiteImportStatus === "scraping";

  // If they have a website but haven't imported it yet, suggest it
  if (hasWebsiteUrl && !isImported && !isPending) {
    actions.push({
      id: `automation-import-website`,
      title: `Import Website Data`,
      description: `Automatically crawl and import FAQs, services, and knowledge from ${state.organization?.website}.`,
      primaryCtaText: "Start Import",
      primaryCtaHref: "#",
      primaryCtaAction: "import_website",
      impact: "High",
      automationType: "import_website",
      targetResourceType: "website",
      targetResourceName: state.organization?.website || "website",
      estimatedTimeMinutes: 2,
      impactReason: "Imports a vast amount of structured data from your website",
      confidence: 100,
      confidenceReason: "Standard onboarding automation",
    });
  } else if (!hasWebsiteUrl) {
    // We could suggest adding a website URL first, but that's a gap analysis issue, not automation.
  }

  return actions;
}

export function generateWebsitePreview(state: AutomationEngineState): AutomationPreview {
  const website = state.organization?.website || "your website";
  return {
    id: crypto.randomUUID(),
    title: `Importing ${website}`,
    content: `Our AI will crawl ${website} to automatically extract:\n\n- Business Information\n- Service Descriptions\n- FAQs\n- Policies\n\nThis process may take a few minutes. You can close this dialog and check back later.`,
  };
}
