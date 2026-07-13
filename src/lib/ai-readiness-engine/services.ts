import { BusinessState } from "../health-engine/types";
import { AIReadinessResult, QuestionCoverage } from "./types";
import { buildConfidenceScore } from "../confidence-engine";
import { calculateDomainCoverage } from "../coverage-engine";
import { generateImprovementsFromReadiness } from "../improvement-engine";

export function calculateServicesReadiness(state: BusinessState): AIReadinessResult {
  const services = state.services || [];
  const taxProfiles = state.taxProfiles || [];

  const activeServices = services.filter((s: any) => s.isActive);
  const hasServices = activeServices.length > 0;
  
  const allHaveDescriptions = hasServices && activeServices.every((s: any) => !!s.description && s.description.length > 10);
  const allHavePrices = hasServices && activeServices.every((s: any) => !!s.price && parseFloat(s.price) > 0);
  const allHaveDurations = hasServices && activeServices.every((s: any) => !!s.duration && s.duration > 0);
  const hasTaxes = taxProfiles.length > 0;

  const questions: QuestionCoverage[] = [
    {
      question: "What services do you offer?",
      canAnswer: hasServices,
      confidence: hasServices ? 100 : 0,
      missingData: hasServices ? [] : ["Services List"]
    },
    {
      question: "Can you tell me more about [service]?",
      canAnswer: allHaveDescriptions,
      confidence: allHaveDescriptions ? 100 : (hasServices ? 50 : 0),
      missingData: allHaveDescriptions ? [] : ["Service Descriptions"]
    },
    {
      question: "How much does it cost?",
      canAnswer: allHavePrices,
      confidence: allHavePrices ? 100 : (hasServices ? 40 : 0),
      missingData: allHavePrices ? [] : ["Service Pricing"]
    },
    {
      question: "How long does it take?",
      canAnswer: allHaveDurations,
      confidence: allHaveDurations ? 100 : (hasServices ? 60 : 0),
      missingData: allHaveDurations ? [] : ["Service Duration"]
    },
    {
      question: "Are taxes included?",
      canAnswer: hasTaxes,
      confidence: hasTaxes ? 100 : 0,
      missingData: hasTaxes ? [] : ["Tax Profiles"]
    }
  ];

  const coverage = calculateDomainCoverage("Services", questions);

  let confidenceBase = 0;
  const confidenceReasons: string[] = [];

  if (hasServices) { 
    confidenceBase += 40; 
    confidenceReasons.push(`${activeServices.length} active services configured.`); 
  } else {
    confidenceReasons.push("No active services are configured. AI cannot answer any service-related questions.");
  }
  
  if (hasServices && allHaveDescriptions) { 
    confidenceBase += 20; 
    confidenceReasons.push("All services have adequate descriptions."); 
  } else if (hasServices) {
    confidenceReasons.push("Some services lack descriptions. AI cannot confidently explain them.");
  }

  if (hasServices && allHavePrices) {
    confidenceBase += 20;
    confidenceReasons.push("All services have pricing defined.");
  } else if (hasServices) {
    confidenceReasons.push("Some services are missing pricing information.");
  }
  
  if (hasServices && allHaveDurations) {
    confidenceBase += 10;
    confidenceReasons.push("All services have durations defined.");
  } else if (hasServices) {
    confidenceReasons.push("Some services are missing duration estimates.");
  }

  if (hasTaxes) {
    confidenceBase += 10;
    confidenceReasons.push("Tax profile is configured.");
  } else {
    confidenceReasons.push("No tax profile is defined. AI cannot quote accurate final prices.");
  }

  const confidence = buildConfidenceScore(confidenceBase, confidenceReasons);

  const result: AIReadinessResult = {
    domain: "Services & Pricing",
    readinessScore: coverage.coveragePercentage,
    confidence,
    coverage,
    improvements: [], 
    lastUpdated: new Date().toISOString()
  };

  result.improvements = generateImprovementsFromReadiness(result);

  return result;
}
