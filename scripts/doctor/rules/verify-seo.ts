import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";

export const verifySeo: DoctorRule = {
  id: "seo",
  name: "SEO",
  description: "Verifies seo compliance and best practices.",
  severity: "Error",
  category: "Architecture",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst } = context;

    const sourceFiles = projectAst.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();

      if (filePath.endsWith("page.tsx") || filePath.endsWith("page.ts")) {
         const normalizedPath = filePath.replace(/\\/g, "/");
         // Exclude app/api routes
         if (normalizedPath.includes("/app/api/")) continue;
         
         const isDashboard = normalizedPath.includes("/(dashboard)/");
         const isInternalUtility = 
            normalizedPath.includes("/widget-frame/") ||
            normalizedPath.includes("/(onboarding)/") ||
            normalizedPath.includes("/(auth)/") ||
            normalizedPath.includes("/embedded/");
            
         // Internal utilities typically do not need metadata for SEO
         if (isInternalUtility) continue;
         
         const exportedDeclarations = sourceFile.getExportedDeclarations();
         
         const hasMetadata = exportedDeclarations.has("metadata");
         const hasGenerateMetadata = exportedDeclarations.has("generateMetadata");
         
         if (!hasMetadata && !hasGenerateMetadata) {
             let inheritsMetadata = false;
             
             if (isDashboard) {
                 const pathModule = require("path");
                 let currentDir = pathModule.dirname(filePath).replace(/\\/g, "/");
                 const appDir = pathModule.join(context.cwd, "src", "app").replace(/\\/g, "/");
                 
                 while (currentDir.toLowerCase().startsWith(appDir.toLowerCase())) {
                     const layoutPath = pathModule.join(currentDir, "layout.tsx").replace(/\\/g, "/");
                     const layoutFileAst = projectAst.getSourceFile(layoutPath);
                     if (layoutFileAst) {
                         const layoutExports = layoutFileAst.getExportedDeclarations();
                         if (layoutExports.has("metadata") || layoutExports.has("generateMetadata")) {
                             inheritsMetadata = true;
                             break;
                         }
                     }
                     
                     if (currentDir.toLowerCase() === appDir.toLowerCase()) break;
                     currentDir = pathModule.dirname(currentDir).replace(/\\/g, "/");
                 }
             } else {
                 // For non-dashboard pages, allow metadata to be provided by a layout.tsx in the exact same directory
                 const pathModule = require("path");
                 const localLayoutPath = pathModule.join(pathModule.dirname(filePath), "layout.tsx").replace(/\\/g, "/");
                 const localLayoutAst = projectAst.getSourceFile(localLayoutPath);
                 if (localLayoutAst) {
                     const localExports = localLayoutAst.getExportedDeclarations();
                     if (localExports.has("metadata") || localExports.has("generateMetadata")) {
                         inheritsMetadata = true;
                     }
                 }
             }

             if (inheritsMetadata) {
                 continue; 
             }

             violations.push({
                 file: filePath,
                 message: `SEO Risk: page.tsx does not export 'metadata' or 'generateMetadata'.`
             , severity: 'Error' });
         }
      }

      // Check for manual <title> or <meta> tags outside of next/head
      const jsxElements = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
      ];

      for (const el of jsxElements) {
         const tagName = el.getTagNameNode().getText();
         if (tagName === "title" || tagName === "meta") {
             // In App router, metadata should be handled via the metadata export, not inline tags (except very rarely)
             // We can just warn about manual title tags
             violations.push({
                 file: filePath,
                 line: el.getStartLineNumber(),
                 message: `SEO Risk: Manual <${tagName}> tag detected. Suggestion: Use Next.js Metadata API instead.`
             , severity: 'Error' });
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
