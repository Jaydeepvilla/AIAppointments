import { SetupState } from "../setup-engine/types";
import { Achievement } from "../types/progress";

export const AchievementEngine = {
  /**
   * Generates unlocked achievements based on the current setup state.
   */
  getAchievements(state: SetupState): Achievement[] {
    const achievements: Achievement[] = [];

    if (state.profile?.name && state.profile?.phone) {
      achievements.push({
        title: "Digital Presence Established",
        description: "You've added your core business identity.",
        date: new Date(),
        impact: "Basic AI functionality unlocked",
      });
    }

    if (state.faqs && state.faqs.length > 5) {
      achievements.push({
        title: "Knowledge Master",
        description: "Your AI now has a solid knowledge base to answer questions.",
        date: new Date(),
        impact: "+20% AI Readiness",
      });
    }

    if (state.servicesList && state.servicesList.length > 0) {
      achievements.push({
        title: "Open for Business",
        description: "You've defined the services your AI can talk about.",
        date: new Date(),
        impact: "Service inquiries enabled",
      });
    }

    return achievements;
  }
};
