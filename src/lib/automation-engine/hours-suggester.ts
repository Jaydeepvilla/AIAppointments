import { AutomationAction, AutomationEngineState, AutomationPreview } from "./types";

export function detectMissingBusinessHours(state: AutomationEngineState): AutomationAction[] {
  const actions: AutomationAction[] = [];
  
  // Checking if business hours are empty
  const hasHours = state.settings?.businessHours && Object.keys(state.settings.businessHours).length > 0;

  if (!hasHours) {
    actions.push({
      id: `automation-suggest-hours`,
      title: `Suggest Business Hours`,
      description: `Automatically generate standard business hours for your AI to use when booking appointments.`,
      primaryCtaText: "Generate Hours",
      primaryCtaHref: "#",
      primaryCtaAction: "suggest_hours",
      impact: "High",
      automationType: "suggest_hours",
      targetResourceType: "settings",
      targetResourceName: "Business Hours",
      estimatedTimeMinutes: 1,
      impactReason: "Required for the AI to schedule correctly",
      confidence: 95,
      confidenceReason: "Business currently lacks schedule configuration",
    });
  }

  return actions;
}

export function generateHoursPreview(state: AutomationEngineState): AutomationPreview {
  const industry = state.organization?.industry || "General";
  
  const hours = {
    monday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
    tuesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
    wednesday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
    thursday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
    friday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
    saturday: { isOpen: false, openTime: "00:00", closeTime: "00:00" },
    sunday: { isOpen: false, openTime: "00:00", closeTime: "00:00" },
  };

  return {
    id: crypto.randomUUID(),
    title: `Suggested Hours for ${industry}`,
    content: JSON.stringify(hours, null, 2),
  };
}
