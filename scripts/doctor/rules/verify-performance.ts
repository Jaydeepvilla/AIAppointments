import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";

export const verifyPerformance: DoctorRule = {
  id: "performance",
  name: "Performance",
  description: "Verifies performance compliance and best practices.",
  severity: "Error",
  category: "Architecture",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst } = context;

    const sourceFiles = projectAst.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();

      const jsxElements = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
      ];

      for (const el of jsxElements) {
        const tagName = el.getTagNameNode().getText();

        // 1. Usage of <img> instead of next/image
        if (tagName === "img") {
            violations.push({
                file: filePath,
                line: el.getStartLineNumber(),
                message: `Performance Risk: Raw <img> tag detected. Suggestion: Use next/image for automatic optimization.`
            , severity: 'Error' });
        }
      }

      // 2. Heavy components not using next/dynamic
      // Heuristic: If we import a component with "Chart" or "Map" in its name from a local file, it should probably be dynamic.
      const imports = sourceFile.getImportDeclarations();
      for (const imp of imports) {
        const moduleSpecifier = imp.getModuleSpecifierValue();
        const defaultImport = imp.getDefaultImport()?.getText();
        const namedImports = imp.getNamedImports().map(n => n.getName());
        
        const allImportedNames = [defaultImport, ...namedImports].filter(Boolean) as string[];

        for (const name of allImportedNames) {
           if ((name.includes("Chart") || name.includes("Map")) && moduleSpecifier.startsWith(".")) {
               // Check if next/dynamic is used in the file
               const hasDynamic = sourceFile.getImportDeclarations().some(i => i.getModuleSpecifierValue() === "next/dynamic");
               
               // We just warn if we don't see next/dynamic in the file where a Chart is imported
               if (!hasDynamic) {
                   violations.push({
                       file: filePath,
                       line: imp.getStartLineNumber(),
                       message: `Performance Risk: Heavy component '${name}' imported statically. Suggestion: Use 'next/dynamic' for code splitting.`
                   , severity: 'Error' });
               }
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
