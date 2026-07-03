import path from "path";
import fs from "fs";
import { loadContext } from "./utils/context-loader";
import { reportResults } from "./utils/reporter";
import { DoctorRule, RuleResult } from "./types";
import pc from "picocolors";
import { verifyIcons } from "./rules/verify-icons";
import { verifyRouting } from "./rules/verify-routing";
import { verifyUnused } from "./rules/verify-unused";
import { verifyAiCompliance } from "./rules/verify-ai-compliance";
import { verifyFunctionality } from "./rules/verify-functionality";
import { verifyUiQuality } from "./rules/verify-ui-quality";

const BASELINE_FILE = ".operator-doctor-baseline.json";

async function discoverRules(dir: string): Promise<DoctorRule[]> {
  const rules: DoctorRule[] = [];
  if (!fs.existsSync(dir)) return rules;

  const files = fs.readdirSync(dir).filter(f => f.endsWith(".ts") && f !== "index.ts");
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      const module = await import(`file://${filePath}`);
      const exportedRule = Object.values(module).find(
        (exp: any) => exp && typeof exp === "object" && exp.id && typeof exp.execute === "function"
      );
      if (exportedRule) {
        rules.push(exportedRule as DoctorRule);
      }
    } catch (e) {
      console.error(`Failed to load rule/plugin: ${file}`, e);
    }
  }
  return rules;
}

function printHelp() {
  console.log(`
Usage: npm run operator:doctor [options]

Options:
  --rule <id>            Only execute the selected rule.
  --category <name>      Only execute rules in that category.
  --list                 Display every available rule.
  --summary              Display only the dashboard summary.
  --details              Display detailed violations per rule.
  --json                 Output machine-readable JSON.
  --sarif                Generate reports/operator-doctor.sarif.
  --changed              Analyze ONLY files changed in Git.
  --baseline             Creates or updates the baseline file.
  --reset-baseline       Deletes the baseline file.
  --fix-safe             Run safe autofixes on violations.
  --strict               Fail the process if health score is below threshold.
  --watch                Watch for file changes and re-run.
  --help                 Show this help message.
`);
}

function loadBaseline(cwd: string): Record<string, string[]> {
  const baselinePath = path.join(cwd, BASELINE_FILE);
  if (!fs.existsSync(baselinePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(baselinePath, "utf-8"));
  } catch (e) {
    return {};
  }
}

function saveBaseline(cwd: string, results: RuleResult[]) {
  const baseline: Record<string, string[]> = {};
  for (const res of results) {
    baseline[res.id] = res.violations.map(v => `${v.file}:${v.line}:${v.message}`);
  }
  fs.writeFileSync(path.join(cwd, BASELINE_FILE), JSON.stringify(baseline, null, 2));
  console.log(pc.green(`\n✓ Baseline saved to ${BASELINE_FILE}`));
}

function applyBaseline(results: RuleResult[], baseline: Record<string, string[]>, changedFiles?: string[]) {
  let resolvedViolationsCount = 0;

  for (const res of results) {
    if (baseline[res.id]) {
      const baselineSet = new Set(baseline[res.id]);
      const currentViolations = new Set(res.violations.map(v => `${v.file}:${v.line}:${v.message}`));
      
      res.violations = res.violations.filter(v => !baselineSet.has(`${v.file}:${v.line}:${v.message}`));
      
      let changedSet: Set<string> | null = null;
      if (changedFiles && changedFiles.length > 0) {
        changedSet = new Set(changedFiles.map(f => path.resolve(f).replace(/\\/g, '/')));
      }

      for (const baselineV of baseline[res.id]) {
        const filePart = baselineV.substring(0, baselineV.indexOf(':'));
        
        if (changedSet && !changedSet.has(path.resolve(filePart).replace(/\\/g, '/'))) {
           continue;
        }
        
        if (!currentViolations.has(baselineV)) {
           resolvedViolationsCount++;
        }
      }
    }
  }
  
  return {
    resolvedViolations: resolvedViolationsCount,
    newViolations: results.reduce((acc, r) => acc + r.violations.length, 0)
  };
}

