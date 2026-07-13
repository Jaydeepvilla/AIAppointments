import { BusinessState } from "../health-engine/types";
import { AIReadinessResult, QuestionCoverage } from "./types";
import { buildConfidenceScore } from "../confidence-engine";
import { calculateDomainCoverage } from "../coverage-engine";
import { generateImprovementsFromReadiness } from "../improvement-engine";

export function calculateBookingReadiness(state: BusinessState): AIReadinessResult {
  const staff = state.staff || [];
  const calendarConnections = state.calendarConnections || [];
  const serviceAssignments = state.serviceAssignments || [];
  const schedules = state.staffSchedules || [];
  const services = state.services || [];

  const activeStaff = staff.filter((s: any) => s.isActive);
  const hasStaff = activeStaff.length > 0;
  const hasCalendars = calendarConnections.length > 0;
  
  // A service is bookable if it's assigned to at least one active staff member
  const bookableServices = services.filter((s: any) => 
    s.isActive && serviceAssignments.some((sa: any) => sa.serviceId === s.id && activeStaff.some((st: any) => st.id === sa.staffId))
  );

  const hasBookableServices = bookableServices.length > 0;
  const hasSchedules = schedules.length > 0;

  const questions: QuestionCoverage[] = [
    {
      question: "Can I book an appointment?",
      canAnswer: hasBookableServices && hasSchedules,
      confidence: (hasBookableServices ? 50 : 0) + (hasSchedules ? 50 : 0),
      missingData: []
    },
    {
      question: "Who can perform this service?",
      canAnswer: hasStaff && hasBookableServices,
      confidence: hasStaff && hasBookableServices ? 100 : 0,
      missingData: hasStaff ? (hasBookableServices ? [] : ["Service Assignments"]) : ["Staff Members"]
    },
    {
      question: "Do you have any availability tomorrow?",
      canAnswer: hasSchedules && hasCalendars,
      confidence: (hasSchedules ? 50 : 0) + (hasCalendars ? 50 : 0),
      missingData: []
    }
  ];

  if (!hasBookableServices) questions[0].missingData.push("Bookable Services");
  if (!hasSchedules) questions[0].missingData.push("Staff Schedules");
  
  if (!hasSchedules) questions[2].missingData.push("Staff Schedules");
  if (!hasCalendars) questions[2].missingData.push("Calendar Connections");

  const coverage = calculateDomainCoverage("Booking", questions);

  let confidenceBase = 0;
  const confidenceReasons: string[] = [];

  if (hasStaff) { 
    confidenceBase += 20; 
    confidenceReasons.push(`${activeStaff.length} active staff members.`); 
  } else {
    confidenceReasons.push("No active staff. AI cannot book anyone.");
  }
  
  if (hasBookableServices) { 
    confidenceBase += 30; 
    confidenceReasons.push(`${bookableServices.length} services are assigned to staff and bookable.`); 
  } else {
    confidenceReasons.push("No services are assigned to staff. Customers cannot book anything.");
  }

  if (hasSchedules) {
    confidenceBase += 20;
    confidenceReasons.push("Staff schedules are configured.");
  } else {
    confidenceReasons.push("No staff schedules found. AI does not know when staff work.");
  }
  
  if (hasCalendars) {
    confidenceBase += 30;
    confidenceReasons.push("External calendars are connected (real-time availability).");
  } else {
    confidenceReasons.push("No calendar connections. High risk of double-booking.");
  }

  const confidence = buildConfidenceScore(confidenceBase, confidenceReasons);

  const result: AIReadinessResult = {
    domain: "Booking & Availability",
    readinessScore: coverage.coveragePercentage,
    confidence,
    coverage,
    improvements: [], 
    lastUpdated: new Date().toISOString()
  };

  result.improvements = generateImprovementsFromReadiness(result);

  return result;
}
