import { RecommendationAction } from "../recommendation-engine/types";

// ─── Severity & Category ─────────────────────────────────────────────────────

export type BISeverity = "critical" | "warning" | "opportunity" | "info";
export type BICategory =
  | "audit"
  | "operations"
  | "growth"
  | "seasonal"
  | "revenue"
  | "customer_experience"
  | "competitor_inspired";

export type EffortLevel = "quick" | "medium" | "project";

// ─── Core Recommendation ─────────────────────────────────────────────────────

/**
 * Extends RecommendationAction with BI-specific metadata.
 * Backward-compatible — all existing dashboard widgets still work.
 */
export interface BIRecommendation extends RecommendationAction {
  category: BICategory;
  severity: BISeverity;
  /** Qualitative description — never fabricated $ amounts */
  businessImpact: string;
  estimatedEffort: EffortLevel;
  seasonallyRelevant?: boolean;
  relatedModule?: string;
  tags?: string[];
}

// ─── Audit Finding ───────────────────────────────────────────────────────────

export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: BISeverity;
  area: string; // "Knowledge Base", "Booking", "CRM", etc.
  impact: string;
  recommendation: string;
  actionHref: string;
  actionText: string;
  confidence: number; // 0–100
}

export interface BusinessAuditResult {
  overallScore: number; // 0–100 from HealthEngine
  findingsCount: { critical: number; warning: number; info: number };
  findings: AuditFinding[];
  summary: string;
  auditedAt: string;
}

// ─── Operations Advisor ───────────────────────────────────────────────────────

export interface OperationsBottleneck {
  id: string;
  area: string;
  description: string;
  severity: BISeverity;
  suggestedFix: string;
  automationAvailable: boolean;
  actionHref: string;
}

export interface OperationsAdvisorResult {
  bottlenecks: OperationsBottleneck[];
  automationOpportunities: BIRecommendation[];
  benchmarkGaps: BIRecommendation[];
  workflowScore: number; // 0–100
}

// ─── Growth Engine ────────────────────────────────────────────────────────────

export interface GrowthIdea {
  id: string;
  title: string;
  description: string;
  type: "new_service" | "membership" | "promotion" | "referral" | "upsell" | "retention";
  severity: BISeverity;
  businessImpact: string;
  estimatedEffort: EffortLevel;
  industryRelevance: "high" | "medium" | "low";
  actionText: string;
  actionHref: string;
  confidence: number;
}

export interface GrowthEngineResult {
  ideas: GrowthIdea[];
  growthScore: number; // 0–100 (how much growth potential is untapped)
  industryName: string;
}

// ─── Seasonal Engine ──────────────────────────────────────────────────────────

export interface SeasonalEvent {
  id: string;
  name: string;
  date: string; // ISO date
  daysUntil: number;
  type: "holiday" | "industry_event" | "season_change";
}

export interface SeasonalRecommendation {
  id: string;
  event: SeasonalEvent;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  severity: BISeverity;
  businessImpact: string;
}

export interface SeasonalEngineResult {
  upcomingEvents: SeasonalEvent[];
  recommendations: SeasonalRecommendation[];
}

// ─── Revenue Engine ───────────────────────────────────────────────────────────

export interface RevenueOpportunity {
  id: string;
  title: string;
  description: string;
  type: "pricing" | "upsell" | "follow_up" | "membership" | "booking_flow" | "automation";
  severity: BISeverity;
  businessImpact: string;
  estimatedEffort: EffortLevel;
  actionText: string;
  actionHref: string;
  confidence: number;
}

export interface RevenueEngineResult {
  opportunities: RevenueOpportunity[];
  revenueReadinessScore: number; // 0–100
}

// ─── Customer Experience Engine ───────────────────────────────────────────────

export interface CXFrictionPoint {
  id: string;
  area: "booking" | "communication" | "reminders" | "follow_up" | "faq" | "policies" | "ai_quality";
  title: string;
  description: string;
  severity: BISeverity;
  suggestedFix: string;
  actionText: string;
  actionHref: string;
  confidence: number;
}

export interface CustomerExperienceResult {
  frictionPoints: CXFrictionPoint[];
  cxScore: number; // 0–100
  strongestArea: string;
  weakestArea: string;
}

// ─── Weekly Review ────────────────────────────────────────────────────────────

export interface WeeklyReview {
  weekOf: string; // ISO date
  completedImprovements: number;
  healthScoreDelta: number; // positive = improved, negative = regression
  readinessDelta: number;
  newRecommendations: number;
  unresolvedIssues: number;
  businessWins: string[];
  nextPriorities: BIRecommendation[];
  headline: string;
  summary: string;
}

// ─── Full BI Report ───────────────────────────────────────────────────────────

export interface BIReport {
  generatedAt: string;
  audit: BusinessAuditResult;
  operations: OperationsAdvisorResult;
  growth: GrowthEngineResult;
  seasonal: SeasonalEngineResult;
  revenue: RevenueEngineResult;
  customerExperience: CustomerExperienceResult;
  weeklyReview: WeeklyReview;
}
