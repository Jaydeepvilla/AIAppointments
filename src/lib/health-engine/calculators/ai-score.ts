import { BusinessState, HealthScoreResult, HealthStatus } from "../types";

export function calculateAiReadiness(state: BusinessState): HealthScoreResult {
  let score = 0;
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;

  // 1. Core Config (40%)
  if (state.settings?.aiSystemPrompt) {
    score += 20;
    if (state.settings.aiSystemPrompt.length < 100) {
      recommendations.push("Your AI system prompt is very short. Add more context about tone and rules.");
      confidence -= 10;
    }
  } else {
    missingRequirements.push("AI System Prompt");
    recommendations.push("Provide a base system prompt to define the AI's persona and rules.");
    confidence -= 20;
  }

  if (state.settings?.greetingMessage) {
    score += 20;
  } else {
    missingRequirements.push("AI Greeting Message");
    recommendations.push("Set a standard greeting message for the AI to start conversations with.");
    confidence -= 10;
  }

  // 2. Knowledge Volume (40%)
  // Depends on documents and FAQs
  const faqs = state.faqs || [];
  const documents = state.documents || [];
  const activeDocs = documents.filter((d: any) => !d.isArchived);

  let knowledgeScore = 0;
  if (faqs.length >= 5) knowledgeScore += 20;
  else if (faqs.length > 0) knowledgeScore += 10;

  if (activeDocs.length >= 2) knowledgeScore += 20;
  else if (activeDocs.length > 0) knowledgeScore += 10;

  score += knowledgeScore;
  
  if (knowledgeScore < 20) {
    recommendations.push("Low knowledge volume. The AI is at a high risk of hallucination.");
    confidence -= 20;
  }

  // 3. Escalation Rules (20%)
  if (state.rules && state.rules.length > 0) {
    score += 20;
  } else {
    missingRequirements.push("Escalation Rules");
    recommendations.push("Define rules for when the AI should hand off a conversation to a human.");
  }

  // Bound score
  score = Math.max(0, Math.min(100, score));

  let status: HealthStatus;
  if (score >= 90) status = "Excellent";
  else if (score >= 70) status = "Good";
  else if (score >= 50) status = "Needs Attention";
  else status = "Critical";

  let reason = "";
  if (score >= 90) reason = "AI is fully configured with strong guardrails and knowledge.";
  else if (score >= 70) reason = "AI is functional but lacks some context or escalation safety nets.";
  else if (score >= 50) reason = "AI configuration is weak. Responses may be generic.";
  else reason = `Critical AI misconfiguration. Missing ${missingRequirements.length} vital setup steps.`;

  return {
    score,
    status,
    reason,
    confidence: Math.max(0, confidence),
    missingRequirements,
    recommendations,
    lastUpdated: new Date().toISOString()
  };
}
