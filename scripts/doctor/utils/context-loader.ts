import { DoctorContext, DoctorConfig } from "../types";
import { loadAstProject } from "./ast-parser";
import { loadCssTokens } from "./css-parser";
import path from "path";
import fs from "fs";

import { execSync } from "child_process";

/**
 * Loads the full context (AST + CSS + Config) needed by the rules.
 */
export async function loadContext(cwd: string, isFixMode = false, changedOnly = false): Promise<DoctorContext> {
  // Load Config
  let config: DoctorConfig = { plugins: [], disabledRules: [], strict: false, strictThreshold: 80, ignorePaths: [] };
  const configPath = path.join(cwd, "operator-doctor.config.ts");
  
  if (fs.existsSync(configPath)) {
    try {
      // In a real TS environment (like running via tsx), we can just import it dynamically.
      const configModule = await import(`file://${configPath}`);
      if (configModule.default) {
        config = { ...config, ...configModule.default };
      }
    } catch (e) {
      console.warn("Failed to load operator-doctor.config.ts, using defaults.");
    }
  }

  let changedFiles: string[] | undefined = undefined;
  if (changedOnly) {
    try {
      const validExtensions = [".ts", ".tsx", ".js", ".jsx", ".css", ".module.css"];
      const ignoreDirs = ["node_modules", ".next", "dist", "coverage", "public", "generated", "build", "storybook-static"];
      
      let allChanged: string[] = [];
      try {
        const gitDiff = execSync("git diff --name-only HEAD", { cwd, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
        allChanged = gitDiff.split('\n');
      } catch (e) {
        try {
          const gitStatus = execSync("git status --porcelain", { cwd, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
          allChanged = gitStatus.split('\n').map(line => line.substring(3)); // Remove the first 3 chars (e.g. " M ")
        } catch (e2) {
           console.warn("Failed to get git diff for --changed flag. Falling back to full scan.");
        }
      }
      
      const untracked = execSync("git ls-files --others --exclude-standard", { cwd, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }).split('\n');
      
      const combined = [...allChanged, ...untracked]
        .map(f => f?.trim())
        .filter(f => f && f.length > 0)
        .filter(f => validExtensions.some(ext => f.endsWith(ext)))
        .filter(f => !ignoreDirs.some(dir => f.includes(`/${dir}/`) || f.startsWith(`${dir}/`)))
        .map(f => path.resolve(cwd, f).replace(/\\/g, '/'));
        
      // Ensure unique absolute paths with forward slashes
      changedFiles = [...new Set(combined)];
      if (changedFiles.length === 0) {
        console.log("No changed files found by Git.");
        // If they explicitly requested --changed but no files changed, we still return empty array so it doesn't scan full project.
      }
    } catch (e) {
      console.warn("Git command failed. Falling back to full scan.");
    }
  }

  const [projectAst, cssTokens] = await Promise.all([
    loadAstProject(cwd, config, changedFiles),
    loadCssTokens(cwd, changedFiles),
  ]);

  return {
    cwd,
    projectAst,
    cssTokens,
    config,
    isFixMode,
    changedFiles
  };
}
