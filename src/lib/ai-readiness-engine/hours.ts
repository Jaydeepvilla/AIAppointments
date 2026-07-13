import { BusinessState } from "../health-engine/types";
import { AIReadinessResult, QuestionCoverage } from "./types";
import { buildConfidenceScore } from "../confidence-engine";
import { calculateDomainCoverage } from "../coverage-engine";
import { generateImprovementsFromReadiness } from "../improvement-engine";

export function calculateBusinessHoursReadiness(state: BusinessState): AIReadinessResult {
  const org = state.organization || {};
  const settings = state.settings || {};

  const timezone = org.timezone;
  const businessHours = settings.businessHours;
  const holidays = settings.holidays || [];

  const hasTimezone = !!timezone;
  const hasBusinessHours = businessHours && Object.keys(businessHours).length > 0;
  
  // Check if there's any 'closed: false' which implies they are open some days
  const hasValidHours = hasBusinessHours && Object.values(businessHours).some((h: any) => !h.closed);

  const hasHolidays = holidays.length > 0;

  const questions: QuestionCoverage[] = [
    {
      question: "What are your business hours?",
      canAnswer: hasValidHours,
      confidence: hasValidHours ? 100 : 0,
      missingData: hasValidHours ? [] : ["Business Hours"]
    },
    {
      question: "Are you open today?",
      canAnswer: hasValidHours && hasTimezone,
      confidence: hasValidHours && hasTimezone ? 100 : 0,
      missingData: []
    },
    {
      question: "What time zone are you in?",
      canAnswer: hasTimezone,
      confidence: hasTimezone ? 100 : 0,
      missingData: hasTimezone ? [] : ["Timezone"]
    },
    {
      question: "Are you open on holidays?",
      canAnswer: hasHolidays,
      confidence: hasHolidays ? 100 : 0,
      missingData: hasHolidays ? [] : ["Holidays"]
    }
  ];

  if (!hasValidHours && !hasTimezone) {
    questions[1].missingData.push("Business Hours", "Timezone");
  } else if (!hasValidHours) {
    questions[1].missingData.push("Business Hours");
  } else if (!hasTimezone) {
    questions[1].missingData.push("Timezone");
  }

  const coverage = calculateDomainCoverage("Business Hours", questions);

  let confidenceBase = 0;
  const confidenceReasons: string[] = [];

  if (hasValidHours) { 
    confidenceBase += 50; 
    confidenceReasons.push("Business hours are defined."); 
  } else {
    confidenceReasons.push("No valid business hours defined.");
  }
  
  if (hasTimezone) { 
    confidenceBase += 30; 
    confidenceReasons.push(`Timezone (${timezone}) is configured.`); 
  } else {
    confidenceReasons.push("Timezone is missing. AI cannot determine 'today' accurately.");
  }

  if (hasHolidays) {
    confidenceBase += 20;
    confidenceReasons.push("Holiday schedule is defined.");
  } else {
    confidenceReasons.push("No holiday schedule provided. AI might schedule appointments on holidays.");
  }

  const confidence = buildConfidenceScore(confidenceBase, confidenceReasons);

  const result: AIReadinessResult = {
    domain: "Business Hours",
    readinessScore: coverage.coveragePercentage,
    confidence,
    coverage,
    improvements: [], 
    lastUpdated: new Date().toISOString()
  };

  result.improvements = generateImprovementsFromReadiness(result);

  return result;
}
