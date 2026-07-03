import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { StringLiteral, NoSubstitutionTemplateLiteral, JsxAttribute, JsxExpression, Node, SyntaxKind } from "ts-morph";

export const verifyDesignSystem: DoctorRule = {
  id: "design-system",
  name: "Design System Tokens",
  description: "Verifies design-system compliance and best practices.",
  severity: "Error",
  category: "Design System & Tokens",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst, cssTokens } = context;

    const sourceFiles = projectAst.getSourceFiles();
    
    // Valid CSS variables extracted via PostCSS
    const validVars = cssTokens.cssVariables;

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();

      // Find all string literals and template literals that might contain class names or styles
      const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
      const noSubTemplates = sourceFile.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral);
      
      const allStrings = [...stringLiterals, ...noSubTemplates];

      for (const strNode of allStrings) {
        const text = strNode.getLiteralText();
        
        // Check for CSS variable usage: var(--name)
        const varMatches = text.matchAll(/var\((--[a-zA-Z0-9-]+)\)/g);
        for (const match of varMatches) {
          const varName = match[1];
          if (!validVars.has(varName) && !varName.startsWith("--radix-")) {
            violations.push({
              file: filePath,
              line: strNode.getStartLineNumber(),
              message: `Unregistered CSS variable used: ${varName}`
            , severity: 'Error' });
          }
        }

        // We can also extract potential tailwind classes and check against utilities
        // This is a basic check. A full tailwind parser is complex.
        const classes = text.split(/\s+/);
        for (const cls of classes) {
          // Check if it's a custom utility defined in globals.css (e.g. radius-sm)
          if (cls.startsWith("radius-") && !cssTokens.utilities.has(cls) && !cls.includes("[")) {
            // It might be a native tailwind class, but we specifically track custom utilities in @utility
            if (!cssTokens.utilities.has(cls) && cls.match(/^radius-(sm|md|lg|xl|2xl|full|none)$/)) {
                 // Ignore standard ones if we didn't extract them, but we did extract them in css-parser
                 if (!cssTokens.utilities.has(cls)) {
                    violations.push({
                        file: filePath,
                        line: strNode.getStartLineNumber(),
                        message: `Unregistered utility class used: ${cls}`
                    , severity: 'Error' });
                 }
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
