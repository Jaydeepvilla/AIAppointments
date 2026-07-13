import { HistoryEngine } from "../history-engine";
import { SetupState } from "../setup-engine/types";
import { WeeklyProgressSummary, RemainingTask, SetupTaskCategory } from "../types/progress";

export const ProgressEngine = {
  /**
   * Calculates overall progress percentage based on SetupState
   */
  calculateOverallProgress(state: SetupState): number {
    let total = 0;
    let completed = 0;

    const check = (condition: boolean) => {
      total++;
      if (condition) completed++;
    };

    check(!!state.profile?.name);
    check(!!state.profile?.phone);
    check(!!state.settings?.websiteImportUrl);
    check(Object.keys(state.settings?.businessHours || {}).length > 0);
    check((state.servicesList?.length ?? 0) > 0);
    check((state.faqs?.length ?? 0) > 0);
    check((state.staff?.length ?? 0) > 0);
    
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  },

  /**
   * Generates a weekly progress summary by looking at the last 7 days of activity.
   */
  async getWeeklySummary(organizationId: string, currentState: SetupState): Promise<WeeklyProgressSummary> {
    const recentActivities = await HistoryEngine.getActivitiesSince(organizationId, 7);
    
    const completedThisWeek = recentActivities.length;
    const progressPercentage = this.calculateOverallProgress(currentState);
    
    const TaskWeightMap: Record<string, { health: number, readiness: number }> = {
      website_import: { health: 15, readiness: 20 },
      knowledge_base: { health: 15, readiness: 18 },
      business_hours: { health: 5, readiness: 2 },
      services: { health: 10, readiness: 15 },
      business_profile: { health: 20, readiness: 5 },
      staff: { health: 5, readiness: 5 },
      default: { health: 2, readiness: 2 }
    };

    let healthChange = 0;
    let readinessImprovement = 0;

    recentActivities.forEach(activity => {
      const weight = TaskWeightMap[activity.category] || TaskWeightMap.default;
      healthChange += weight.health;
      readinessImprovement += weight.readiness;
    });

    const trend = completedThisWeek > 0 ? "up" : "flat";

    return {
      completedThisWeek,
      progressPercentage,
      trend,
      newDocuments: recentActivities.filter(a => a.category === "knowledge_base").length,
      healthChange,
      readinessImprovement,
    };
  },

  /**
   * Identifies remaining tasks to hit 100% setup
   */
  getRemainingTasks(state: SetupState): RemainingTask[] {
    const tasks: RemainingTask[] = [];

    if (!state.profile?.name) {
      tasks.push({
        task: "Complete Business Profile",
        category: "business_profile",
        priority: "critical",
        impact: "critical",
        difficulty: "easy",
        estimatedMinutes: 5,
        canGenerateWithAi: false
      });
    }

    if (!state.settings?.websiteImportUrl) {
      tasks.push({
        task: "Import Website Data",
        category: "website_import",
        priority: "high",
        impact: "high",
        difficulty: "easy",
        estimatedMinutes: 2,
        canGenerateWithAi: true
      });
    }

    if (!state.faqs || state.faqs.length === 0) {
      tasks.push({
        task: "Add Knowledge Base FAQs",
        category: "knowledge_base",
        priority: "high",
        impact: "high",
        difficulty: "medium",
        estimatedMinutes: 15,
        canGenerateWithAi: true
      });
    }

    if (!state.servicesList || state.servicesList.length === 0) {
      tasks.push({
        task: "Add Services",
        category: "services",
        priority: "high",
        impact: "high",
        difficulty: "medium",
        estimatedMinutes: 10,
        canGenerateWithAi: false
      });
    }

    if (Object.keys(state.settings?.businessHours || {}).length === 0) {
      tasks.push({
        task: "Configure Business Hours",
        category: "business_hours",
        priority: "medium",
        impact: "medium",
        difficulty: "easy",
        estimatedMinutes: 3,
        canGenerateWithAi: true
      });
    }

    return tasks;
  }
};
