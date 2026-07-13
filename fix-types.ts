import fs from "fs";
import path from "path";

function fixFile(filePath: string) {
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Replace reason -> impactReason
  content = content.replace(/reason:\s*(.*?),/g, 'impactReason: $1,');
  
  // Replace confidence -> confidence + confidenceReason
  content = content.replace(/confidence:\s*(\d+),/g, 'confidence: $1,\n      confidenceReason: "Data check",');
  
  // Replace primaryCta: { text: X, href: Y }
  content = content.replace(/primaryCta:\s*{\s*text:\s*([^,]+),\s*href:\s*([^ }]+)\s*}/g, 'primaryCtaText: $1,\n      primaryCtaHref: $2');

  fs.writeFileSync(filePath, content);
}

const files = [
  "src/lib/gap-analysis-engine/calculators/services.ts",
  "src/lib/gap-analysis-engine/calculators/documents.ts",
  "src/lib/gap-analysis-engine/calculators/staff.ts",
  "src/lib/gap-analysis-engine/calculators/integrations.ts",
  "src/lib/industry-benchmark-engine/calculators/compare-features.ts",
  "src/lib/industry-benchmark-engine/calculators/recommended-documents.ts",
  "src/lib/industry-benchmark-engine/calculators/recommended-automations.ts"
];

files.forEach(f => fixFile(path.join(process.cwd(), f)));
