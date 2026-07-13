import { BusinessState, HealthScoreResult, HealthStatus } from "../types";

export function calculateWebsiteReadiness(state: BusinessState): HealthScoreResult {
  let score = 0;
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;

  const imports = state.imports || [];

  // 1. Website Imported (50%)
  if (state.settings?.websiteImportUrl) {
    score += 20;
    
    // Check if imports exist and are successful
    const successfulImports = imports.filter((i: any) => i.status === "completed" || i.status === "success");
    const failedImports = imports.filter((i: any) => i.status === "failed" || i.status === "error");

    if (successfulImports.length > 0) {
      score += 30; // Import actually worked
    } else if (failedImports.length > 0) {
      recommendations.push("Your website import failed. Try importing again or upload a sitemap.");
      confidence -= 20;
    } else {
      recommendations.push("Website import is currently processing or pending.");
    }
  } else {
    missingRequirements.push("Website URL");
    recommendations.push("Enter your website URL so the AI can automatically learn about your business.");
    confidence -= 30;
  }

  // 2. Widget Installed (50%)
  if (state.settings?.widgetInstalled) {
    score += 50;
  } else {
    missingRequirements.push("Chat Widget");
    recommendations.push("Install the AI chat widget on your website to start capturing leads and answering questions.");
  }

  // Bound score
  score = Math.max(0, Math.min(100, score));

  let status: HealthStatus;
  if (score >= 90) status = "Excellent";
  else if (score >= 70) status = "Good";
  else if (score >= 50) status = "Needs Attention";
  else status = "Critical";

  let reason = "";
  if (score >= 90) reason = "Website is successfully imported and the chat widget is active.";
  else if (score >= 70) reason = "Website is connected, but the widget might not be installed yet.";
  else if (score >= 50) reason = "Missing website content or widget installation.";
  else reason = `Critical website integration issues.`;

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
