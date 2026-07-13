import { SetupState, SetupTask, RecommendationResult, ReadinessScoreResult } from "./types";
import { SETUP_TASKS } from "./tasks";

// Helper: check if a task is locked by dependencies
export function isTaskLocked(task: SetupTask, state: SetupState): boolean {
  if (!task.dependencies || task.dependencies.length === 0) return false;
  return task.dependencies.some(depId => {
    const depTask = SETUP_TASKS.find(t => t.id === depId);
    if (!depTask) return false;
    return !depTask.isCompleted(state);
  });
}

// 1. Recommendation Engine (AI Next Best Action)
export function getRecommendation(state: SetupState): RecommendationResult | null {
  const incompleteTasks = SETUP_TASKS.filter(t => !t.isCompleted(state) && !isTaskLocked(t, state));
  
  if (incompleteTasks.length === 0) return null;

  // Sort by Impact (High > Medium > Low) then Difficulty (Easy > Medium > Advanced)
  const impactWeight = { High: 3, Medium: 2, Low: 1 };
  const difficultyWeight = { Easy: 3, Medium: 2, Advanced: 1 };

  incompleteTasks.sort((a, b) => {
    const impactDiff = impactWeight[b.impact] - impactWeight[a.impact];
    if (impactDiff !== 0) return impactDiff;
    return difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty];
  });

  const bestTask = incompleteTasks[0];
  return {
    task: bestTask,
    priority: 1,
    reason: bestTask.whyItMatters,
  };
}

// 2. Readiness Scoring Engine
export function getReadinessScore(state: SetupState): ReadinessScoreResult {
  let score = 0;
  const categories = {
    "Business Info": { weight: 20, score: 0, total: 0 },
    "Knowledge Base": { weight: 30, score: 0, total: 0 },
    "Appointments": { weight: 25, score: 0, total: 0 },
  };

  SETUP_TASKS.forEach(task => {
    if (categories[task.category as keyof typeof categories]) {
      categories[task.category as keyof typeof categories].total++;
      if (task.isCompleted(state)) {
        categories[task.category as keyof typeof categories].score++;
      }
    }
  });

  let totalScore = 0;
  const missingAreas: string[] = [];
  let strongestArea: string | null = null;
  let weakestArea: string | null = null;
  let maxCompletion = -1;
  let minCompletion = 101;

  Object.entries(categories).forEach(([name, data]) => {
    const completionPct = data.total > 0 ? (data.score / data.total) : 0;
    totalScore += completionPct * data.weight;

    if (completionPct < 1) missingAreas.push(name);

    if (completionPct > maxCompletion) {
      maxCompletion = completionPct;
      strongestArea = name;
    }
    if (completionPct < minCompletion) {
      minCompletion = completionPct;
      weakestArea = name;
    }
  });

  return {
    overallScore: Math.round((totalScore / 75) * 100), // scaling up to 100 based on implemented categories weight sum
    missingAreas,
    strongestArea: maxCompletion > 0 ? strongestArea : null,
    weakestArea: minCompletion < 1 ? weakestArea : null,
  };
}

// 3. AI Confidence Engine
export function getAiConfidence(state: SetupState): number {
  let confidence = 0;
  
  if (state.profile?.description?.length > 50) confidence += 20;
  if (state.settings?.websiteImportUrl) confidence += 40;
  if (state.faqs && state.faqs.length > 0) confidence += 20;
  if (state.servicesList && state.servicesList.length > 0) confidence += 20;
  
  return Math.min(100, confidence);
}

// 4. Daily Goals Engine
export function getDailyGoals(state: SetupState): SetupTask[] {
  const incompleteTasks = SETUP_TASKS.filter(t => !t.isCompleted(state) && !isTaskLocked(t, state));
  return incompleteTasks.slice(0, 3);
}

// 5. Timeline Engine
export function getTimeline(state: SetupState) {
  const completed = SETUP_TASKS.filter(t => t.isCompleted(state));
  const remaining = SETUP_TASKS.filter(t => !t.isCompleted(state));
  
  let totalRemainingTime = 0;
  remaining.forEach(t => totalRemainingTime += t.estimatedTimeMinutes);

  return {
    completed,
    remaining,
    totalRemainingTime
  };
}
