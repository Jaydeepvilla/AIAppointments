import { BusinessState } from "../health-engine/types";
import { AIReadinessResult, QuestionCoverage } from "./types";
import { buildConfidenceScore } from "../confidence-engine";
import { calculateDomainCoverage } from "../coverage-engine";
import { generateImprovementsFromReadiness } from "../improvement-engine";

export function calculateContactReadiness(state: BusinessState): AIReadinessResult {
  const profile = state.profile || {};
  const settings = state.settings || {};
  const org = state.organization || {};

  const hasPhone = !!org.phone || !!profile.phone || !!settings.phone;
  const hasEmail = !!org.email || !!profile.email || !!settings.email;
  const hasAddress = !!org.address || !!profile.address || !!settings.address;
  const hasWebsite = !!org.website || !!profile.website || !!settings.website;
  const hasSocials = !!profile.socialLinks && Object.keys(profile.socialLinks).length > 0;

  const questions: QuestionCoverage[] = [
    {
      question: "How do I contact you?",
      canAnswer: hasPhone || hasEmail,
      confidence: (hasPhone ? 50 : 0) + (hasEmail ? 50 : 0),
      missingData: []
    },
    {
      question: "What is your phone number?",
      canAnswer: hasPhone,
      confidence: hasPhone ? 100 : 0,
      missingData: hasPhone ? [] : ["Phone Number"]
    },
    {
      question: "What is your email address?",
      canAnswer: hasEmail,
      confidence: hasEmail ? 100 : 0,
      missingData: hasEmail ? [] : ["Email Address"]
    },
    {
      question: "Where are you located?",
      canAnswer: hasAddress,
      confidence: hasAddress ? 100 : 0,
      missingData: hasAddress ? [] : ["Physical Address"]
    },
    {
      question: "What is your website?",
      canAnswer: hasWebsite,
      confidence: hasWebsite ? 100 : 0,
      missingData: hasWebsite ? [] : ["Website URL"]
    }
  ];

  // Adjust missing data array dynamically for the first question
  if (!hasPhone && !hasEmail) {
    questions[0].missingData.push("Phone Number", "Email Address");
  }

  const coverage = calculateDomainCoverage("Contact", questions);

  // Calculate confidence based on data completeness
  let confidenceBase = 0;
  const confidenceReasons: string[] = [];

  if (hasPhone) { confidenceBase += 30; confidenceReasons.push("Phone number is configured."); }
  if (hasEmail) { confidenceBase += 30; confidenceReasons.push("Email address is configured."); }
  if (hasAddress) { confidenceBase += 30; confidenceReasons.push("Physical address is configured."); }
  if (hasWebsite) { confidenceBase += 10; confidenceReasons.push("Website URL is configured."); }

  if (confidenceBase === 0) {
    confidenceReasons.push("No contact information is configured.");
  }

  const confidence = buildConfidenceScore(confidenceBase, confidenceReasons);

  const result: AIReadinessResult = {
    domain: "Contact",
    readinessScore: coverage.coveragePercentage,
    confidence,
    coverage,
    improvements: [], // Populated below
    lastUpdated: new Date().toISOString()
  };

  result.improvements = generateImprovementsFromReadiness(result);

  return result;
}
