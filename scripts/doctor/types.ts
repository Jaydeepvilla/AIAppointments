export type RuleSeverity = "Info" | "Warning" | "Error" | "Critical";

export interface Violation {
  rule?: string;
  category?: string;
  file?: string;
  line?: number;
  column?: number;
  message: string;
  severity: RuleSeverity;
  // Optional AST fix function to be executed in --fix-safe mode
  fix?: () => void;
  // Metadata for advanced reporting
  suggestion?: string;
  value?: string;
  replacement?: string;
  reason?: string;
  confidence?: "High" | "Medium" | "Low";
  estimatedRisk?: "Low" | "Medium" | "High";
  canAutoFix?: boolean;
  risk?: "Low" | "Medium" | "High"; // Additional risk property if required
}

export interface RuleBreakdown {
  category: string;
  violationCount: number;
  affectedFiles: number;
  topFiles?: { file: string; count: number }[];
  topValues: { value: string; count: number }[];
  suggestion: string;
  confidence: "High" | "Medium" | "Low";
  severity?: RuleSeverity;
}

export interface RuleResult {
  id: string;
  name: string;
  category: string;
  score?: number; // Weighted 0-100 based on severities
  passed: boolean;
  violations: Violation[];
  breakdown?: RuleBreakdown[];
  executionTimeMs?: number;
  metadata?: Record<string, any>;
}

export interface DoctorConfig {
  plugins?: string[];
  disabledRules?: string[];
  strict?: boolean;
  strictThreshold?: number;
  ignorePaths?: string[];
  customSeverities?: Record<string, RuleSeverity>;
  customSpacingTokens?: string[];
  allowedIconLibraries?: string[];
}

export interface DoctorContext {
  cwd: string;
  projectAst: import("ts-morph").Project; 
  cssTokens: any;
  config: DoctorConfig;
  isFixMode?: boolean;
  changedFiles?: string[];
}

export interface DoctorRule {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: RuleSeverity;
  execute(context: DoctorContext): Promise<RuleResult>;
}
