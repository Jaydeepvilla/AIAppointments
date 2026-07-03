import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";

export const verifyResponsive: DoctorRule = {
  id: "responsive",
  name: "Responsive Risks",
  description: "Verifies responsive compliance and best practices.",
  severity: "Error",
  category: "Quality & Compliance",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst } = context;

    const sourceFiles = projectAst.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      const strings = [
        ...sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral),
        ...sourceFile.getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral),
      ];

      for (const strNode of strings) {
        const text = strNode.getLiteralText();
        const classes = text.split(/\s+/);
        
        const hasFixedLargeWidth = classes.some(c => /^w-\[(4|5|6|7|8|9)\d\dpx\]$/.test(c) || /^w-\[([2-9]|\d{2})rem\]$/.test(c));
        const hasBreakpoint = classes.some(c => /^(sm|md|lg|xl|2xl):/.test(c));
        
        // 1. Detect fixed widths without breakpoints
        if (hasFixedLargeWidth && !hasBreakpoint) {
            violations.push({
                file: sourceFile.getFilePath(),
                line: strNode.getStartLineNumber(),
                message: `Large fixed width detected without a responsive breakpoint. Suggestion: Use 'w-full max-w-...' or add 'md:w-[...]' to prevent mobile overflow.`
            , severity: 'Error' });
        }

        for (const cls of classes) {
            // 2. Detect w-screen / h-screen which can cause scrollbar issues
            if (cls === "w-screen") {
                violations.push({
                    file: sourceFile.getFilePath(),
                    line: strNode.getStartLineNumber(),
                    message: `Risk: 'w-screen' can cause horizontal scrollbars on Windows due to the scrollbar width. Suggestion: Use 'w-full'.`
                , severity: 'Error' });
            }
            if (cls === "h-screen") {
                violations.push({
                    file: sourceFile.getFilePath(),
                    line: strNode.getStartLineNumber(),
                    message: `Risk: 'h-screen' does not account for mobile browser UI (address bar). Suggestion: Use 'h-dvh' or 'min-h-screen'.`
                , severity: 'Error' });
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
