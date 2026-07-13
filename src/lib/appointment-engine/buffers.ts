import { RecommendationAction, RecommendationState } from "../recommendation-engine/types";

export function checkBuffers(state: RecommendationState): RecommendationAction[] {
  const recommendations: RecommendationAction[] = [];
  const rules = state.rules?.[0]; 
  const services = state.services || [];

  if (!rules) return [];

  // Check if buffer is completely disabled
  if (rules.defaultBufferBefore === 0 && rules.defaultBufferAfter === 0) {
    // See if any services are long enough to warrant a buffer
    const hasLongServices = services.some(s => s.duration >= 30);
    
    if (hasLongServices) {
      recommendations.push({
        id: "appointment-missing-buffers",
        title: "No Appointment Buffers Configured",
        description: "You have services lasting 30+ minutes but no buffer time between appointments. This often leads to running late and stressed staff.",
        primaryCtaText: "Add Buffers",
        primaryCtaHref: "/settings/appointments",
        estimatedTimeMinutes: 2,
        impact: "Medium",
        impactReason: "Buffers allow for clean up, notes, and biological breaks.",
        confidence: 90,
        confidenceReason: "Almost all service businesses need transition time.",
      });
    }
  }

  // Check if buffer is too large relative to average service time
  if (services.length > 0) {
    const avgDuration = services.reduce((acc, s) => acc + s.duration, 0) / services.length;
    const totalBuffer = rules.defaultBufferBefore + rules.defaultBufferAfter;
    
    if (totalBuffer > avgDuration && totalBuffer > 30) {
      recommendations.push({
        id: "appointment-excessive-buffers",
        title: "Excessive Buffer Times",
        description: `Your combined buffer time (${totalBuffer} mins) is longer than your average service duration (${Math.round(avgDuration)} mins).`,
        primaryCtaText: "Review Buffers",
        primaryCtaHref: "/settings/appointments",
        estimatedTimeMinutes: 2,
        impact: "Medium",
        impactReason: "Excessive buffers artificially limit your capacity and cost you money.",
        confidence: 80,
        confidenceReason: "Buffers should typically be a fraction of the service time.",
      });
    }
  }

  return recommendations;
}
