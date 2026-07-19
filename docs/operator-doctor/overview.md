# Operator Doctor

Operator Doctor is a custom static analysis CLI tool built specifically for this codebase. It audits source code across 15 rules covering architecture, quality, design system compliance, security, accessibility, performance, and more.

**Run with:**

```bash
npm run operator:doctor
```

---

## Architecture

Operator Doctor is built on top of `ts-morph` — a TypeScript Compiler API wrapper that provides a full AST of the codebase. Rules access this AST via `DoctorContext.projectAst`.

The tool is implemented in `scripts/doctor/`:

```
scripts/doctor/
├── index.ts              # CLI entry point, argument parsing, rule orchestration
├── types.ts              # DoctorRule, RuleResult, Violation, DoctorContext interfaces
├── utils/
│   ├── context-loader.ts # Loads ts-morph Project, config, changed files
│   └── reporter.ts       # Console, JSON, and SARIF output formatters
└── rules/
    ├── verify-accessibility.ts
    ├── verify-ai-compliance.ts
    ├── verify-components.ts
    ├── verify-design-system.ts
    ├── verify-functionality.ts
    ├── verify-hardcoded.ts
    ├── verify-icons.ts
    ├── verify-motion.ts
    ├── verify-performance.ts
    ├── verify-responsive.ts
    ├── verify-routing.ts
    ├── verify-security.ts
    ├── verify-seo.ts
    ├── verify-ui-quality.ts
    └── verify-unused.ts
```

---

## CLI reference

```
npm run operator:doctor [options]

Options:
  --rule <id>           Execute only the specified rule
  --category <name>     Execute only rules in the specified category
  --list                Print all available rules and exit
  --summary             Display only the health score dashboard
  --details             Show detailed violations per rule
  --json                Output machine-readable JSON to stdout
  --sarif               Generate reports/operator-doctor.sarif (for CI/GitHub integration)
  --changed             Analyze only files changed in Git (faster in CI)
  --baseline            Create or update the baseline file (.operator-doctor-baseline.json)
  --reset-baseline      Delete the baseline file
  --fix-safe            Apply safe auto-fixes to violations that support them
  --strict              Exit with code 1 if health score is below strictThreshold
  --watch               Watch src/ for changes and re-run automatically
  --help                Show help
```

### Shortcuts (npm scripts)

| Script | Equivalent |
|---|---|
| `npm run doctor:design` | `--rule design-system` |
| `npm run doctor:components` | `--rule components` |
| `npm run doctor:motion` | `--rule motion` |
| `npm run doctor:icons` | `--rule icons` |
| `npm run doctor:responsive` | `--rule responsive` |
| `npm run doctor:accessibility` | `--rule accessibility` |

---

## Rules reference

### accessibility
**Category:** Quality & Compliance | **Severity:** Error

Checks for:
- Missing `alt` attribute on `<Image>` and `<img>` elements
- `onClick` on non-interactive elements (`div`, `span`, `p`, `section`) without `tabIndex` and `onKeyDown`
- Positive `tabIndex` values (breaks natural tab order)

### ai-compliance
**Category:** AI Compliance | **Severity:** Error

Checks that AI-generated or AI-adjacent code follows required patterns for this codebase. Largest rule file (11,438 bytes).

### components
**Category:** Design System | **Severity:** Warning

Verifies that components follow the shared component conventions established in `src/components/shared/`.

### design-system
**Category:** Design System | **Severity:** Warning

Checks that color values, spacing, and other design tokens are consumed from the CSS token files in `src/design-system/foundations/` rather than hardcoded as raw values.

### functionality
**Category:** Code Quality | **Severity:** Error

Checks for common functional code quality issues. Large rule (9,982 bytes — covers multiple patterns).

### hardcoded
**Category:** Code Quality | **Severity:** Warning

Detects hardcoded values that should be moved to environment variables, constants, or design tokens. Largest rule file (14,016 bytes).

### icons
**Category:** Design System | **Severity:** Info

Verifies that icon imports come from allowed icon libraries (configured in `operator-doctor.config.ts → allowedIconLibraries`). Default: only `lucide-react`.

### motion
**Category:** Design System | **Severity:** Info

Checks that animation values (durations, easings, delays) reference the motion tokens defined in `src/design-system/foundations/motion.css` rather than raw values.

### performance
**Category:** Performance | **Severity:** Warning

Checks for common performance anti-patterns in React components and Next.js pages.

### responsive
**Category:** Quality & Compliance | **Severity:** Warning

Checks for responsive design compliance — missing mobile breakpoints, hardcoded pixel widths, etc.

