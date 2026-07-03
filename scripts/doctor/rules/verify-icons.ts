import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";

export const verifyIcons: DoctorRule = {
  id: "icons",
  name: "Icons",
  description: "Verifies icons compliance and best practices.",
  severity: "Error",
  category: "UI & Components",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst } = context;

    const sourceFiles = projectAst.getSourceFiles();

    // Standardize on lucide-react
    const allowedLibrary = "lucide-react";
    const bannedLibraries = ["@heroicons/react", "react-icons", "phosphor-react", "@radix-ui/react-icons"];

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();
      
      // 1. Detect mixed icon libraries
      const imports = sourceFile.getImportDeclarations();
      for (const imp of imports) {
        const moduleSpecifier = imp.getModuleSpecifierValue();
        
        for (const banned of bannedLibraries) {
          if (moduleSpecifier.startsWith(banned)) {
            violations.push({
              file: filePath,
              line: imp.getStartLineNumber(),
              message: `Banned icon library detected: '${moduleSpecifier}'. Suggestion: Standardize on '${allowedLibrary}'.`
            , severity: 'Error' });
          }
        }
      }

      // 2. Detect bad practices in Icon usage (hardcoded color="" prop instead of className="text-...")
      // In Lucide, passing `color="#123"` breaks theme switching.
      const jsxElements = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
      ];

      for (const el of jsxElements) {
         // It's hard to know exactly if a component is an icon just by its name,
         // but usually they end with 'Icon' or are imported from lucide.
         // Let's check for 'color' props on elements that are PascalCase and end with 'Icon' 
         // (or just commonly known lucide icons, but there are hundreds).
         const tagName = el.getTagNameNode().getText();
         if (tagName.endsWith("Icon") || /^[A-Z]/.test(tagName)) {
             const colorAttr = el.getAttribute("color");
             if (colorAttr) {
                 // Check if it's imported from lucide-react (rough heuristic: any component from lucide)
                 // A true check would map the symbol back to the import, but for speed we just warn on `color` prop for Icon components.
                 if (tagName.endsWith("Icon")) {
                     violations.push({
                        file: filePath,
                        line: el.getStartLineNumber(),
                        message: `Hardcoded 'color' prop on <${tagName}>. Suggestion: Use className="text-[color]" instead for theme support.`
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
