import { RecommendationAction, RecommendationState } from "../types";

export function getAiRecommendations(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];

  // Rule 1: Missing System Prompt
  if (!state.settings?.aiSystemPrompt) {
    recommendations.push({
      id: "ai_missing_prompt",
      title: "Configure AI Prompt",
      description: "The AI has no instructions on how to behave. Without a prompt, it will use a generic persona.",
      primaryCtaText: "Generate Prompt",
      primaryCtaHref: "/settings/ai",
      primaryCtaAction: "generate_ai_prompt",
      estimatedTimeMinutes: 2,
      impact: "High",
      impactReason: "The prompt controls the entire behavior and tone of the AI.",
      confidence: 100,
      confidenceReason: "System prompt is empty.",
    });
  }

  // Rule 2: Missing Greeting
  if (!state.settings?.greetingMessage) {
    recommendations.push({
      id: "ai_missing_greeting",
      title: "Set AI Greeting",
      description: "Create a custom welcome message for when customers first interact with your AI.",
      primaryCtaText: "Generate Greeting",
      primaryCtaHref: "/settings/ai",
      primaryCtaAction: "generate_greeting",
      estimatedTimeMinutes: 1,
      impact: "Medium",
      impactReason: "Improves first impressions and customer experience.",
      confidence: 100,
      confidenceReason: "Greeting message is empty.",
    });
  }

  // Rule 3: Missing Escalation Rules
  if (!state.rules || state.rules.length === 0) {
    recommendations.push({
      id: "ai_missing_escalation",
      title: "Set Escalation Rules",
      description: "Define when the AI should stop talking and hand the conversation over to a human staff member.",
      primaryCtaText: "Add Rules",
      primaryCtaHref: "/settings/rules",
      estimatedTimeMinutes: 3,
      impact: "High",
      impactReason: "Prevents the AI from frustrating customers when it cannot answer.",
      confidence: 90,
      confidenceReason: "No rules found.",
    });
  }

  return recommendations;
}
