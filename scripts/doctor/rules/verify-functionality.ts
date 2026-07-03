import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { chromium, Browser, Page } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import http from 'http';
import path from 'path';
import fs from 'fs';

export const verifyFunctionality: DoctorRule = {
  id: "functionality",
  name: "Verify Functionality",
  category: "Runtime Verification",
  description: "Automatically detect broken functionality, user flows, runtime errors and regressions.",
  severity: "Critical",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    let score = 100;
    
    // Add deduction helper
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

    try {
      // 1. Check if server is running on 3000
      const isRunning = await new Promise((resolve) => {
        const req = http.get(baseUrl, (res) => {
          resolve(true);
        });
        req.on('error', () => resolve(false));
        req.end();
      });

      if (!isRunning) {
        console.log("    Starting local server for functionality test...");
        // Start next dev on port 3033
        baseUrl = 'http://localhost:3033';
        serverProcess = spawn('npx', ['next', 'dev', '-p', '3033'], {
          cwd: context.cwd,
          stdio: 'ignore', // Ignore output to keep console clean
          shell: true
        });

        // Wait for server to be ready
        await new Promise((resolve) => {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            const req = http.get(baseUrl, (res) => {
              clearInterval(interval);
              resolve(true);
            });
            req.on('error', () => {
              if (attempts > 30) { // 30 seconds max
                clearInterval(interval);
                resolve(false);
              }
            });
            req.end();
          }, 1000);
        });
      }

      // 2. Launch Chromium
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      // Track stats
      let pagesTested = 0;
      let consoleErrors = 0;
      let networkErrors = 0;
      let runtimeErrors = 0;
      let componentsTested = 0;
      let brokenForms = 0;
      let brokenButtons = 0;
      let brokenLinks = 0;
      let brokenPages = 0;

      // Global error trapping
      page.on('console', async (msg) => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error' || text.toLowerCase().includes('uncaught') || text.toLowerCase().includes('typeerror') || text.toLowerCase().includes('referenceerror') || text.toLowerCase().includes('hydration')) {
          consoleErrors++;
          const penalty = text.toLowerCase().includes('hydration') ? 10 : 5;
          deduct(penalty, "Error", `Console Error: ${text}`);
        }
      });

      page.on('pageerror', (exception) => {
        runtimeErrors++;
        deduct(20, "Critical", `Runtime Exception: ${exception.message}`);
      });

      page.on('response', (response) => {
        const status = response.status();
        if (status === 404 || status === 500 || status === 401 || status === 403) {
          if (response.request().resourceType() === 'document') return; // Handled separately
          networkErrors++;
          deduct(5, "Warning", `Network Error: ${status} on ${response.url()}`);
        }
      });

      const takeScreenshot = async (name: string) => {
        const screenshotPath = path.join(context.cwd, 'reports', 'runtime', `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`);
        try {
          await page.screenshot({ path: screenshotPath });
          return screenshotPath;
        } catch (e) {
          return null;
        }
      };

      // 3. Crawler setup
      const routesToTest = ['/', '/pricing', '/about', '/contact', '/features'];
      
      for (const route of routesToTest) {
        try {
          pagesTested++;
          const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
          
          if (!response) {
            brokenPages++;
            deduct(5, "Error", `Page failed to load completely: ${route}`);
            await takeScreenshot(`failed_load_${route}`);
            continue;
          }

          if (response.status() === 404) {
            brokenPages++;
            deduct(5, "Error", `404 Not Found: ${route}`);
            await takeScreenshot(`404_${route}`);
            continue;
          }

          if (response.status() >= 500) {
            brokenPages++;
            deduct(20, "Critical", `500 Server Error: ${route}`);
            await takeScreenshot(`500_${route}`);
            continue;
          }

          // Test basic interaction if it's the home page
          if (route === '/') {
            const buttons = await page.locator('button').all();
            for (let i = 0; i < Math.min(buttons.length, 3); i++) {
              componentsTested++;
              try {
                // Ensure button is visible and enabled
                if (await buttons[i].isVisible() && await buttons[i].isEnabled()) {
                  await buttons[i].hover({ timeout: 1000 });
                }
              } catch (e) {
                brokenButtons++;
                deduct(2, "Warning", `Button interaction failed on ${route}`);
              }
            }

            const links = await page.locator('a').all();
            for (let i = 0; i < Math.min(links.length, 3); i++) {
              componentsTested++;
              try {
                if (await links[i].isVisible()) {
                   await links[i].hover({ timeout: 1000 });
                }
              } catch (e) {
                brokenLinks++;
                deduct(2, "Warning", `Link interaction failed on ${route}`);
              }
            }
          }

          // Test forms on contact page
          if (route === '/contact') {
             const forms = await page.locator('form').all();
             for (let i = 0; i < Math.min(forms.length, 1); i++) {
                 componentsTested++;
                 try {
                     if (await forms[i].isVisible()) {
                        await forms[i].hover({ timeout: 1000 });
                        // we won't submit to avoid polluting DB
                     }
                 } catch (e) {
                     brokenForms++;
                     deduct(2, "Warning", `Form interaction failed on ${route}`);
                 }
             }
          }

        } catch (error: any) {
          brokenPages++;
          deduct(20, "Critical", `Crash during navigation to ${route}: ${error.message}`);
          await takeScreenshot(`crash_${route}`);
        }
      }

      // 4. Test Auth & Dashboard flow
      try {
        pagesTested++;
        const dashboardResponse = await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
        
        if (dashboardResponse && dashboardResponse.status() === 404) {
          // Fallback to /agency if /dashboard doesn't exist
          const agencyResponse = await page.goto(`${baseUrl}/agency`, { waitUntil: 'domcontentloaded', timeout: 10000 });
          if (agencyResponse && agencyResponse.status() >= 400 && agencyResponse.status() !== 401) {
             brokenPages++;
             deduct(5, "Error", `Protected route /agency returned error ${agencyResponse.status()}`);
             await takeScreenshot('protected_route_error');
          }
        }
      } catch (e: any) {
        brokenPages++;
        deduct(20, "Critical", `Crash during protected route navigation: ${e.message}`);
      }

      const breakdown = [
        {
          category: "Functionality",
          violationCount: violations.length,
          affectedFiles: pagesTested,
          topValues: [
            { value: "Pages Tested", count: pagesTested },
            { value: "Components Tested", count: componentsTested },
            { value: "Broken Pages", count: brokenPages },
            { value: "Broken Buttons", count: brokenButtons },
            { value: "Broken Links", count: brokenLinks },
            { value: "Broken Forms", count: brokenForms },
            { value: "Console Errors", count: consoleErrors },
            { value: "Network Errors", count: networkErrors },
            { value: "Runtime Errors", count: runtimeErrors }
          ],
          suggestion: "Fix runtime errors and broken UI components highlighted in the screenshots.",
          confidence: "High" as const
        }
      ];

      return {
        id: this.id,
        name: this.name,
        category: this.category,
        passed: score >= 100,
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
          file: "verify-functionality.ts",
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
