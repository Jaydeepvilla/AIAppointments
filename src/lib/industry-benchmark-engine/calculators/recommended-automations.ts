import { BusinessState } from "../../health-engine/types";
import { IndustryTemplate, IndustryFeature } from "../../industry-template-engine/types";
import { BenchmarkAnalysisResult } from "../types";
import { RecommendationAction } from "../../recommendation-engine/types";

export const compareAutomationsAndIntegrations = (state: BusinessState, template: IndustryTemplate): BenchmarkAnalysisResult => {
  const completedFeatures: IndustryFeature[] = [];
  const missingFeatures: IndustryFeature[] = [];
  const recommendations: RecommendationAction[] = [];
  
  const advanced = [...template.recommendedAutomations, ...template.recommendedIntegrations, ...template.recommendedAiSettings];

  advanced.forEach(feat => {
    const featName = feat.name.toLowerCase();
    let isCompleted = false;

    // Dynamic checks based on keywords in the template feature name
    if (featName.includes("payment") || featName.includes("stripe")) {
      isCompleted = !!(state.billingAccounts && state.billingAccounts.length > 0) || !!state.settings?.stripeAccountId;
    } else if (featName.includes("calendar") || featName.includes("scheduling")) {
      isCompleted = !!(state.calendarConnections && state.calendarConnections.length > 0) || !!state.settings?.googleCalendarId;
    } else if (featName.includes("automation") || featName.includes("workflow")) {
      isCompleted = !!(state.rules && state.rules.length > 0);
    } else if (featName.includes("ai") || featName.includes("prompt")) {
      isCompleted = !!(state.settings?.aiSystemPrompt && state.settings.aiSystemPrompt.length > 50);
    } else {
      // For general features, check if we have any advanced settings or just assume missing if no rules exist
      isCompleted = !!(state.rules && state.rules.length > 3); 
    }

    if (isCompleted) {
      completedFeatures.push(feat);
    } else {
      missingFeatures.push(feat);
      
      recommendations.push({
        id: `bench-adv-${feat.name.replace(/\s+/g, '-').toLowerCase()}`,
        title: `Setup ${feat.name}`,
        description: feat.description,
        impactReason: feat.reason,
        impact: feat.impact,
        estimatedTimeMinutes: feat.estimatedTimeMinutes,
        confidence: 80,
        confidenceReason: "Data check against industry standard",
        primaryCtaText: "Setup Now",
        primaryCtaHref: "/settings"
      });
    }
  });

  return {
    industry: template.name,
    readinessScore: 0,
    completedFeatures,
    missingFeatures,
    recommendations
  };
};