async function run(args: string[]) {
  const cwd = process.cwd();

  if (args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  if (args.includes("--reset-baseline")) {
    const baselinePath = path.join(cwd, BASELINE_FILE);
    if (fs.existsSync(baselinePath)) {
      fs.unlinkSync(baselinePath);
      console.log(pc.green(`✓ Baseline removed.`));
    } else {
      console.log(pc.gray(`No baseline file found.`));
    }
    process.exit(0);
  }

  const isDetailsMode = args.includes("--details");
  const isJsonMode = args.includes("--json");
  const isSarifMode = args.includes("--sarif");
  const isFixMode = args.includes("--fix-safe");
  const isStrict = args.includes("--strict");
  const isWatch = args.includes("--watch");
  const isSummaryMode = args.includes("--summary");
  const isChangedMode = args.includes("--changed");
  const isBaselineMode = args.includes("--baseline");

  const ruleArgIndex = args.indexOf("--rule");
  const specificRule = ruleArgIndex !== -1 ? args[ruleArgIndex + 1] : null;

  const catArgIndex = args.indexOf("--category");
  const specificCategory = catArgIndex !== -1 ? args[catArgIndex + 1].toLowerCase() : null;

  let rules = [
    ...await discoverRules(path.join(cwd, "scripts/doctor/rules")),
    ...await discoverRules(path.join(cwd, "scripts/doctor/plugins"))
  ];

  if (args.includes("--list")) {
    console.log(pc.bold("\nAvailable Rules\n"));
    for (const rule of rules) {
      console.log(`${pc.cyan(rule.id.padEnd(20))} ${pc.gray(rule.category.padEnd(25))} ${rule.description}`);
    }
    console.log("");
    process.exit(0);
  }

  async function executeOnce() {
    const context = await loadContext(cwd, isFixMode, isChangedMode);
    
    // Filter disabled rules
    if (context.config.disabledRules && context.config.disabledRules.length > 0) {
      rules = rules.filter(r => !context.config.disabledRules!.includes(r.id));
    }
    
    // Filter to specific rule if requested
    if (specificRule) {
      rules = rules.filter(r => r.id === specificRule || r.name.toLowerCase() === specificRule.toLowerCase());
    }

    // Filter to specific category if requested
    if (specificCategory) {
      rules = rules.filter(r => r.category.toLowerCase().includes(specificCategory));
    }

    const results: RuleResult[] = await Promise.all(
      rules.map(async rule => {
        const start = performance.now();
        const result = await rule.execute(context);
        const end = performance.now();
        
        // Handle auto-fix
        if (isFixMode) {
          let fixedCount = 0;
          for (const v of result.violations) {
            if (v.fix) {
              try {
                v.fix();
                fixedCount++;
              } catch (e) {
                console.error(`Fix failed for ${rule.id}:`, e);
              }
            }
          }
          if (fixedCount > 0 && context.projectAst) {
            await context.projectAst.save();
          }
        }
        
        return {
          ...result,
          id: rule.id,
          executionTimeMs: Math.round(end - start)
        };
      })
    );

    let baselineStats = { resolvedViolations: 0, newViolations: results.reduce((acc, r) => acc + r.violations.length, 0) };

    if (isBaselineMode) {
      saveBaseline(cwd, results);
    } else {
      const baseline = loadBaseline(cwd);
      baselineStats = applyBaseline(results, baseline, context.changedFiles);
    }

    reportResults(results, {
      details: isDetailsMode,
      summary: isSummaryMode,
      json: isJsonMode,
      sarif: isSarifMode,
      strict: isStrict,
      strictThreshold: context.config.strictThreshold,
      cwd,
      scannedFilesCount: context.projectAst?.getSourceFiles().length || 0,
      rulesExecutedCount: rules.length,
      isChangedMode: isChangedMode,
      changedFiles: context.changedFiles,
      newViolationsCount: baselineStats.newViolations,
      resolvedViolationsCount: baselineStats.resolvedViolations
    } as any);
  }

  if (isWatch) {
    console.log(pc.cyan("Starting Operator Doctor in Watch Mode..."));
    await executeOnce();
    
    let debounceTimer: NodeJS.Timeout | null = null;
    fs.watch(path.join(cwd, "src"), { recursive: true }, (eventType, filename) => {
      if (filename && (filename.endsWith(".ts") || filename.endsWith(".tsx") || filename.endsWith(".css"))) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          console.log(`\nDetected changes in ${filename}. Re-running...`);
          executeOnce().catch(console.error);
        }, 300);
      }
    });
  } else {
    await executeOnce();
  }
}

const args = process.argv.slice(2);
run(args).catch(err => {
  console.error(pc.red("Doctor encountered a fatal error:"));
  console.error(err);
  process.exit(1);
});
