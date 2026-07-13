import { BusinessState } from "../health-engine/types";
import { AIReadinessResult, QuestionCoverage } from "./types";
import { buildConfidenceScore } from "../confidence-engine";
import { calculateDomainCoverage } from "../coverage-engine";
import { generateImprovementsFromReadiness } from "../improvement-engine";

export function calculatePoliciesReadiness(state: BusinessState): AIReadinessResult {
  const settings = state.settings || {};
  const bookingPrefs = settings.bookingPreferences || {};

  const hasCancellationPolicy = !!settings.cancellationPolicy || !!bookingPrefs.cancellationPolicy;
  const hasNoShowPolicy = !!bookingPrefs.noShowPolicy;
  const hasRefundPolicy = !!settings.refundPolicy || !!bookingPrefs.refundPolicy;
  const hasReschedulePolicy = !!settings.reschedulePolicy || !!bookingPrefs.reschedulePolicy;

  const questions: QuestionCoverage[] = [
    {
      question: "What is your cancellation policy?",
      canAnswer: hasCancellationPolicy,
      confidence: hasCancellationPolicy ? 100 : 0,
      missingData: hasCancellationPolicy ? [] : ["Cancellation Policy"]
    },
    {
      question: "What happens if I don't show up?",
      canAnswer: hasNoShowPolicy,
      confidence: hasNoShowPolicy ? 100 : 0,
      missingData: hasNoShowPolicy ? [] : ["No Show Policy"]
    },
    {
      question: "Can I get a refund?",
      canAnswer: hasRefundPolicy,
      confidence: hasRefundPolicy ? 100 : 0,
      missingData: hasRefundPolicy ? [] : ["Refund Policy"]
    },
    {
      question: "Can I reschedule my appointment?",
      canAnswer: hasReschedulePolicy,
      confidence: hasReschedulePolicy ? 100 : 0,
      missingData: hasReschedulePolicy ? [] : ["Reschedule Policy"]
    }
  ];

  const coverage = calculateDomainCoverage("Policies", questions);

  let confidenceBase = 0;
  const confidenceReasons: string[] = [];

  if (hasCancellationPolicy) { 
    confidenceBase += 30; 
    confidenceReasons.push("Cancellation policy is configured."); 
  } else {
    confidenceReasons.push("No cancellation policy defined.");
  }
  
  if (hasNoShowPolicy) { 
    confidenceBase += 30; 
    confidenceReasons.push("No-show policy is configured."); 
  } else {
    confidenceReasons.push("No-show policy is missing.");
  }

  if (hasRefundPolicy) {
    confidenceBase += 20;
    confidenceReasons.push("Refund policy is defined.");
  }
  
  if (hasReschedulePolicy) {
    confidenceBase += 20;
    confidenceReasons.push("Reschedule policy is defined.");
  }

  if (confidenceBase === 0) {
    confidenceReasons.push("No business policies are defined. AI cannot handle customer disputes.");
  }

  const confidence = buildConfidenceScore(confidenceBase, confidenceReasons);

  const result: AIReadinessResult = {
    domain: "Policies",
    readinessScore: coverage.coveragePercentage,
    confidence,
    coverage,
    improvements: [], 
    lastUpdated: new Date().toISOString()
  };

  result.improvements = generateImprovementsFromReadiness(result);

  return result;
}
