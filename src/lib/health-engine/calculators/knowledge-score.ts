import { BusinessState, HealthScoreResult, HealthStatus } from "../types";

export function calculateKnowledgeHealth(state: BusinessState): HealthScoreResult {
  let score = 0;
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];
  let confidence = 100;

  const faqs = state.faqs || [];
  const documents = state.documents || [];
  
  // 1. FAQs (40%)
  if (faqs.length >= 10) {
    score += 40;
  } else if (faqs.length >= 5) {
    score += 25;
    recommendations.push("Add more FAQs to cover edge cases and detailed policies.");
  } else if (faqs.length > 0) {
    score += 10;
    recommendations.push("Your FAQ list is too short to handle diverse customer inquiries.");
  } else {
    missingRequirements.push("FAQs");
    recommendations.push("Add Frequently Asked Questions to instantly answer common queries.");
    confidence -= 30; // High confidence drop if no FAQs exist
  }

  // 2. Documents & Knowledge Base (40%)
  const activeDocs = documents.filter((d: any) => !d.isArchived);
  
  if (activeDocs.length >= 3) {
    score += 40;
  } else if (activeDocs.length >= 1) {
    score += 25;
    recommendations.push("Upload more business documents (e.g., policy PDFs, service menus).");
  } else {
    missingRequirements.push("Knowledge Documents");
    recommendations.push("Upload documents to build a robust knowledge base for the AI.");
    confidence -= 20;
  }

  // 3. Website/URL Import (20%)
  // If they have website imports, we add 20%. We use settings.websiteImportUrl as a proxy if imports array is missing.
  if (state.settings?.websiteImportUrl || (state.imports && state.imports.length > 0)) {
    score += 20;
  } else {
    missingRequirements.push("Website Knowledge");
    recommendations.push("Import your website content so the AI can learn your entire business context.");
  }

  // Data Quality Checks
  const faqCategories = new Set(faqs.map(f => f.category)).size;
  if (faqs.length > 0 && faqCategories < 2) {
    recommendations.push("Organize your FAQs into multiple categories for better coverage.");
  }

  const outdatedDocs = activeDocs.filter(d => {
    // If a document hasn't been updated in 6 months, it might be outdated
    if (d.updatedAt) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return new Date(d.updatedAt) < sixMonthsAgo;
    }
    return false;
  });

  if (outdatedDocs.length > 0) {
    score -= (outdatedDocs.length * 2); // Small penalty
    recommendations.push(`Review ${outdatedDocs.length} document(s) that haven't been updated in over 6 months.`);
  }

  // Bound score
  score = Math.max(0, Math.min(100, score));

  let status: HealthStatus;
  if (score >= 90) status = "Excellent";
  else if (score >= 70) status = "Good";
  else if (score >= 50) status = "Needs Attention";
  else status = "Critical";

  let reason = "";
  if (score >= 90) reason = "Excellent knowledge coverage. The AI has deep context.";
  else if (score >= 70) reason = "Good knowledge base, but expanding it will improve automation rates.";
  else if (score >= 50) reason = "Insufficient knowledge data. AI hallucination risk is moderate.";
  else reason = `Critical knowledge gaps. The AI cannot operate safely. Missing ${missingRequirements.length} sources.`;

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
