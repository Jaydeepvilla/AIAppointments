import { BusinessState } from "../../health-engine/types";
import { GapCalculator, GapAnalysisResult } from "../types";
import { RecommendationAction } from "../../recommendation-engine/types";

export const calculateStaffGaps: GapCalculator = (state: BusinessState) => {
  const missingItems: string[] = [];
  const recommendations: RecommendationAction[] = [];
  let score = 100;
  
  const staff = state.staff || [];
  
  if (staff.length === 0) {
    missingItems.push("No Staff Members");
    score -= 30;
    recommendations.push({
      id: "missing-staff-none",
      title: "Add Staff Members",
      description: "You have not added any staff members.",
      impactReason: "Without staff, the AI cannot book appointments or answer team-related questions.",
      impact: "High",
      estimatedTimeMinutes: 10,
      confidence: 100,
      confidenceReason: "Data check",
      primaryCtaText: "Add Staff",
      primaryCtaHref: "/staff"
    });
    return { score, completeness: score, missingItems, recommendations };
  }

  // Check for staff missing profiles or availability
  let missingProfiles = 0;
  
  staff.forEach(member => {
    if (!member.bio || !member.avatar) {
      missingProfiles++;
    }
  });

  if (missingProfiles > 0) {
    missingItems.push(`${missingProfiles} Staff missing profile info`);
    score -= 10;
    recommendations.push({
      id: "missing-staff-profiles",
      title: "Complete Staff Profiles",
      description: `${missingProfiles} staff members are missing a bio or avatar.`,
      impactReason: "Completed profiles improve the booking experience for your clients.",
      impact: "Medium",
      estimatedTimeMinutes: missingProfiles * 5,
      confidence: 90,
      confidenceReason: "Data check",
      primaryCtaText: "Edit Staff",
      primaryCtaHref: "/staff"
    });
  }

  return {
    score: Math.max(0, score),
    completeness: Math.max(0, score),
    missingItems,
    recommendations
  };
};
