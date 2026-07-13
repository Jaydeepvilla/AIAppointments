import { BusinessState, HealthScoreResult, HealthStatus } from "../types";

export function calculateCrmHealth(state: BusinessState): HealthScoreResult {
  let score = 0;
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;

  const leads = state.leads || [];
  
  if (leads.length === 0) {
    missingRequirements.push("Customer Contacts");
    recommendations.push("Import existing customers or connect a lead source to build your CRM.");
    confidence -= 40;
    
    return {
      score: 0,
      status: "Critical",
      reason: "Your CRM is completely empty. The AI has no customer history to reference.",
      confidence,
      missingRequirements,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  // Base score for having leads
  score += 20;

  // 1. Data Quality Analysis
  let totalMissingFields = 0;
  let inactiveCount = 0;
  
  leads.forEach((lead: any) => {
    let missing = 0;
    if (!lead.name) missing++;
    if (!lead.email) missing++;
    if (!lead.phone) missing++;
    
    totalMissingFields += missing;

    if (lead.status === "inactive" || lead.status === "archived") {
      inactiveCount++;
    }
  });

  const avgMissingFields = totalMissingFields / leads.length;
  
  // Scoring Data Quality (up to 50%)
  if (avgMissingFields < 0.5) {
    score += 50; // Excellent data quality
  } else if (avgMissingFields <= 1.5) {
    score += 30; 
    recommendations.push("Many contacts are missing email addresses or phone numbers.");
  } else {
    score += 10;
    missingRequirements.push("Customer Contact Information");
    recommendations.push("Your CRM data quality is very low. Run a data enrichment campaign.");
  }

  // 2. Lead Activity (30%)
  const activePercentage = ((leads.length - inactiveCount) / leads.length) * 100;
  if (activePercentage >= 70) {
    score += 30;
  } else if (activePercentage >= 40) {
    score += 15;
    recommendations.push(`${inactiveCount} customers are inactive. Consider a re-engagement campaign.`);
  } else {
    score += 5;
    recommendations.push("The majority of your CRM consists of inactive contacts.");
  }

  // Bound score
  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: HealthStatus;
  if (score >= 90) status = "Excellent";
  else if (score >= 70) status = "Good";
  else if (score >= 50) status = "Needs Attention";
  else status = "Critical";

  let reason = "";
  if (score >= 90) reason = "CRM data is rich, active, and fully structured.";
  else if (score >= 70) reason = "Good CRM health with minor missing contact details.";
  else if (score >= 50) reason = "CRM contains many incomplete or inactive profiles.";
  else reason = `Critical CRM data issues. High volume of missing information.`;

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
