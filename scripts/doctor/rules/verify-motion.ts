import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";
import fs from "fs";
import path from "path";

// Recursively find all CSS files in a directory
function findCssFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findCssFiles(filePath, fileList);
    } else if (filePath.endsWith('.css')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

export const verifyMotion: DoctorRule = {
  id: "motion",
  name: "Motion",
  description: "Verifies motion compliance and best practices.",
  severity: "Error",
  category: "UI & Components",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst, cssTokens, cwd } = context;

    const sourceFiles = projectAst.getSourceFiles();
    
    const validKeyframes = Array.from(cssTokens.keyframes);
    
    const validCssClasses = new Set<string>();
    const cssUsedKeyframes = new Set<string>();
    
    // Parse all CSS files to find custom classes and keyframe references
    const cssFiles = findCssFiles(path.join(cwd, "src"));
    for (const cssFile of cssFiles) {
      const content = fs.readFileSync(cssFile, "utf-8");
      
      // Find .animate-* classes
      const classMatches = content.match(/\.(animate-[a-zA-Z0-9_-]+)/g);
      if (classMatches) {
        classMatches.forEach(c => validCssClasses.add(c.substring(1))); // remove dot
      }
      
      // Find animation: name duration ...
      // e.g., animation: fade-up var(--duration)
      // or animation: ticker-scroll 32s linear
      const animMatches = content.match(/animation:\s*([a-zA-Z0-9_-]+)/g);
      if (animMatches) {
        animMatches.forEach(match => {
          const name = match.split(":")[1].trim();
          cssUsedKeyframes.add(name);
        });
      }
      
      // Find animation-name: name
      const animNameMatches = content.match(/animation-name:\s*([a-zA-Z0-9_-]+)/g);
      if (animNameMatches) {
        animNameMatches.forEach(match => {
          const name = match.split(":")[1].trim();
          cssUsedKeyframes.add(name);
        });
      }
    }
    
    const tsxUsedKeyframes = new Set<string>();
    const usedAnimations = new Set<string>();

    for (const sourceFile of sourceFiles) {
      const strings = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral),
      ];

      for (const strNode of strings) {
        const val = strNode.getLiteralText();
        const classNames = typeof val === 'string' ? val.split(" ") : String(val).split(" ");
        classNames.forEach(cls => {
          if (cls.startsWith("animate-")) {
            usedAnimations.add(cls);
          }
        });
      }
    }
    
    const tailwindcssAnimateUtilities = ["animate-in", "animate-out"];
    const standardTailwind = ["spin", "ping", "pulse", "bounce", "none"];

    for (const cls of usedAnimations) {
       // Arbitrary values like animate-[ping_2s...]
       if (cls.startsWith("animate-[") && cls.endsWith("]")) {
           const inner = cls.substring(9, cls.length - 1); // remove animate-[ and ]
           const keyframeCandidate = inner.split("_")[0]; // heuristic: usually first part before _
           if (validKeyframes.includes(keyframeCandidate) || standardTailwind.includes(keyframeCandidate)) {
               tsxUsedKeyframes.add(keyframeCandidate);
           }
           continue; 
       }

       // tailwindcss-animate utilities
       if (tailwindcssAnimateUtilities.includes(cls)) {
           continue;
       }

       const animationName = cls.replace("animate-", "");
       
       if (standardTailwind.includes(animationName)) {
           tsxUsedKeyframes.add(animationName);
           continue;
       }
       
       if (validCssClasses.has(cls)) {
           // It's a custom CSS class, which itself references keyframes (captured by cssUsedKeyframes)
           continue;
       }
       
       // If it's custom, check if we found a keyframe for it exactly
       if (!validKeyframes.includes(animationName)) {
           violations.push({
               message: `Animation class '${cls}' used, but neither a custom CSS class nor a keyframe '${animationName}' was found in CSS.`
           , severity: 'Error' });
       } else {
           tsxUsedKeyframes.add(animationName);
       }
    }

    const allUsedKeyframes = new Set([...Array.from(cssUsedKeyframes), ...Array.from(tsxUsedKeyframes)]);

    // Find unused keyframes
    for (const kf of validKeyframes) {
       if (!allUsedKeyframes.has(kf as string)) {
           violations.push({
               message: `Unused keyframe detected: '${kf}' is defined in CSS but never referenced in an animate- class or animation property.`
           , severity: 'Error' });
       }
    }

    const passed = violations.length === 0;
    const score = passed ? 100 : Math.max(0, 100 - violations.length * 5);

    return {
      id: this.id,
      name: this.name,
      category: this.category,
      passed,
      score,
      violations,
    };
  }
};
