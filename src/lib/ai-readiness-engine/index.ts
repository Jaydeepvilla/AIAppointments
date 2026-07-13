import { BusinessState } from "../health-engine/types";
import { calculateContactReadiness } from "./contact";
import { calculateBusinessHoursReadiness } from "./hours";
import { calculatePoliciesReadiness } from "./policies";
import { calculateServicesReadiness } from "./services";
import { calculateBookingReadiness } from "./booking";
import { AIReadinessResult } from "./types";

export interface GlobalAIReadiness {
  overallScore: number;
  overallConfidence: number;
  domains: {
    contact: AIReadinessResult;
    businessHours: AIReadinessResult;
    policies: AIReadinessResult;
    services: AIReadinessResult;
    booking: AIReadinessResult;
  };
  criticalMissingInformation: string[];
}

export function calculateGlobalAIReadiness(state: BusinessState): GlobalAIReadiness {
  const contact = calculateContactReadiness(state);
  const businessHours = calculateBusinessHoursReadiness(state);
  const policies = calculatePoliciesReadiness(state);
  const services = calculateServicesReadiness(state);
  const booking = calculateBookingReadiness(state);

  const allDomains = [contact, businessHours, policies, services, booking];

  // Calculate overall averages
  const overallScore = Math.round(
    allDomains.reduce((acc, curr) => acc + curr.readinessScore, 0) / allDomains.length
  );

  const overallConfidence = Math.round(
    allDomains.reduce((acc, curr) => acc + curr.confidence.score, 0) / allDomains.length
  );

  // Aggregate critical missing info
  const criticalMissingInformation = Array.from(
    new Set(allDomains.flatMap(d => d.coverage.missingInformation))
  );

  return {
    overallScore,
    overallConfidence,
    domains: {
      contact,
      businessHours,
      policies,
      services,
      booking,
    },
    criticalMissingInformation,
  };
}
