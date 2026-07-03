import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";
import path from "path";
import fs from "fs";

export const verifyComponents: DoctorRule = {
  id: "components",
  name: "Components",
  description: "Verifies components compliance and best practices.",
  severity: "Error",
  category: "UI & Components",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst, cwd } = context;

    const sourceFiles = projectAst.getSourceFiles();

    // 1. Identify raw HTML tags being used instead of available shared components
    // Map standard HTML tags to expected Shared Components
    const nativeToSharedMap: Record<string, string> = {
      button: "Button",
      input: "Input",
      textarea: "Textarea",
      img: "Image",
    };

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();
      
      // Skip checking for HTML tags inside the UI library itself
      if (filePath.includes("components/ui") || filePath.includes("components/shared")) {
        continue;
      }

      const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
      const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
      
      const allElements = [...jsxElements, ...jsxSelfClosingElements];

      for (const element of allElements) {
        const tagName = element.getTagNameNode().getText();
        
        if (nativeToSharedMap[tagName]) {
          const expectedComponentFile = path.join(cwd, "src", "components", "shared", `${nativeToSharedMap[tagName].toLowerCase()}.tsx`);
          if (fs.existsSync(expectedComponentFile)) {
            violations.push({
              file: filePath,
              line: element.getStartLineNumber(),
              message: `Raw HTML <${tagName}> used. Suggestion: Use shared <${nativeToSharedMap[tagName]}> component instead.`,
            severity: 'Error' });
          }
        }
      }
    }

    // 2. Detect Duplicate Components
    const componentsDir = path.join(cwd, "src", "components");
    const uiDir = path.join(componentsDir, "ui");
    const sharedDir = path.join(componentsDir, "shared");

    if (fs.existsSync(uiDir) && fs.existsSync(sharedDir)) {
      const uiFiles = fs.readdirSync(uiDir).map(f => f.replace(".tsx", "").replace(".ts", ""));
      const sharedFiles = fs.readdirSync(sharedDir).map(f => f.replace(".tsx", "").replace(".ts", ""));

      const duplicates = uiFiles.filter(f => sharedFiles.includes(f));
      
      for (const dup of duplicates) {
        violations.push({
          message: `Duplicate component detected: '${dup}' exists in both ui/ and shared/ directories. Suggestion: Consolidate.`,
        severity: 'Error' });
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
