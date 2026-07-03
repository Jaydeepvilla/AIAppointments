import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";
import glob from "fast-glob";
import path from "path";
import fs from "fs";

export const verifyRouting: DoctorRule = {
  id: "routing",
  name: "Routing",
  description: "Verifies routing compliance and best practices.",
  severity: "Error",
  category: "Architecture",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst, cwd } = context;

    const sourceFiles = projectAst.getSourceFiles();

    // 1. Detect missing page.tsx in route directories
    const appDir = path.join(cwd, "src", "app");
    if (fs.existsSync(appDir)) {
      const directories = await glob(["src/app/**/"], { cwd, onlyDirectories: true, absolute: true });
      
      for (const dir of directories) {
        // We only flag folders that don't have ANY special next.js files (page, layout, route, default)
        // Some folders are just organizational (like (dashboard)), but they usually don't matter unless they are leaf routes.
        // Actually, checking if a folder has page.tsx is too aggressive since Next.js allows layout-only or api routes.
        // Let's refine: if a folder has no page.tsx, layout.tsx, route.ts, default.tsx, loading.tsx, error.tsx, it's a dead folder.
        
        const filesInDir = fs.readdirSync(dir);
        const hasNextFile = filesInDir.some(f => 
          /^(page|layout|route|default|loading|error|not-found)\.tsx?$/.test(f)
        );

        if (!hasNextFile && filesInDir.length > 0) {
           // It might be a component folder inside app, which is a bad practice.
           violations.push({
             file: dir,
             message: `Directory in app router contains no Next.js route files. Suggestion: Move non-route files outside of src/app/.`,
           severity: 'Error' });
        }
      }
    }

    // 2. Detect broken <Link href="...">
    // For a robust system, we should collect all valid route paths first.
    // For this implementation, we will look for hardcoded link formats that seem broken or empty.
    
    for (const sourceFile of sourceFiles) {
      const jsxElements = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
      ];

      for (const el of jsxElements) {
        if (el.getTagNameNode().getText() === "Link") {
          const hrefAttr = el.getAttribute("href");
          if (hrefAttr) {
            // Check if it's a string literal
            const initializer = hrefAttr.asKind(SyntaxKind.JsxAttribute)?.getInitializer();
            if (initializer && initializer.isKind(SyntaxKind.StringLiteral)) {
              const href = initializer.getLiteralText();
              if (href === "" || href === "#") {
                violations.push({
                  file: sourceFile.getFilePath(),
                  line: el.getStartLineNumber(),
                  message: `Empty or dead link detected: href="${href}".`,
                severity: 'Error' });
              }
            }
          } else {
             violations.push({
                file: sourceFile.getFilePath(),
                line: el.getStartLineNumber(),
                message: `<Link> component missing 'href' attribute.`,
              severity: 'Error' });
          }
        }
      }

      // 3. Detect broken imports
      const imports = sourceFile.getImportDeclarations();
      for (const imp of imports) {
         const moduleSpecifier = imp.getModuleSpecifierValue();
         // Basic check: if it's a relative import that doesn't exist
         if (moduleSpecifier.startsWith(".")) {
             const resolvedPath = sourceFile.getDirectory().getPath() + "/" + moduleSpecifier;
             // ts-morph usually handles module resolution, we can check if it resolved
             const sourceFileRef = imp.getModuleSpecifierSourceFile();
             if (!sourceFileRef && !moduleSpecifier.endsWith(".css")) {
                // If it can't resolve it and it's not css (which might not be in AST)
                violations.push({
                  file: sourceFile.getFilePath(),
                  line: imp.getStartLineNumber(),
                  message: `Potentially broken import: '${moduleSpecifier}' could not be resolved in the AST.`,
                severity: 'Error' });
             }
         }
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
