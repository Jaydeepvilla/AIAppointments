/**
 * @file codemods/migrate-buttons.cjs
 *
 * jscodeshift codemod — migrates hardcoded button/link/a classNames to
 * dynamic getButtonClasses() calls from the design-system token resolver.
 *
 * ─── Execution ────────────────────────────────────────────────────────────────
 *   # Dry run (preview only, no file writes):
 *   npx jscodeshift --dry -t codemods/migrate-buttons.cjs src --extensions=tsx --parser=tsx
 *
 *   # Live run:
 *   npx jscodeshift -t codemods/migrate-buttons.cjs src --extensions=tsx --parser=tsx
 *
 * ─── Scope Rules ──────────────────────────────────────────────────────────────
 *   ✅ MIGRATE:  Raw <button> elements with className (always interactive)
 *   ✅ MIGRATE:  <a> / <Link> elements that are visually styled as CTA buttons
 *                (must have a solid background + padding — "button-like" appearance)
 *
 *   ❌ SKIP:     Navigation links (navbar, sidebar, footer, breadcrumbs)
 *   ❌ SKIP:     Logo / brand mark links
 *   ❌ SKIP:     Text-only inline links inside paragraphs
 *   ❌ SKIP:     Social media icon links
 *   ❌ SKIP:     Documentation, table, pagination text links
 *   ❌ SKIP:     <Button> (custom component — already uses design system)
 *   ❌ SKIP:     <NativeButton>, <NativeA> (wrapper components)
 *
 *   The navigation system and the button system are two completely different
 *   design systems. This codemod NEVER converts navigation links into pill
 *   buttons, NEVER adds button backgrounds to navigation, NEVER changes
 *   logo or brand identity styling.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ─── Constants ────────────────────────────────────────────────────────────────

const HELPER_IMPORT_PATH = '@/design-system/button-tokens';
const HELPER_FN_NAME     = 'getButtonClasses';

/**
 * ONLY raw HTML elements that could be CTA buttons.
 * <Button>, <NativeButton>, <NativeA> are EXCLUDED — they already use the
 * design system or are wrapper components.
 */
const TARGET_ELEMENTS = new Set(['button', 'a', 'Link']);

const MIGRATION_SENTINEL = 'inline-flex items-center justify-center rounded-full';

// ─── CTA Detection for <a> / <Link> ──────────────────────────────────────────

/**
 * CTA POSITIVE signals — className patterns that indicate the element
 * is visually styled as a CTA button (has a solid background + padding).
 * ALL of these require a visible background color to be considered a CTA.
 */
