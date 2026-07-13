import { BusinessState } from "../health-engine/types";
import { QualityScoreResult } from "./knowledge-quality";
import { detectDuplicates } from "../duplicate-detector";

export function calculateCrmQuality(state: BusinessState): QualityScoreResult {
  let score = 100;
  const strongAreas: string[] = [];
  const weakAreas: string[] = [];
  
  const leads = state.leads || [];
  
  if (leads.length === 0) {
    return {
      score: 0,
      coverage: 0,
      strongAreas: [],
      weakAreas: ["No customer data imported"],
      trend: "flat"
    };
  }

  // 1. Coverage & Data Quality (0-100)
  let missingPhone = 0;
  let missingEmail = 0;
  let missingNotes = 0;

  leads.forEach(lead => {
    if (!lead.phone) missingPhone++;
    if (!lead.email) missingEmail++;
    if (!lead.summary) missingNotes++;
  });

  const phoneCoverage = ((leads.length - missingPhone) / leads.length) * 100;
  const emailCoverage = ((leads.length - missingEmail) / leads.length) * 100;
  
  const coverage = Math.round((phoneCoverage + emailCoverage) / 2);

  if (coverage > 85) strongAreas.push("Excellent contact information coverage");
  else if (coverage < 50) weakAreas.push("Poor contact information coverage");

  if (missingNotes > (leads.length * 0.5)) {
    score -= 20;
    weakAreas.push("Over 50% of customers lack personalized notes");
  } else {
    strongAreas.push("Good customer personalization");
  }

  // 2. Deduplication Penalty
  const duplicateContacts = detectDuplicates(leads, l => (l.name || "") + " " + (l.phone || "") + " " + (l.email || ""), 90);
  if (duplicateContacts.length > 0) {
    score -= (duplicateContacts.length * 10);
    weakAreas.push(`${duplicateContacts.length} potential duplicate customers detected`);
  }

  score = Math.max(0, Math.min(100, Math.round(score * (coverage / 100))));
  
  return {
    score,
    coverage,
    strongAreas,
    weakAreas,
    trend: "up"
  };
}
