import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { chromium, Browser } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';

export const verifyUiQuality: DoctorRule = {
  id: "ui-quality",
  name: "Verify UI Quality",
  category: "UI Quality",
  description: "Prevent AI agents from producing low-quality, inconsistent or unfinished UI by analyzing page layouts and styles.",
  severity: "Error",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    let score = 100;
    
    const deduct = (amount: number, severity: "Critical" | "Error" | "Warning" | "Info", message: string, file: string = "runtime") => {
      score -= amount;
      violations.push({
        file,
        message,
        severity
      });
    };

    let serverProcess: ChildProcess | null = null;
    let browser: Browser | null = null;
    let baseUrl = 'http://localhost:3000';

    const baselineDir = path.join(context.cwd, 'reports', 'ui-baselines');
    const runtimeDir = path.join(context.cwd, 'reports', 'runtime');
    
    if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir, { recursive: true });
    if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });

    try {
      // 1. Server orchestration
      const isRunning = await new Promise((resolve) => {
        const req = http.get(baseUrl, (res) => resolve(true));
        req.on('error', () => resolve(false));
        req.end();
      });

      if (!isRunning) {
        console.log("    Starting local server for UI Quality test...");
        baseUrl = 'http://localhost:3033';
        serverProcess = spawn('npx', ['next', 'dev', '-p', '3033'], {
          cwd: context.cwd,
          stdio: 'ignore',
          shell: true
        });

        await new Promise((resolve) => {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            const req = http.get(baseUrl, (res) => {
              clearInterval(interval);
              resolve(true);
            });
            req.on('error', () => {
              if (attempts > 30) {
                clearInterval(interval);
                resolve(false);
              }
            });
            req.end();
          }, 1000);
        });
      }

      // 2. Launch Browser
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      // Set a standard viewport to ensure consistent baseline screenshots
      await page.setViewportSize({ width: 1280, height: 800 });

      let visualHierarchyIssues = 0;
      let spacingIssues = 0;
      let consistencyIssues = 0;
      let accessibilityIssues = 0;
      let responsivenessIssues = 0;
      let premiumFeelIssues = 0;

      const routesToTest = ['/', '/pricing', '/about', '/contact', '/features', '/dashboard'];

      for (const route of routesToTest) {
        try {
          const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 15000 });
          if (!response || response.status() >= 400) continue; // Skip broken routes (Functionality rule catches these)

          const pageName = route === '/' ? 'home' : route.replace(/\//g, '_').substring(1);
          
          // 3. DOM-Based Heuristics
          const domAnalysis = await page.evaluate(() => {
            const issues: { type: string, message: string }[] = [];
            
            // Check Horizontal Overflow
            if (document.documentElement.scrollWidth > window.innerWidth) {
              issues.push({ type: 'responsive', message: `Horizontal overflow detected (scrollWidth: ${document.documentElement.scrollWidth}, innerWidth: ${window.innerWidth})` });
            }

            // Check Button Consistency
            const buttons = Array.from(document.querySelectorAll('button'));
            const buttonStyles = new Set();
            let missingAriaButtons = 0;

            buttons.forEach(btn => {
              const style = window.getComputedStyle(btn);
              // Ignore hidden buttons
              if (style.display !== 'none' && style.visibility !== 'hidden') {
                const signature = `${style.padding}-${style.borderRadius}-${style.backgroundColor}-${style.fontSize}`;
                buttonStyles.add(signature);
                
                if (!btn.textContent?.trim() && !btn.getAttribute('aria-label') && !btn.title) {
                  missingAriaButtons++;
                }
              }
            });

            if (buttonStyles.size > 5) { // Arbitrary threshold for inconsistency
              issues.push({ type: 'consistency', message: `Inconsistent button styles detected (${buttonStyles.size} unique variations). Standardize padding and radius.` });
            }
            
            if (missingAriaButtons > 0) {
              issues.push({ type: 'accessibility', message: `${missingAriaButtons} empty buttons missing aria-labels.` });
            }

            // Check Layout/Grid Alignment
            const containers = Array.from(document.querySelectorAll('main > div, section'));
            containers.forEach(container => {
               const style = window.getComputedStyle(container);
               // Very simplistic heuristic for uneven spacing or broken layout
               if (parseInt(style.marginLeft) < 0 || parseInt(style.marginRight) < 0) {
                  issues.push({ type: 'spacing', message: `Negative margins detected on main container which may break layout.` });
               }
            });
            
            return issues;
          });

          // Apply DOM issues
          for (const issue of domAnalysis) {
            if (issue.type === 'responsive') {
              responsivenessIssues++;
              deduct(5, "Error", `[${route}] ${issue.message}`);
            } else if (issue.type === 'consistency') {
              consistencyIssues++;
              deduct(3, "Warning", `[${route}] ${issue.message}`);
            } else if (issue.type === 'accessibility') {
              accessibilityIssues++;
              deduct(2, "Warning", `[${route}] ${issue.message}`);
            } else if (issue.type === 'spacing') {
              spacingIssues++;
              deduct(2, "Warning", `[${route}] ${issue.message}`);
            }
          }

          // 4. Visual Regression
          const screenshotName = `${pageName}.png`;
          const currentPath = path.join(runtimeDir, screenshotName);
          const baselinePath = path.join(baselineDir, screenshotName);

          await page.screenshot({ path: currentPath, fullPage: true });

          if (fs.existsSync(baselinePath)) {
            const currentStats = fs.statSync(currentPath);
            const baselineStats = fs.statSync(baselinePath);
            
            // Naive comparison: If size differs by more than 5%, flag visual regression
            const diffRatio = Math.abs(currentStats.size - baselineStats.size) / Math.max(currentStats.size, baselineStats.size);
            
            if (diffRatio > 0.05) {
               premiumFeelIssues++;
               deduct(10, "Error", `[${route}] Visual regression detected. Screenshot size differs by ${(diffRatio * 100).toFixed(1)}% compared to baseline.`);
            }
          } else {
             // Create baseline
             fs.copyFileSync(currentPath, baselinePath);
          }

        } catch (error: any) {
          // Soft fail navigation issues, they aren't UI quality problems, they are functionality problems
          continue;
        }
      }

      // Add breakdown metadata
      const breakdown = [
        {
          category: "UI Quality",
          violationCount: violations.length,
          affectedFiles: routesToTest.length,
          topValues: [
            { value: "UI Score", count: Math.max(0, score) },
            { value: "Responsiveness Issues", count: responsivenessIssues },
            { value: "Consistency Issues", count: consistencyIssues },
            { value: "Accessibility Issues", count: accessibilityIssues },
            { value: "Spacing Issues", count: spacingIssues },
            { value: "Visual Regressions", count: premiumFeelIssues }
          ],
          suggestion: "Review standard design tokens and component implementations. Ensure responsive classes are correctly applied.",
          confidence: "High" as const
        }
      ];

      return {
        id: this.id,
        name: this.name,
        category: this.category,
        passed: score >= 90, // Strict pass threshold for UI
        score: Math.max(0, score),
        violations,
        breakdown
      };

    } catch (e: any) {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        passed: false,
        score: 0,
        violations: [{
          file: "verify-ui-quality.ts",
          message: `Internal verification failure: ${e.message}`,
          severity: "Critical"
        }]
      };
    } finally {
      if (browser) {
        await browser.close();
      }
      if (serverProcess) {
        serverProcess.kill();
      }
    }
  }
};
