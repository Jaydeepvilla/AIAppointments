import { DoctorContext, DoctorRule, RuleResult, Violation } from "../types";
import { SyntaxKind } from "ts-morph";

export const verifyAccessibility: DoctorRule = {
  id: "accessibility",
  name: "Accessibility",
  description: "Verifies accessibility compliance and best practices.",
  severity: "Error",
  category: "Quality & Compliance",
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

        // 1. Missing alt on Image / img
        if (tagName === "Image" || tagName === "img") {
            const altAttr = el.getAttribute("alt");
            if (!altAttr) {
                violations.push({
                    file: filePath,
                    line: el.getStartLineNumber(),
                    message: `Missing 'alt' attribute on <${tagName}>. Suggestion: Provide a descriptive alt text or alt="" for decorative images.`
                , severity: 'Error' });
            }
        }

        // 2. onClick on non-interactive elements without tabIndex
        const nonInteractive = ["div", "span", "p", "section"];
        if (nonInteractive.includes(tagName)) {
            const onClickAttr = el.getAttribute("onClick");
            const tabIndexAttr = el.getAttribute("tabIndex");
            const onKeyDownAttr = el.getAttribute("onKeyDown");
            
            if (onClickAttr && (!tabIndexAttr || !onKeyDownAttr)) {
                violations.push({
                    file: filePath,
                    line: el.getStartLineNumber(),
                    message: `Accessibility Risk: onClick on <${tagName}> without keyboard support. Suggestion: Use a <button> or add tabIndex={0} and onKeyDown.`
                , severity: 'Error' });
            }
        }

        // 3. Positive tabIndex
        const tabIndexAttr = el.getAttribute("tabIndex");
        if (tabIndexAttr) {
            const initializer = tabIndexAttr.asKind(SyntaxKind.JsxAttribute)?.getInitializer();
            if (initializer) {
                const text = initializer.getText();
                // e.g. tabIndex={1}, tabIndex="1"
                if (text.includes("1") || text.includes("2") || text.includes("3")) {
                    // this is a bit crude but usually flags positive tab indexes
                    if (!text.includes("-1") && !text.includes("0")) {
                        violations.push({
                            file: filePath,
                            line: el.getStartLineNumber(),
                            message: `Accessibility Risk: Positive tabIndex detected. Suggestion: Use tabIndex={0} or tabIndex={-1} to avoid messing up the natural tab order.`
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
