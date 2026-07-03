import { test, expect } from "@playwright/test";

test.describe("Nexx Services Page Verification", () => {
  const pages = [
    { name: "Homepage", path: "/" },
    { name: "Pricing", path: "/pricing" },
    { name: "Features", path: "/features" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Settings", path: "/settings" },
    { name: "Agency", path: "/agency" },
  ];

  for (const page of pages) {
    test(`Verify ${page.name} loads and does not have major layout issues`, async ({ page: browserPage }) => {
      const url = `http://localhost:3000${page.path}`;
      console.log(`Navigating to ${url}...`);
      
      const response = await browserPage.goto(url, { waitUntil: "networkidle" });
      
      expect(response).not.toBeNull();
      const status = response!.status();
      console.log(`${page.name} loaded with status code: ${status}`);
      expect(status).toBeLessThan(400);
      
      const screenshotPath = `C:/Users/Jaydeep Chandegara/.gemini/antigravity-ide/brain/29abbc21-ec47-4df2-b255-caded3e3fa53/${page.name.toLowerCase()}_page.png`;
      await browserPage.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Saved screenshot for ${page.name} to ${screenshotPath}`);
    });
  }
});
