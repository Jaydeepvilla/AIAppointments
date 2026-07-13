import { BusinessState } from "../health-engine/types";
import { detectDuplicates } from "../duplicate-detector";
import { analyzeContent } from "../content-analyzer";

export interface QualityScoreResult {
  score: number;
  coverage: number;
  strongAreas: string[];
  weakAreas: string[];
  trend: "up" | "down" | "flat";
  maxScore?: number;
  formula?: string;
  whyLow?: string;
  missingRequirements?: string[];
  exactActions?: string[];
}

export function calculateKnowledgeQuality(state: BusinessState, previousScore?: number): QualityScoreResult {
  const strongAreas: string[] = [];
  const weakAreas: string[] = [];
  const missingRequirements: string[] = [];
  const exactActions: string[] = [];
  
  const faqs = state.faqs || [];
  const docs = (state.documents || []).filter(d => !d.isArchived);
  
  // 1. Coverage (0-100)
  let coverage = 0;
  if (state.settings?.websiteImportUrl) {
    coverage += 30;
    strongAreas.push("Website URL configured");
  } else {
    missingRequirements.push("Website URL Import");
    exactActions.push("Import website data under Knowledge Base settings");
  }

  if (faqs.length >= 10) {
    coverage += 30;
    strongAreas.push("Standard FAQs set up");
  } else {
    missingRequirements.push("Business FAQs");
    exactActions.push(`Add ${10 - faqs.length} more business FAQs to cover customer queries`);
  }

  if (docs.length >= 4) {
    coverage += 40;
    strongAreas.push("Deep context documents configured");
  } else {
    missingRequirements.push("Business Documents");
    exactActions.push(`Upload ${4 - docs.length} more documents for business context`);
  }
  
  if (coverage > 80) {
    strongAreas.push("Comprehensive knowledge coverage");
  } else {
    weakAreas.push("Missing foundational knowledge sources");
  }
  
  let score = 100;

  // 2. Deduplication Penalty
  const faqDuplicates = detectDuplicates(faqs, f => f.question + " " + f.answer);
  if (faqDuplicates.length > 0) {
    score -= (faqDuplicates.length * 5);
    weakAreas.push(`${faqDuplicates.length} overlapping FAQs detected`);
    exactActions.push("Resolve overlapping or duplicate FAQs");
  }
  
  // 3. Content Quality
  let weakDocs = 0;
  docs.forEach(doc => {
    const analysis = analyzeContent(doc.content || "", "document");
    if (analysis.isWeak) {
      score -= 5;
      weakDocs++;
    }
  });
  
  if (weakDocs > 0) {
    weakAreas.push(`${weakDocs} documents have weak or incomplete content`);
    exactActions.push("Revise weak documents to improve content density");
  } else if (docs.length > 0) {
    strongAreas.push("High information density in documents");
  }

  score = Math.max(0, Math.min(100, Math.round(score * (coverage / 100))));
  
  // Calculate trend based on historical DB states if provided
  let trend: "up" | "down" | "flat" = "flat";
  if (previousScore !== undefined) {
    trend = score > previousScore ? "up" : score < previousScore ? "down" : "flat";
  } else {
    trend = score >= 80 ? "up" : score <= 50 ? "down" : "flat";
  }

  const formula = "Score = [30% Website URL + 3% per FAQ (max 30%) + 10% per Doc (max 40%)] - 5% per duplicate FAQ - 5% per weak document";
  let whyLow = "Your AI is missing foundational context, placing it at risk of hallucination or silence.";
  if (score === 100) {
    whyLow = "Excellent! The AI has full access to complete and highly organized business documentation.";
  } else if (score >= 80) {
    whyLow = "The AI is well-trained but could benefit from a few extra FAQ entries or resolving minor duplicates.";
  }
  
  return {
    score,
    coverage,
    strongAreas,
    weakAreas,
    trend,
    maxScore: 100,
    formula,
    whyLow,
    missingRequirements,
    exactActions,
  };
}