### routing
**Category:** Architecture | **Severity:** Error

Verifies route structure follows Next.js App Router conventions and that all referenced routes exist.

### security
**Category:** Architecture | **Severity:** Error

Checks for:
1. Non-public env variables (`process.env.SOME_SECRET`) accessed inside Client Components (`"use client"`)
2. Raw SQL template string interpolation that bypasses parameterization
3. Missing auth guard in `src/proxy.ts` or `src/middleware.ts`

### seo
**Category:** Quality & Compliance | **Severity:** Warning

Checks pages for missing or invalid SEO metadata (title, description, canonical, Open Graph).

### ui-quality
**Category:** Quality & Compliance | **Severity:** Warning

Audits UI code quality. Large rule (9,542 bytes).

### unused
**Category:** Code Quality | **Severity:** Info

Detects unused imports, variables, and exports.

---

## Severity levels

| Level | Meaning |
|---|---|
| `Info` | Advisory — does not affect the health score significantly |
| `Warning` | Should be addressed — scores are reduced |
| `Error` | Must be addressed — significant score impact |
| `Critical` | Blocking — stops the build in strict mode |

---

## Health score

Each rule produces a score from 0 to 100:

```
score = 100 - (violations.length * penalty_per_violation)
```

The overall health score is a weighted average across all rules.

---

## Baseline mode

The baseline system allows you to acknowledge existing violations and only report **new** violations introduced since the baseline was set.

```bash
# Set the baseline (captures all current violations)
npm run operator:doctor -- --baseline

# Future runs will only report violations not in the baseline
npm run operator:doctor

# Remove the baseline
npm run operator:doctor -- --reset-baseline
```

The baseline is stored in `.operator-doctor-baseline.json` at the project root. It maps rule IDs to arrays of violation signatures (`file:line:message`).

When running with `--changed`, the baseline is scoped to changed files — violations in unchanged files are automatically ignored.

---

## Strict mode

```bash
npm run operator:doctor -- --strict
```

Exits with code `1` if the overall health score falls below `strictThreshold` (default: `80`, configured in `operator-doctor.config.ts`).

Use this in CI to enforce code quality gates.

---

## SARIF output

```bash
npm run operator:doctor -- --sarif
```

Generates `reports/operator-doctor.sarif` — a Static Analysis Results Interchange Format file compatible with GitHub Advanced Security, VS Code SARIF Viewer, and other SARIF-aware tools.

---

## Watch mode

```bash
npm run operator:doctor -- --watch
```

Watches `src/` for changes to `.ts`, `.tsx`, and `.css` files. Re-runs the audit with a 300ms debounce on each change.

---

## Configuration

**File:** `operator-doctor.config.ts`

```typescript
const config: DoctorConfig = {
  plugins: [],              // Additional plugin directories (auto-discovered: scripts/doctor/plugins/)
  disabledRules: [],        // Rule IDs to skip
  strict: false,            // Enable strict mode by default
  strictThreshold: 80,      // Minimum health score before strict mode fails
  ignorePaths: [            // Paths excluded from analysis
    "node_modules",
    ".next",
    "dist",
    "build"
  ]
};
```

### Plugin system

Additional rules can be placed in `scripts/doctor/plugins/`. They are auto-discovered at runtime — any `.ts` file in the plugins directory that exports an object with an `id` and `execute` function will be loaded as a rule.

---

## CI integration

Add to your CI pipeline:

```yaml
# GitHub Actions example
- name: Run Operator Doctor
  run: npm run operator:doctor -- --strict --sarif --changed

- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: reports/operator-doctor.sarif
```

The `--changed` flag limits analysis to files modified in the current PR, making CI runs fast.

---

## Adding a new rule

1. Create `scripts/doctor/rules/verify-<rulename>.ts`
2. Export a `DoctorRule` object:

```typescript
import { DoctorContext, DoctorRule, RuleResult } from "../types";

export const verifyMyRule: DoctorRule = {
  id: "my-rule",
  name: "My Rule",
  category: "Code Quality",
  description: "Describes what this rule checks.",
  severity: "Warning",
  async execute(context: DoctorContext): Promise<RuleResult> {
    const violations = [];
    
    // Use context.projectAst to traverse the AST
    const sourceFiles = context.projectAst.getSourceFiles();
    for (const file of sourceFiles) {
      // ... check for violations
    }
    
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      passed: violations.length === 0,
      score: violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 5),
      violations,
    };
  },
};
```

3. The rule is auto-discovered on next run. No registration required.
