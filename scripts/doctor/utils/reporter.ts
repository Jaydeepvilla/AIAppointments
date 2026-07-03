import pc from "picocolors";
import fs from "fs";
import path from "path";
import { RuleResult, RuleSeverity } from "../types";

export interface ReporterOptions {
  details: boolean;
  summary: boolean;
  json: boolean;
  sarif: boolean;
  strict: boolean;
  strictThreshold?: number;
  cwd: string;
  scannedFilesCount: number;
  rulesExecutedCount: number;
  isChangedMode?: boolean;
  changedFiles?: string[];
  newViolationsCount?: number;
  resolvedViolationsCount?: number;
}

const severityWeights: Record<RuleSeverity, number> = {
  Info: 0,
  Warning: 2,
  Error: 10,
  Critical: 20
};

export function reportResults(results: RuleResult[], options: ReporterOptions) {
  let totalViolations = 0;
  let totalRuntime = 0;
  
  const violationsByCategory: Record<string, number> = {};

  for (const result of results) {
    let penalty = 0;
    for (const v of result.violations) {
      penalty += severityWeights[v.severity] || 0;
      totalViolations++;
      violationsByCategory[result.category] = (violationsByCategory[result.category] || 0) + 1;
    }
    result.score = Math.max(0, 100 - penalty);
    result.passed = result.score >= 80 && !result.violations.some(v => v.severity === "Critical");
    totalRuntime += result.executionTimeMs || 0;
  }

  if (options.sarif) {
    generateSarif(results, options.cwd);
  }

  if (options.json) {
    console.log(JSON.stringify({
      stats: { 
        totalViolations, 
        totalRuntime, 
        scannedFilesCount: options.scannedFilesCount, 
        rulesExecutedCount: options.rulesExecutedCount,
        ...(options.isChangedMode ? {
          changedFiles: options.changedFiles,
          newViolations: options.newViolationsCount,
          resolvedViolations: options.resolvedViolationsCount
        } : {})
      },
      results
    }, null, 2));
    if (options.strict) checkStrict(results, options.strictThreshold, options.isChangedMode);
    return;
  }

  generateHtml(results, options, totalViolations, totalRuntime, violationsByCategory);

  // GitHub Actions integration
  if (process.env.GITHUB_ACTIONS) {
    for (const result of results) {
      for (const v of result.violations) {
        const type = v.severity === "Info" ? "notice" : v.severity === "Warning" ? "warning" : "error";
        const fileParam = v.file ? `file=${v.file},` : "";
        const lineParam = v.line ? `line=${v.line},` : "";
        console.log(`::${type} ${fileParam}${lineParam}title=Doctor: ${result.name}::${v.message}`);
      }
    }
  }

  console.log("");
  console.log(pc.bold(pc.cyan("━".repeat(62))));
  console.log(pc.bold(pc.white(" ⚡ Operator Doctor")));
  console.log(pc.gray("    Version 2.0.0 — Enterprise Verification System"));
  console.log(pc.bold(pc.cyan("━".repeat(62) + "\n")));

  console.log(pc.white("  [ STATS ]"));
  console.log(pc.gray(`    Runtime:        ${totalRuntime}ms`));
  if (options.isChangedMode) {
    console.log(pc.gray(`    Changed Files:  ${options.scannedFilesCount}`));
  } else {
    console.log(pc.gray(`    Files Scanned:  ${options.scannedFilesCount}`));
  }
  console.log(pc.gray(`    Rules Executed: ${options.rulesExecutedCount}`));
  console.log("");

  const groupedByCategory = results.reduce((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, RuleResult[]>);

  for (const [category, categoryResults] of Object.entries(groupedByCategory)) {
    console.log(pc.bold(pc.white(`[ ${category.toUpperCase()} ]`)));
    
    for (const result of categoryResults) {
      const paddedName = result.name.padEnd(25, " ");
      if (result.passed) {
        console.log(`  ${paddedName} ${pc.green("✓ PASS")}`);
      } else {
        const violationsText = result.violations.length > 0 
          ? `(${result.violations.length} Violations)` 
          : "";
        const scoreText = result.score !== undefined ? `${result.score}% ` : "";
        console.log(`  ${paddedName} ${pc.red("✕ FAIL")} ${pc.gray(scoreText + violationsText)}`);
      }

      if (result.id === "ai-compliance" && result.metadata) {
        console.log(`\n  ${pc.bold("AI Compliance")}`);
        console.log(`  Score: ${result.metadata.aiScore}`);
        console.log(`  Status: ${result.metadata.aiStatus}\n`);
        
        const renderSubScore = (label: string, score: number) => {
          console.log(`  ${label}`);
          console.log(`  ${score >= 80 ? pc.green("PASS") : pc.red("FAIL")}`);
        };

        renderSubScore("Component Reuse", result.metadata.componentReuseScore);
        renderSubScore("Architecture", result.metadata.architectureScore);
        renderSubScore("Design System", result.metadata.designSystemScore);
        renderSubScore("Maintainability", result.metadata.maintainabilityScore);
        renderSubScore("Production", result.metadata.productionReadinessScore);
        
        console.log("");
        
        const warnings = result.violations.filter(v => v.severity === "Warning" || v.severity === "Error" || v.severity === "Critical");
        const infos = result.violations.filter(v => v.severity === "Info");
        
        if (warnings.length > 0) {
          console.log(`  ${pc.yellow("Warnings")}`);
          warnings.slice(0, 10).forEach(v => console.log(`  ${v.message}`));
          console.log("");
        }
        
        if (infos.length > 0) {
          console.log(`  ${pc.blue("Info")}`);
          infos.slice(0, 10).forEach(v => console.log(`  ${v.message}`));
          console.log("");
        }
        
      } else if (!options.summary && result.breakdown && result.breakdown.length > 0) {
        console.log();
        for (const b of result.breakdown) {
          const confColor = b.confidence === "High" ? pc.green : b.confidence === "Medium" ? pc.yellow : pc.red;
          const sevColor = b.severity === "Critical" ? pc.bgRed : b.severity === "Error" ? pc.red : b.severity === "Warning" ? pc.yellow : pc.blue;
          const sevStr = b.severity ? sevColor(`[${b.severity}]`) : "";
          console.log(`      ${pc.bold(pc.white(b.category.padEnd(25)))} ${pc.gray((b.violationCount + " viol.").padEnd(10))} ${pc.gray((b.affectedFiles + " files").padEnd(10))} ${sevStr} [${confColor(b.confidence)}]`);
          console.log(`        ${pc.gray("Top values:")}  ${b.topValues.map(tv => `${pc.white(tv.value)} (${tv.count})`).join(", ")}`);
          if (b.topFiles && b.topFiles.length > 0) {
              console.log(`        ${pc.gray("Top files:")}   ${b.topFiles.map(tf => `${pc.white(path.basename(tf.file))} (${tf.count})`).join(", ")}`);
          }
          console.log(`        ${pc.gray("Replacement:")} ${pc.italic(b.suggestion)}\n`);
        }
      } else if (!options.summary && options.details && !result.passed) {
        const subset = result.violations.slice(0, 15);
        for (const v of subset) {
          const sevColor = v.severity === "Critical" ? pc.bgRed : v.severity === "Error" ? pc.red : v.severity === "Warning" ? pc.yellow : pc.blue;
          console.log(`      ${sevColor(`[${v.severity}]`)} ${v.message} ${pc.gray(v.file ? `(${v.file}:${v.line || 1})` : "")}`);
          if (v.suggestion) {
            console.log(`        ${pc.italic(pc.gray(`Suggestion: ${v.suggestion}`))}`);
          }
        }
        if (result.violations.length > 15) {
          console.log(pc.gray(`      ...and ${result.violations.length - 15} more.`));
        }
      }
    }
    console.log("");
  }

  const averageScore = Math.round(
    results.reduce((acc, r) => acc + (r.score ?? 0), 0) / (results.length || 1)
  );
  
  let scoreColor = pc.gray;
  if (averageScore >= 90) scoreColor = pc.green;
  else if (averageScore >= 70) scoreColor = pc.yellow;
  else scoreColor = pc.red;

  const passedRules = results.filter(r => r.passed).length;
  const passPercentage = Math.round((passedRules / (results.length || 1)) * 100);

  console.log(pc.gray("━".repeat(62)));
  console.log(pc.bold(`  Overall Health Score:     ${scoreColor(averageScore + "%")}`));
  console.log(pc.bold(`  Rules Passing:            ${scoreColor(passPercentage + "%")}`));
  console.log(pc.gray("━".repeat(62) + "\n"));

  if (options.strict) checkStrict(results, options.strictThreshold, options.isChangedMode);
}

function checkStrict(results: RuleResult[], threshold = 80, isChangedMode = false) {
  const averageScore = Math.round(
    results.reduce((acc, r) => acc + (r.score ?? 0), 0) / (results.length || 1)
  );
  if (isChangedMode) {
    const hasNewCriticalOrError = results.some(r => r.violations.some(v => v.severity === "Critical" || v.severity === "Error"));
    if (hasNewCriticalOrError) {
      console.error(`\nStrict mode enabled: Changed files introduced new Critical or Error violations.`);
      process.exit(1);
    }
  } else {
    if (averageScore < threshold || results.some(r => r.violations.some(v => v.severity === "Critical"))) {
      console.error(`\nStrict mode enabled: Health score ${averageScore}% is below threshold ${threshold}% or critical violations found.`);
      process.exit(1);
    }
  }
}

function generateSarif(results: RuleResult[], cwd: string) {
  const sarif = {
    version: "2.1.0",
    $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
    runs: [
      {
        tool: {
          driver: {
            name: "Operator Doctor",
            informationUri: "https://operator.doctor",
            rules: results.map(r => ({
              id: r.id,
              name: r.name,
              shortDescription: { text: (r as any).description || `${r.category} Verification` }
            }))
          }
        },
        results: results.flatMap(r => r.violations.map(v => ({
          ruleId: r.id,
          level: v.severity === "Critical" ? "error" : v.severity === "Error" ? "error" : v.severity === "Warning" ? "warning" : "note",
          message: { text: v.message },
          locations: v.file ? [
            {
              physicalLocation: {
                artifactLocation: { uri: v.file },
                region: { startLine: v.line || 1 }
              }
            }
          ] : []
        })))
      }
    ]
  };
  const reportsDir = path.join(cwd, "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, "operator-doctor.sarif"), JSON.stringify(sarif, null, 2));
  console.log(pc.green(`✓ SARIF report generated at reports/operator-doctor.sarif`));
}

function generateHtml(results: RuleResult[], options: ReporterOptions, totalViolations: number, totalRuntime: number, violationsByCategory: Record<string, number>) {
  const reportsDir = path.join(options.cwd, "reports");
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  const averageScore = Math.round(
    results.reduce((acc, r) => acc + (r.score ?? 0), 0) / (results.length || 1)
  );
  
  const passedRules = results.filter(r => r.passed).length;
  const passPercentage = Math.round((passedRules / (results.length || 1)) * 100);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Operator Doctor Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 2rem; background: #fafafa; color: #333; }
    h1, h2, h3 { color: #111; }
    .header { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .stats { display: flex; gap: 2rem; }
    .stat { text-align: center; }
    .stat-val { font-size: 2rem; font-weight: bold; color: #0070f3; }
    .stat-label { font-size: 0.875rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
    .score-green { color: #10b981; }
    .score-yellow { color: #f59e0b; }
    .score-red { color: #ef4444; }
    .card { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
    .category-title { font-size: 1.25rem; border-bottom: 1px solid #eaeaea; padding-bottom: 0.5rem; margin-bottom: 1rem; }
    .rule-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #fafafa; align-items: center; }
    .rule-name { font-weight: 500; font-size: 1rem; }
    .rule-desc { font-size: 0.875rem; color: #666; margin-left: 1rem; }
    .rule-status { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.875rem; font-weight: bold; }
    .status-pass { background: #d1fae5; color: #065f46; }
    .status-fail { background: #fee2e2; color: #991b1b; }
    .violations { margin-top: 0.5rem; font-size: 0.875rem; background: #f9fafb; padding: 1rem; border-radius: 4px; display: none; }
    .violation-row { margin-bottom: 0.5rem; display: flex; gap: 1rem; }
    .severity { font-weight: bold; width: 80px; }
    .v-Critical { color: #991b1b; }
    .v-Error { color: #ef4444; }
    .v-Warning { color: #f59e0b; }
    .v-Info { color: #3b82f6; }
    .file { font-family: monospace; color: #0070f3; cursor: pointer; }
    .message { color: #333; }
    .toggle-btn { background: none; border: 1px solid #eaeaea; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
    .toggle-btn:hover { background: #f3f4f6; }
  </style>
  <script>
    function toggleViolations(id) {
      const el = document.getElementById(id);
      if (el.style.display === 'block') el.style.display = 'none';
      else el.style.display = 'block';
    }
  </script>
</head>
<body>
  <div class="header">
    <div>
      <h1>⚡ Operator Doctor</h1>
      <p style="color: #666;">Enterprise Verification System</p>
    </div>
    <div class="stats">
      <div class="stat">
        <div class="stat-val ${averageScore >= 90 ? 'score-green' : averageScore >= 70 ? 'score-yellow' : 'score-red'}">${averageScore}%</div>
        <div class="stat-label">Health Score</div>
      </div>
      <div class="stat">
        <div class="stat-val ${passPercentage >= 90 ? 'score-green' : passPercentage >= 70 ? 'score-yellow' : 'score-red'}">${passPercentage}%</div>
        <div class="stat-label">Rules Passed</div>
      </div>
      <div class="stat">
        <div class="stat-val" style="color: #6b7280;">${totalViolations}</div>
        <div class="stat-label">Violations</div>
      </div>
      <div class="stat">
        <div class="stat-val" style="color: #6b7280;">${options.scannedFilesCount}</div>
        <div class="stat-label">${options.isChangedMode ? 'Changed Files' : 'Files'}</div>
      </div>
      ${options.isChangedMode ? `
      <div class="stat">
        <div class="stat-val score-red">${options.newViolationsCount || 0}</div>
        <div class="stat-label">New Violations</div>
      </div>
      <div class="stat">
        <div class="stat-val score-green">${options.resolvedViolationsCount || 0}</div>
        <div class="stat-label">Resolved Violations</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
    <div class="card">
      <h3>Violations by Category</h3>
      <ul style="list-style: none; padding: 0;">
        ${Object.entries(violationsByCategory).map(([cat, count]) => `
          <li style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>${cat}</span>
            <span style="font-weight: bold; background: #eaeaea; padding: 0.1rem 0.5rem; border-radius: 999px;">${count}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="card">
      <h3>Run Details</h3>
      <table style="width: 100%; text-align: left; border-collapse: collapse;">
        <tr><th style="padding: 0.5rem 0; border-bottom: 1px solid #eaeaea;">Metric</th><th style="padding: 0.5rem 0; border-bottom: 1px solid #eaeaea;">Value</th></tr>
        <tr><td style="padding: 0.5rem 0;">Total Runtime</td><td style="padding: 0.5rem 0;">${totalRuntime}ms</td></tr>
        <tr><td style="padding: 0.5rem 0;">Rules Executed</td><td style="padding: 0.5rem 0;">${options.rulesExecutedCount}</td></tr>
        <tr><td style="padding: 0.5rem 0;">Mode</td><td style="padding: 0.5rem 0;">${options.details ? 'Detailed' : 'Summary'}</td></tr>
        <tr><td style="padding: 0.5rem 0;">Strict Mode</td><td style="padding: 0.5rem 0;">${options.strict ? 'Yes (' + options.strictThreshold + '%)' : 'No'}</td></tr>
      </table>
    </div>
  </div>

  <h2>Rule Results</h2>
  ${Object.entries(
    results.reduce((acc, result) => {
      if (!acc[result.category]) acc[result.category] = [];
      acc[result.category].push(result);
      return acc;
    }, {} as Record<string, RuleResult[]>)
  ).map(([category, categoryResults]) => `
    <div class="card">
      <div class="category-title">${category}</div>
      ${categoryResults.map((rule, idx) => `
        <div>
          <div class="rule-row">
            <div>
              <span class="rule-name">${rule.name}</span>
              <span class="rule-desc">${(rule as any).description || ''}</span>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              ${!rule.passed ? `<span style="font-size: 0.875rem; color: #666;">Score: ${rule.score}%</span>` : ''}
              <span class="rule-status ${rule.passed ? 'status-pass' : 'status-fail'}">
                ${rule.passed ? '✓ PASS' : '✕ FAIL (' + rule.violations.length + ')'}
              </span>
              ${rule.violations.length > 0 ? `<button class="toggle-btn" onclick="toggleViolations('v-${rule.id}-${idx}')">View Details</button>` : ''}
            </div>
          </div>
          ${rule.violations.length > 0 ? `
            <div id="v-${rule.id}-${idx}" class="violations">
              ${rule.violations.map(v => `
                <div class="violation-row">
                  <div class="severity v-${v.severity}">${v.severity}</div>
                  <div style="flex: 1;">
                    <div class="message">${v.message}</div>
                    ${v.file ? `<a class="file" title="Click to open file if IDE supports URL handlers" href="vscode://file/${v.file}:${v.line||1}">${v.file}:${v.line||1}</a>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `).join('')}
</body>
</html>
`;

  fs.writeFileSync(path.join(reportsDir, "operator-doctor.html"), html);
  console.log(pc.green(`✓ HTML report generated at reports/operator-doctor.html`));
}
