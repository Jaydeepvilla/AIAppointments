/**
 * generate-secrets.ts
 * Generates secure random strings for IMPERSONATION_SECRET and CRON_SECRET,
 * and appends them directly to .env.
 */
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

function generateSecrets() {
  const envPath = path.join(__dirname, "../.env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found.");
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, "utf-8");

  const impersonationSecret = crypto.randomBytes(32).toString("hex");
  const cronSecret = crypto.randomBytes(32).toString("hex");

  let modified = false;

  if (!envContent.includes("IMPERSONATION_SECRET")) {
    envContent += `\n# Agency & Billing Secrets\nIMPERSONATION_SECRET="${impersonationSecret}"\n`;
    modified = true;
    console.log("✅ Generated IMPERSONATION_SECRET");
  }

  if (!envContent.includes("CRON_SECRET")) {
    envContent += `CRON_SECRET="${cronSecret}"\n`;
    modified = true;
    console.log("✅ Generated CRON_SECRET");
  }

  if (modified) {
    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log("📝 Appended secrets to .env");
  } else {
    console.log("ℹ️ Impersonation and Cron secrets are already configured in .env");
  }
}

generateSecrets();