const CTA_BG_RE = /\b(?:bg-(?:black|white|foreground|primary|secondary|accent|error|success|warning|info|card|background|gray-(?:50|100|200|300|400|500|600|700|800|900)|neutral-\d+|\[#[0-9a-fA-F]{3,8}\]|(?:primary|secondary|foreground|error|success|warning|info)-\d+))\b/;

/**
 * Navigation / non-CTA NEGATIVE signals — className patterns that indicate
 * the element is a navigation link, logo, breadcrumb, or text link.
 * If ANY of these are present, the element is SKIPPED even if it has bg-*.
 */
const NAV_SKIP_PATTERNS = [
  /\bshrink-0\b/,                          // Logo wrapping pattern
  /\binline-block\b(?!.*\bbg-)/,            // Inline elements without bg (footer logo)
  /\bblock\b(?!.*\bbg-(?!transparent))/,    // Block nav items without solid bg
  /\bnav\b/i,                               // Explicit nav class
  /\bmenu\b/i,                              // Menu items
  /\bsidebar\b/i,                           // Sidebar items
  /\bbreadcrumb\b/i,                        // Breadcrumbs
  /\bfooter\b/i,                            // Footer items
  /\blogo\b/i,                              // Logo elements
  /\bbrand\b/i,                             // Brand elements
];

/**
 * Navigation-only visual pattern: "text-muted-foreground hover:text-foreground"
 * without any solid background — this is the universal nav-link pattern in
 * this codebase.
 */
const NAV_LINK_PATTERN = /\btext-muted-foreground\b.*\bhover:text-foreground\b/;

/**
 * Determines if an <a> or <Link> element is a CTA button (should be migrated)
 * versus a navigation link (should be skipped).
 *
 * A CTA link MUST have:
 *   1. A solid background class (bg-black, bg-primary, bg-foreground, etc.)
 *      — NOT bg-transparent, NOT bg-primary/5 (opacity tint)
 *   2. No navigation/logo/breadcrumb signals
 *
 * @param   {string} classStr  The full className string
 * @returns {boolean}          true = CTA button, false = navigation/text link
 */
function isCTALink(classStr) {
  // Must have a solid background to be considered a CTA
  if (!CTA_BG_RE.test(classStr)) return false;

  // Filter out bg-transparent (ghost/nav pattern, not a CTA)
  if (/\bbg-transparent\b/.test(classStr) && !/\bborder\b/.test(classStr)) return false;

  // Filter out opacity-tinted backgrounds (bg-primary/5, bg-primary/10)
  // These are decorative containers, not CTA buttons
  if (/\bbg-(?:primary|foreground|secondary|card|background)\/\d/.test(classStr)) return false;

  // Filter out bg-card/85 etc. (backdrop blur nav containers)
  if (/\bbg-card\/\d/.test(classStr)) return false;

  // Check for explicit navigation/logo/brand signals → SKIP
  for (const pattern of NAV_SKIP_PATTERNS) {
    if (pattern.test(classStr)) return false;
  }

  // Check for the universal nav-link visual pattern → SKIP
  // "text-muted-foreground ... hover:text-foreground" WITHOUT a solid bg
  // (If it HAS a solid bg, it's a mobile CTA styled as a Link — keep it)
  if (NAV_LINK_PATTERN.test(classStr)) {
    // Exception: if it also has bg-primary or similar, it's a CTA (mobile menu CTA)
    if (/\bbg-(?:primary|foreground|black)\b/.test(classStr)) return true;
    return false;
  }

  return true;
}

// ─── Heuristic Classifier ─────────────────────────────────────────────────────

/**
 * Classifies a className string into (type, variant, size).
 * Only called AFTER element-level filtering confirms this IS a CTA.
 *
 * @param   {string} classStr
 * @returns {{ type: string, variant: string, size: string } | null}
 */
function classify(classStr) {
  // Already migrated — skip
  if (classStr.includes(MIGRATION_SENTINEL) || classStr.includes(HELPER_FN_NAME)) return null;

  // ── Type (fallback: primary) ──
  let type = 'primary';
  if (/\bbg-(?:white|card|background)\b|\bborder-gray\b/.test(classStr)) {
    type = 'secondary';
  } else if (/\bbg-transparent\b/.test(classStr)) {
    type = 'tertiary';
  }

  // ── Variant (fallback: filled) ──
  let variant = 'filled';
  if (/\bhover:underline\b/.test(classStr) && !/\bborder\b/.test(classStr)) {
    variant = 'link';
  } else if (/\bbg-transparent\b.*\bborder\b|\bborder\b.*\bbg-transparent\b/.test(classStr)) {
    variant = 'outline';
  } else if (/\bbg-transparent\b/.test(classStr)) {
    variant = 'ghost';
  }

  // ── Size (fallback: medium) ──
  let size = 'medium';
  const pxMatch = classStr.match(/\bpx-(?:space-)?([\d.]+)\b/);
  if (pxMatch) {
    const px = parseFloat(pxMatch[1]);
    if (px <= 2.5) size = 'small';
    else if (px >= 6) size = 'large';
  }
  const hMatch = classStr.match(/\bh-(?:space-)?([\d.]+)\b/);
  if (hMatch) {
    const h = parseFloat(hMatch[1]);
    if (h <= 8)  size = 'small';
    else if (h >= 12) size = 'large';
  }

  return { type, variant, size };
}

// ─── Legacy Class Stripper ────────────────────────────────────────────────────

/**
 * Strips hardcoded visual classes that will be replaced by getButtonClasses().
 * Preserves layout/responsive classes (mx-auto, w-full, gap-*, etc.).
 */
function stripLegacyClasses(raw) {
  return raw
    .replace(/\s*\bbg-(?:black|white|gray-\d+|neutral-\d+|foreground|primary|secondary|card|background|accent|\[#[0-9a-fA-F]{3,8}\])(?:\/\d+)?\b/g, '')
    .replace(/\s*\brounded-(?:sm|md|lg|xl|2xl|3xl|full)\b/g, '')
    .replace(/\s*\bradius-(?:sm|md|lg|xl|full)\b/g, '')
    .replace(/\s*\btext-(?:white|black|gray-\d+|neutral-\d+|foreground|primary-foreground|\[#[0-9a-fA-F]{3,8}\])\b/g, '')
    .replace(/(?<!\w:)\bp[xy]-(?:space-)?\d+(?:\.\d+)?\b/g, '')
    .replace(/\s*\bfont-(?:bold|semibold|medium|normal)\b/g, '')
    .replace(/\s*\bshadow(?:-\S+)?\b/g, '')
    .replace(/\s*\bborder-(?:white|black|gray-\d+|neutral-\d+|\[#[0-9a-fA-F]{3,8}\])\b/g, '')
    .replace(/\s*\bhover:bg-\S+\b/g, '')
    .replace(/\s*\bhover:text-\S+\b/g, '')
    .replace(/\s*\bhover:border-\S+\b/g, '')
    .replace(/\s*\bactive:bg-\S+\b/g, '')
    .replace(/\s*\bactive:scale-\S+\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Import Injector ──────────────────────────────────────────────────────────

function ensureImport(root, j) {
  const imports = root.find(j.ImportDeclaration);

  const alreadyImported = imports.some(path => {
    return path.node.source.value === HELPER_IMPORT_PATH &&
           path.node.specifiers.some(s => s.type === 'ImportSpecifier' && s.imported.name === HELPER_FN_NAME);
  });
  if (alreadyImported) return;

  const existingModuleImport = imports.filter(path => path.node.source.value === HELPER_IMPORT_PATH);
  if (existingModuleImport.length > 0) {
    existingModuleImport.at(0).node.specifiers.push(j.importSpecifier(j.identifier(HELPER_FN_NAME)));
    return;
  }

  const newImport = j.importDeclaration(
    [j.importSpecifier(j.identifier(HELPER_FN_NAME))],
    j.stringLiteral(HELPER_IMPORT_PATH),
  );
  if (imports.length > 0) imports.at(-1).insertAfter(newImport);
  else root.find(j.Program).get('body', 0).insertBefore(newImport);
}

// ─── AST Node Builder ────────────────────────────────────────────────────────

function buildGetButtonClassesCall(j, type, variant, size, extraNode) {
  const args = [j.stringLiteral(type), j.stringLiteral(variant), j.stringLiteral(size)];
  if (extraNode) args.push(extraNode);
  return j.callExpression(j.identifier(HELPER_FN_NAME), args);
}

// ─── Template Literal → Extra Argument Builder ───────────────────────────────

/**
 * Builds the 4th `extra` argument from a template literal's residuals.
 * NEVER mutates the original AST node.
 */
function buildExtraFromTemplateLiteral(j, tl) {
  const strippedQuasis = tl.quasis.map(q => stripLegacyClasses(q.value.raw));
  const originalExprs  = tl.expressions;

  const hasStaticResidue  = strippedQuasis.some(s => s.length > 0);
  const hasDynamicExprs   = originalExprs.length > 0;

  if (!hasStaticResidue && !hasDynamicExprs) return null;

  if (!hasDynamicExprs) {
    const collapsed = strippedQuasis.join(' ').replace(/\s{2,}/g, ' ').trim();
    return collapsed.length > 0 ? j.stringLiteral(collapsed) : null;
  }

  const newQuasis = [];
  const newExprs  = [];

  for (let i = 0; i < strippedQuasis.length; i++) {
    let raw = strippedQuasis[i];

    if (i > 0 && raw.length > 0 && !raw.startsWith(' ')) raw = ' ' + raw;
    if (i < originalExprs.length && raw.length > 0 && !raw.endsWith(' ')) raw = raw + ' ';
    if (i > 0 && i < originalExprs.length && raw.length === 0) raw = ' ';

    const isTail = (i === strippedQuasis.length - 1);
    newQuasis.push(j.templateElement({ raw, cooked: raw }, isTail));

    if (i < originalExprs.length) newExprs.push(originalExprs[i]);
  }

  if (newQuasis.length !== newExprs.length + 1) return null;

  if (newExprs.length === 0) {
    const collapsed = newQuasis.map(q => q.value.raw).join('').trim();
    return collapsed.length > 0 ? j.stringLiteral(collapsed) : null;
  }

  return j.templateLiteral(newQuasis, newExprs);
}

// ─── Transformer ─────────────────────────────────────────────────────────────

module.exports = function transformer(file, api) {
  const j    = api.jscodeshift;
  const root = j(file.source);
  let mutationCount = 0;

  root.find(j.JSXOpeningElement).forEach(path => {
    const elementName = path.node.name.type === 'JSXIdentifier' ? path.node.name.name : null;
    if (!elementName || !TARGET_ELEMENTS.has(elementName)) return;

    const classNameAttr = path.node.attributes.find(
      attr => attr.type === 'JSXAttribute' && attr?.name?.name === 'className',
    );
    if (!classNameAttr) return;

    const val = classNameAttr.value;

    // ── Gather static class text for analysis ──
    let staticClassText = '';
    if (val.type === 'StringLiteral') {
      staticClassText = val.value;
    } else if (val.type === 'JSXExpressionContainer' && val.expression.type === 'TemplateLiteral') {
      staticClassText = val.expression.quasis.map(q => q.value.raw).join(' ');
    } else {
      return; // Computed expression — can't analyse statically
    }

    // ── Element-level gate ──
    // <button> elements are ALWAYS interactive CTA candidates.
    // <a> and <Link> elements must pass the isCTALink() check.
    if (elementName !== 'button') {
      if (!isCTALink(staticClassText)) return;
    }

    // ── Case 1: className="..." (StringLiteral) ──
    if (val.type === 'StringLiteral') {
      const result = classify(val.value);
      if (!result) return;

      const { type, variant, size } = result;
      const remainder = stripLegacyClasses(val.value);
      const extraNode = remainder.length > 0 ? j.stringLiteral(remainder) : null;

      classNameAttr.value = j.jsxExpressionContainer(
        buildGetButtonClassesCall(j, type, variant, size, extraNode),
      );
      mutationCount++;
    }

    // ── Case 2: className={`...`} (TemplateLiteral) ──
    else if (
      val.type === 'JSXExpressionContainer' &&
      val.expression.type === 'TemplateLiteral'
    ) {
      const tl = val.expression;
      const rawStaticParts = tl.quasis.map(q => q.value.raw).join(' ');
      const result = classify(rawStaticParts);
      if (!result) return;

      const { type, variant, size } = result;
      const extraNode = buildExtraFromTemplateLiteral(j, tl);

      classNameAttr.value = j.jsxExpressionContainer(
        buildGetButtonClassesCall(j, type, variant, size, extraNode || undefined),
      );
      mutationCount++;
    }
  });

  if (mutationCount > 0) {
    ensureImport(root, j);
    return root.toSource({ quote: 'single' });
  }
  return null;
};
