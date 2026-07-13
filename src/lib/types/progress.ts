export type SetupTaskCategory = 
  | "business_profile"
  | "website_import"
  | "knowledge_base"
  | "services"
  | "staff"
  | "business_hours"
  | "booking_rules"
  | "policies"
  | "crm"
  | "widget"
  | "voice_ai"
  | "automations"
  | "channels"
  | "billing";

export type ImpactLevel = "low" | "medium" | "high" | "critical";

export interface BusinessActivity {
  id: string;
  organizationId: string;
  task: string;
  category: SetupTaskCategory;
  impact: ImpactLevel;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface SetupTimelineStep {
  category: SetupTaskCategory;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  estimatedMinutes: number;
  completedAt?: Date;
}

export interface WeeklyProgressSummary {
  completedThisWeek: number;
  progressPercentage: number;
  trend: "up" | "down" | "flat";
  newDocuments: number;
  healthChange: number;
  readinessImprovement: number;
}

export interface RemainingTask {
  task: string;
  category: SetupTaskCategory;
  priority: "low" | "medium" | "high" | "critical";
  estimatedMinutes: number;
  impact: ImpactLevel;
  difficulty: "easy" | "medium" | "hard";
  quickAction?: string;
  canGenerateWithAi: boolean;
}

export interface CompletionForecast {
  estimatedCompletionDate: Date | null;
  remainingHours: number;
  recommendedDailyTasks: number;
  tasksLeft: number;
  readinessForecast: number;
}

export interface Achievement {
  title: string;
  description: string;
  date: Date;
  impact: string;
}
