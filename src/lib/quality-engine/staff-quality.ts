import { BusinessState, HealthScoreResult } from "../health-engine/types";
import { generateStaffRecommendations } from "../staff-engine";

export function calculateStaffQualityScore(state: BusinessState): HealthScoreResult {
  let score = 100;
  const missingRequirements: string[] = [];
  const exactActions: string[] = [];
  const recommendations: string[] = [];
  
  const staff = state.staff || [];
  const staffSchedules = state.staffSchedules || [];
  
  // 1. Staff configuration check
  if (staff.length === 0) {
    score -= 40;
    missingRequirements.push("Active Staff Profiles");
    exactActions.push("Add at least one staff profile under Team settings");
  } else {
    recommendations.push(`${staff.length} staff profiles configured`);
  }

  // 2. Staff Calendar Sync check
  const syncedStaff = staff.filter(member => member.googleCalendarId || member.outlookCalendarId || state.calendarConnections?.some(c => c.email === member.email));
  const missingSyncCount = staff.length - syncedStaff.length;
  if (staff.length > 0 && missingSyncCount > 0) {
    score -= 30;
    missingRequirements.push("Staff Calendar Connections");
    exactActions.push(`Link Google or Outlook calendars for ${missingSyncCount} staff members`);
  } else if (staff.length > 0) {
    recommendations.push("All staff members have synced calendars");
  }

  // 3. Shifts/Schedules check
  if (staff.length > 0 && staffSchedules.length === 0) {
    score -= 30;
    missingRequirements.push("Working Shifts");
    exactActions.push("Configure shift schedules for staff members to define availability hours");
  } else if (staff.length > 0) {
    recommendations.push("Staff working shifts configured successfully");
  }

  let status: HealthScoreResult["status"] = "Excellent";
  if (score < 50) status = "Critical";
  else if (score < 80) status = "Needs Attention";
  else if (score < 95) status = "Good";

  const formula = "Score = 100% - 40% (No Staff Configured) - 30% (Staff Calendar Unsynced) - 30% (No Shifts Configured)";
  let whyLow = "Your staff availability profiles are incomplete, meaning the AI cannot route bookings to specific team members.";
  if (score === 100) {
    whyLow = "Excellent! All active staff have working hours defined and calendars synced.";
  } else if (score >= 60) {
    whyLow = "Your staff is set up, but some members are missing synced calendars or hours configurations.";
  }

  return {
    score,
    status,
    reason: score === 100 ? "Staff configuration is perfectly optimized." : "Your staff configuration needs attention to route bookings correctly.",
    confidence: 100,
    missingRequirements,
    recommendations,
    lastUpdated: new Date().toISOString(),
    maxScore: 100,
    formula,
    whyLow,
    exactActions,
  };
}
