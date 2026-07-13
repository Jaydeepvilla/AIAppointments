import { BusinessState } from "../health-engine/types";
import { SetupState } from "../setup-engine/types";
import { BIReport } from "./types";
import { runBusinessAudit } from "./business-audit";
import { runOperationsAdvisor } from "./operations-advisor";
import { runGrowthEngine } from "./growth-engine";
import { runSeasonalEngine } from "./seasonal-engine";
import { runRevenueEngine } from "./revenue-engine";
import { runCustomerExperienceEngine } from "./customer-experience";
import { runWeeklyReview } from "./weekly-review";

export * from "./types";

export type BIEngineState = BusinessState & SetupState;

export const BIEngine = {
  /**
   * Generates the complete Business Intelligence report.
   * All synchronous engines run in parallel-equivalent pattern;
   * the single async engine (weeklyReview) is awaited separately.
   */
  async getFullReport(orgId: string, state: BIEngineState): Promise<BIReport> {
    // Run all synchronous engines
    const audit = runBusinessAudit(state);
    const operations = runOperationsAdvisor(state);
    const growth = runGrowthEngine(state);
    const seasonal = runSeasonalEngine(state);
    const revenue = runRevenueEngine(state);
    const customerExperience = runCustomerExperienceEngine(state);

    // Run async engine (DB read)
    const weeklyReview = await runWeeklyReview(orgId, state);

    return {
      generatedAt: new Date().toISOString(),
      audit,
      operations,
      growth,
      seasonal,
      revenue,
      customerExperience,
      weeklyReview,
    };
  },
};
