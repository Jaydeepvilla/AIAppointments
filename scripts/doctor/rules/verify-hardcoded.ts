import { DoctorContext, DoctorRule, RuleResult, Violation, RuleBreakdown, RuleSeverity } from "../types";
import { SyntaxKind } from "ts-morph";

const spacingPrefixes = new Set(['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml', 'gap', 'gap-x', 'gap-y', 'space-x', 'space-y', 'inset', 'inset-x', 'inset-y', 'top', 'right', 'bottom', 'left']);
const allowedStructural = new Set(['auto', 'px', 'full', '0', '1/2', '1/3', '2/3', '1/4', '2/4', '3/4', '1/5', '2/5', '3/5', '4/5', '1/6', '5/6', '1/12', '5/12', '7/12', '11/12']);

// Precompiled Regex patterns for performance
const rxColor = /^(?:-[a-z-]+)?\[(?:#|rgb|hsl|rgba|hsla)/;
const rxRounded = /^-?rounded-\[.+\]$/;
const rxTextSize = /^-?text-\[\d+(?:\.\d+)?(?:px|rem|em)\]$/;
const rxZIndex = /^-?z-\[\d+\]$/;
const rxShadow = /^-?shadow-\[.+\]$/;
const rxMaxWidth = /^-?max-w-\[.+\]$/;
const rxMinWidth = /^-?min-w-\[.+\]$/;
const rxWidth = /^-?w-\[.+\]$/;
const rxMaxHeight = /^-?max-h-\[.+\]$/;
const rxMinHeight = /^-?min-h-\[.+\]$/;
const rxHeight = /^-?h-\[.+\]$/;
const rxOpacity = /^-?opacity-\[.+\]$/;
const rxTransforms = /^-?(?:translate|scale|rotate)-\[.+\]$/;
const rxBackdrop = /^-?backdrop-(?:blur|brightness|contrast|grayscale|hue-rotate|invert|opacity|saturate|sepia)-\[.+\]$/;
const rxFilters = /^-?(?:blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)-\[.+\]$/;
const rxArbitrary = /-\[\d+(?:\.\d+)?(?:px|rem|em|vw|vh|%)\]/;

export const verifyHardcoded: DoctorRule = {
  id: "hardcoded",
  name: "Hardcoded Values",
  description: "Production-grade hardcoded value analyzer.",
  severity: "Error",
  category: "Quality & Compliance",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations: Violation[] = [];
    const { projectAst } = context;
    const sourceFiles = projectAst.getSourceFiles();

    const breakdownMap: Record<string, {
      violationCount: number;
      files: Record<string, number>;
      values: Record<string, number>;
      suggestion: string;
      confidence: "High" | "Medium" | "Low";
      severity: RuleSeverity;
    }> = {};

    function addBreakdown(category: string, value: string, file: string, suggestion: string, confidence: "High" | "Medium" | "Low", severity: RuleSeverity) {
      if (!breakdownMap[category]) {
        breakdownMap[category] = {
          violationCount: 0,
          files: {},
          values: {},
          suggestion,
          confidence,
          severity
        };
      }
      breakdownMap[category].violationCount++;
      breakdownMap[category].files[file] = (breakdownMap[category].files[file] || 0) + 1;
      breakdownMap[category].values[value] = (breakdownMap[category].values[value] || 0) + 1;
    }

    for (const sourceFile of sourceFiles) {
      // Skip irrelevant files for performance
      const filePath = sourceFile.getFilePath();
      if (filePath.includes("node_modules") || filePath.includes(".next") || filePath.includes("dist") || filePath.includes("build") || filePath.includes("coverage") || filePath.includes("scratch") || filePath.includes("scripts")) {
        continue;
      }

      // Single AST pass for both attributes and string literals
      sourceFile.forEachDescendant(node => {
        const kind = node.getKind();
        
        if (kind === SyntaxKind.JsxAttribute) {
          if ((node as any).getNameNode().getText() === "style") {
            // Determine if the style is static or dynamic
            let isDynamic = true;
            const init = (node as any).getInitializer();
            if (init && init.getKind() === SyntaxKind.JsxExpression) {
               const expr = (init as any).getExpression();
               if (expr && expr.getKind() === SyntaxKind.ObjectLiteralExpression) {
                 const props = expr.getProperties();
                 if (props.length > 0) {
                   isDynamic = props.some((p: any) => {
                     if (p.getKind() === SyntaxKind.PropertyAssignment) {
                       const val = p.getInitializer();
                       return val && val.getKind() !== SyntaxKind.StringLiteral && val.getKind() !== SyntaxKind.NumericLiteral;
                     }
                     return true; // Spread assignments etc are dynamic
                   });
                 }
               }
            }

            const severity = isDynamic ? "Info" : "Critical";
            const catName = isDynamic ? "Dynamic Inline Styles" : "Inline Styles";

            violations.push({
              rule: "hardcoded",
              category: catName,
              file: filePath,
              line: node.getStartLineNumber(),
              column: sourceFile.getLineAndColumnAtPos(node.getStart()).column,
              message: isDynamic ? `Dynamic inline style used.` : `Inline style detected. Move styles to Tailwind classes or CSS variables.`,
              severity: severity,
              suggestion: isDynamic ? "Review if this can be moved to standard tailwind utilities" : "Move styles to Tailwind classes or CSS variables",
              value: "style={...}",
              replacement: "Tailwind classes",
              reason: "Inline styles prevent CSP compliance and break design system consistency.",
              confidence: isDynamic ? "Low" : "High",
              estimatedRisk: "Low",
              canAutoFix: false
            });
            addBreakdown(catName, "style={...}", filePath, isDynamic ? "Review for tailwind utility" : "Move styles to Tailwind classes or CSS variables", isDynamic ? "Low" : "High", severity);
          }
        } 
        else if (kind === SyntaxKind.StringLiteral || kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
          const text = (node as any).getLiteralText();
          if (!text) return;
          
          const classes = text.split(/\s+/);
          for (let cls of classes) {
            if (!cls) continue;

            let checkBody = cls;
            const modifiersIndex = checkBody.lastIndexOf(':');
            if (modifiersIndex !== -1) {
               checkBody = checkBody.substring(modifiersIndex + 1);
            }
            const isNegative = checkBody.startsWith('-');
            if (isNegative) {
               checkBody = checkBody.substring(1);
            }

            // SMART IGNORE
            if (
              checkBody.includes("var(") ||
              checkBody.includes("calc(") ||
              checkBody.includes("clamp(") ||
              checkBody.includes("min(") ||
              checkBody.includes("max(") ||
              checkBody.startsWith("animate-") ||
              checkBody === "bottom-right" ||
              checkBody.match(/^(?:scale|rotate|blur|opacity)-\[.+\]$/)
            ) {
              continue;
            }

            // Group 1: SPACING
            const segments = checkBody.split('-');
            let prefix = '';
            let val = '';
            if (segments.length === 2) {
               prefix = segments[0]; val = segments[1];
            } else if (segments.length >= 3) {
               if (spacingPrefixes.has(segments[0] + '-' + segments[1])) {
                   prefix = segments[0] + '-' + segments[1];
                   val = segments.slice(2).join('-');
               } else {
                   prefix = segments[0];
                   val = segments.slice(1).join('-');
               }
            }

            let category = "";
            let suggestion = "";
            let confidence: "High"| "Medium" | "Low" = "High";
            let severity: RuleSeverity = "Error";
            let reason = "Arbitrary values break design system consistency.";

            if (prefix && spacingPrefixes.has(prefix) && val && !val.startsWith('space-') && !allowedStructural.has(val) && !val.includes('[')) {
              if (prefix.startsWith('p')) category = "Padding";
              else if (prefix.startsWith('m')) category = "Margin";
              else if (prefix.startsWith('gap')) category = "Gap";
              else if (prefix === 'space-x') category = "Space X";
              else if (prefix === 'space-y') category = "Space Y";
              else category = "Inset";

              suggestion = `Use semantic space tokens like ${prefix}-space-X`;
              
              violations.push({
                rule: "hardcoded", category, file: filePath, 
                line: node.getStartLineNumber(),
                column: sourceFile.getLineAndColumnAtPos(node.getStart()).column,
                message: `Hardcoded spacing used: ${cls}.`, severity, suggestion, value: cls,
                replacement: `${prefix}-space-...`, reason, confidence, estimatedRisk: "Low", canAutoFix: true
              });
              addBreakdown(category, cls, filePath, suggestion, confidence, severity);
              continue;
            }

            if (!checkBody.includes("[")) continue;
            
            const classToTest = isNegative ? "-" + checkBody : checkBody;

            if (rxColor.test(classToTest)) {
              category = "Colors"; suggestion = "Use semantic color tokens"; severity = "Critical";
            } else if (rxTextSize.test(classToTest)) {
              category = "Font Size"; suggestion = "Use typography tokens"; 
            } else if (classToTest.match(/^-?leading-\[.+\]$/)) {
              category = "Line Height"; suggestion = "Use typography tokens";
            } else if (classToTest.match(/^-?tracking-\[.+\]$/)) {
              category = "Letter Spacing"; suggestion = "Use typography tokens";
            } else if (classToTest.match(/^-?font-\[.+\]$/)) {
              category = "Font Weight"; suggestion = "Use typography tokens";
            } else if (rxRounded.test(classToTest)) {
              category = "Border Radius"; suggestion = "Use radius tokens";
            } else if (rxMaxWidth.test(classToTest)) {
              category = "Max Width"; suggestion = "Use standardized max-w tokens";
            } else if (rxMinWidth.test(classToTest)) {
              category = "Min Width"; suggestion = "Use standardized min-w tokens";
            } else if (rxWidth.test(classToTest)) {
              category = "Width"; suggestion = "Use standardized width layout tokens";
            } else if (rxMaxHeight.test(classToTest)) {
              category = "Max Height"; suggestion = "Use standardized max-h tokens";
            } else if (rxMinHeight.test(classToTest)) {
              category = "Min Height"; suggestion = "Use standardized min-h tokens";
            } else if (rxHeight.test(classToTest)) {
              category = "Height"; suggestion = "Use standardized height layout tokens";
            } else if (rxShadow.test(classToTest)) {
              category = "Shadows"; suggestion = "Use standardized shadow tokens";
            } else if (rxTransforms.test(classToTest)) {
              category = "Transforms"; suggestion = "Use standardized transform tokens"; severity = "Warning";
            } else if (rxFilters.test(classToTest)) {
              category = "Filters"; suggestion = "Use standardized filter tokens"; severity = "Warning";
            } else if (rxBackdrop.test(classToTest)) {
              category = "Backdrop Filters"; suggestion = "Use standardized backdrop filter tokens"; severity = "Warning";
            } else if (rxOpacity.test(classToTest)) {
              category = "Opacity"; suggestion = "Use standardized opacity tokens"; severity = "Warning";
            } else if (rxZIndex.test(classToTest)) {
              category = "Z-index"; suggestion = "Use standardized z-index utility tokens";
            } else if (rxArbitrary.test(classToTest)) {
              category = "Arbitrary Tailwind Values"; suggestion = "Move to semantic design tokens"; confidence = "Low"; severity = "Info";
            }

            if (category) {
              violations.push({
                rule: "hardcoded", category, file: filePath, 
                line: node.getStartLineNumber(),
                column: sourceFile.getLineAndColumnAtPos(node.getStart()).column,
                message: `Arbitrary value used: ${cls}.`, severity, suggestion, value: cls,
                replacement: "semantic-token", reason, confidence, estimatedRisk: "Medium", canAutoFix: false
              });
              addBreakdown(category, cls, filePath, suggestion, confidence, severity);
            }
          }
        }
      });
    }

    const passed = violations.length === 0 || !violations.some(v => v.severity === "Critical" || v.severity === "Error" || v.severity === "Warning");
    const score = passed ? 100 : Math.max(0, 100 - violations.filter(v => v.severity === "Critical" || v.severity === "Error" || v.severity === "Warning").length);

    const breakdown: RuleBreakdown[] = Object.entries(breakdownMap).map(([cat, data]) => {
      const topValues = Object.entries(data.values)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([value, count]) => ({ value, count }));

      const topFiles = Object.entries(data.files)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([file, count]) => ({ file, count }));

      return {
        category: cat,
        violationCount: data.violationCount,
        affectedFiles: Object.keys(data.files).length,
        topFiles,
        topValues,
        suggestion: data.suggestion,
        confidence: data.confidence,
        severity: data.severity
      };
    });
    
    breakdown.sort((a, b) => b.violationCount - a.violationCount);

    return {
      id: this.id,
      name: this.name,
      category: this.category,
      passed,
      score,
      violations,
      breakdown
    };
  }
};
