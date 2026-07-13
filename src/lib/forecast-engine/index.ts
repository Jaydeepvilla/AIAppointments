import { SetupState } from "../setup-engine/types";
import { ProgressEngine } from "../progress-engine";
import { CompletionForecast } from "../types/progress";

export const ForecastEngine = {
  /**
   * Generates a forecast for when the user will finish setup.
   */
  generateForecast(state: SetupState): CompletionForecast {
    const remainingTasks = ProgressEngine.getRemainingTasks(state);
    const tasksLeft = remainingTasks.length;
    
    let remainingMinutes = 0;
    remainingTasks.forEach(t => remainingMinutes += t.estimatedMinutes);

    const remainingHours = Math.ceil(remainingMinutes / 60);
    const recommendedDailyTasks = Math.max(1, Math.ceil(tasksLeft / 3)); // Assume aiming for 3 days

    let estimatedCompletionDate: Date | null = new Date();
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + 3);

    if (tasksLeft === 0) {
      estimatedCompletionDate = null;
    }

    return {
      estimatedCompletionDate,
      remainingHours,
      recommendedDailyTasks,
      tasksLeft,
      readinessForecast: tasksLeft === 0 ? 100 : Math.round(100 - (tasksLeft * 5)),
    };
  }
};
