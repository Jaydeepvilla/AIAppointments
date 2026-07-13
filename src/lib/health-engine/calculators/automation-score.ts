import { BusinessState, HealthScoreResult, HealthStatus } from "../types";

export function calculateAutomationReadiness(state: BusinessState): HealthScoreResult {
  let score = 0;
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;

  const channels = state.channels || [];
  const flows = state.flows || [];

  // 1. Omnichannel Connections (50%)
  const connectedChannels = channels.filter((c: any) => c.status === "active" || c.isActive);
  
  if (connectedChannels.length >= 2) {
    score += 50;
  } else if (connectedChannels.length === 1) {
    score += 25;
    recommendations.push("Connect more channels (e.g., SMS, WhatsApp) to reach customers where they are.");
  } else {
    missingRequirements.push("Communication Channels");
    recommendations.push("Connect at least one communication channel (Email, SMS, Web) for the AI to handle.");
    confidence -= 20;
  }

  // 2. Automated Workflows & Notifications (50%)
  // Check if they have active flows or notification settings
  let workflowScore = 0;
  
  const activeFlows = flows.filter((f: any) => f.isActive);
  if (activeFlows.length > 0) {
    workflowScore += 30;
  } else {
    recommendations.push("Create AI Workflows (e.g., lead qualification, follow-ups) to automate processes.");
  }

  if (state.settings?.notifications?.email || state.settings?.notifications?.sms) {
    workflowScore += 20;
  } else {
    missingRequirements.push("Notification Settings");
    recommendations.push("Enable internal notifications so your team is alerted when the AI escalates a chat.");
  }

  score += workflowScore;

  // Bound score
  score = Math.max(0, Math.min(100, score));

  let status: HealthStatus;
  if (score >= 90) status = "Excellent";
  else if (score >= 70) status = "Good";
  else if (score >= 50) status = "Needs Attention";
  else status = "Critical";

  let reason = "";
  if (score >= 90) reason = "Strong automation pipelines and multiple active channels.";
  else if (score >= 70) reason = "Basic automations are running, but workflows could be expanded.";
  else if (score >= 50) reason = "Missing key automated workflows or communication channels.";
  else reason = `Critical lack of automation. AI has no channels to operate on.`;

  return {
    score,
    status,
    reason,
    confidence,
    missingRequirements,
    recommendations,
    lastUpdated: new Date().toISOString()
  };
}
