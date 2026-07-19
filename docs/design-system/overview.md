# Design System Overview

Operator uses a custom, CSS variables-based design system tailored for a premium SaaS aesthetic.

The design system is strictly enforced by the `operator-doctor` static analysis tool, which prevents hardcoded colors, spacing values, and non-standard animations from being committed.

**Location:** `src/design-system/`

---

## Foundations

The foundation of the design system is a set of raw CSS files that define CSS Custom Properties (variables) on the `:root` pseudo-class. These variables act as design tokens.

### Colors

**File:** `src/design-system/foundations/colors.css`

Colors are defined using HSL (Hue, Saturation, Lightness) values to allow for easy opacity modifiers (e.g., `hsla(var(--color-primary-500), 0.5)`).

The palette includes:
- Primary (Brand color scale: 50–900)
- Neutral (Grayscale for text, borders, backgrounds: 50–900)
- Semantic (Success, Warning, Danger, Info scales)
- Surface (Background layers: page, card, modal, tooltip)

### Typography

**File:** `src/design-system/foundations/typography.css`

The typographic scale defines font families, sizes, line heights, and weights.

- `--font-sans`: Inter, system-ui, sans-serif
- `--font-mono`: JetBrains Mono, Menlo, monospace
- `--text-xs` to `--text-9xl` (font sizes)
- `--leading-none` to `--leading-loose` (line heights)
- `--font-normal` to `--font-black` (font weights)

### Spacing

**File:** `src/design-system/foundations/spacing.css`

A strictly defined spatial system used for margin, padding, gap, and absolute positioning. Built on a 4px grid.

- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
... up to `--space-32` (128px)

### Effects

**File:** `src/design-system/foundations/effects.css`

Defines elevation (shadows), blurs (glassmorphism), and border radii.

- Shadows: `--shadow-sm` to `--shadow-2xl`
- Radii: `--radius-sm` to `--radius-full`
- Blurs: `--blur-sm` to `--blur-xl`

### Motion

**File:** `src/design-system/foundations/motion.css`

Motion tokens ensure UI animation consistency.

- Durations: `--duration-75` to `--duration-1000`
- Easings: `--ease-linear`, `--ease-in`, `--ease-out`, `--ease-in-out`, `--ease-spring` (custom bezier curve for spring-like feel without physics simulation)

---

## Component Architecture

Components are built by consuming these CSS variables, usually via Tailwind CSS (which is configured to read these variables) or raw CSS modules.

### Button Tokens Example

For complex components, the design system uses TypeScript token mappings to ensure variant consistency.

**File:** `src/design-system/button-tokens.ts`

```typescript
export const buttonVariants = {
  primary: {
    bg: "var(--color-primary-600)",
    text: "var(--color-neutral-0)",
    hoverBg: "var(--color-primary-700)",
    activeBg: "var(--color-primary-800)",
  },
  // ... secondary, ghost, danger, etc.
}
```

### Static Analysis Enforcement

The custom `operator-doctor` CLI enforces design system usage.

Rule: `design-system`
Description: "Prevents hardcoded colors and non-token values."

If a developer writes `<div style={{ marginTop: '15px' }}>`, the build will fail, instructing them to use a token from the spacing scale (e.g., `var(--space-4)`).

---

## Best Practices

1. **Never hardcode hex values.** Always use `var(--color-...)`.
2. **Never hardcode pixel margins/padding.** Always use `var(--space-...)`.
3. **Use semantic variables where available.** Prefer `var(--surface-card)` over `var(--color-neutral-50)`.
4. **Respect the 4px grid.** If a spacing isn't in the scale, reconsider the design.
