# Motion Guidelines

Operator relies on subtle, purposeful motion to create a premium SaaS experience. Motion is not used for decoration; it is used to guide the user's attention, communicate state changes, and provide physical realism to digital interfaces.

## Core Principles

1. **Purposeful** — Every animation must serve a UX purpose (feedback, hierarchy, continuity).
2. **Performant** — Maintain 60 FPS. Only animate composite properties (`transform`, `opacity`).
3. **Responsive** — Respect the user's OS-level motion preferences (`prefers-reduced-motion`).
4. **Spring-driven** — Prefer spring physics (or spring-like easing curves) over linear or standard cubic-bezier curves for a natural, snappy feel.

---

## Motion Tokens

**File:** `src/design-system/foundations/motion.css`

The design system exports CSS variables for standardizing durations and easings.

### Durations

- `--duration-75` (75ms): Hover states, micro-interactions
- `--duration-150` (150ms): Tooltips, dropdowns, small state changes
- `--duration-200` (200ms): Modals, dialogs, page transitions
- `--duration-300` (300ms): Complex choreographies, staggered lists
- `--duration-500` (500ms): Major layout changes, scroll reveals

### Easings

- `--ease-out`: Elements entering the screen (decelerating)
- `--ease-in`: Elements leaving the screen (accelerating)
- `--ease-in-out`: Elements moving across the screen
- `--ease-spring`: A custom cubic-bezier that mimics a slightly bouncy spring (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`)

---

## Scroll Reveal Component

**File:** `src/components/motion/scroll-reveal.tsx`

For viewport-based entrance animations (e.g., sections fading in as the user scrolls down the landing page), use the `ScrollReveal` component.

```tsx
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function FeaturesSection() {
  return (
    <section>
      <ScrollReveal>
        <h2>Powerful AI Features</h2>
        <p>Everything you need to automate your reception.</p>
      </ScrollReveal>
    </section>
  );
}
```

### Staggered Children

To animate a list of items sequentially as they enter the viewport, use the `staggerChildren` property.

```tsx
<ScrollReveal staggerChildren={0.1}>
  <div className="card">Feature 1</div>
  <div className="card">Feature 2</div>
  <div className="card">Feature 3</div>
</ScrollReveal>
```

### Animation Directions

You can customize the entrance direction (`up`, `down`, `left`, `right`) and distance.

```tsx
<ScrollReveal direction="left" distance={40}>
  <img src="/dashboard-preview.png" alt="Dashboard" />
</ScrollReveal>
```

---

## Common Patterns

### Page Transitions
Use a subtle fade (0 to 1) and slight translate up (10px to 0) over 200ms with `--ease-out` when loading new pages in the dashboard.

### Modals & Dialogs
Scale from 0.95 to 1.0 and fade in over 200ms using `--ease-spring`.

### Buttons
Scale down to 0.97 on `:active` (click) to simulate physical depression. Background color transitions on `:hover` should take 150ms.

### Loading States
Prefer skeleton loaders with a subtle, continuous shimmer effect over spinning indicators for content areas. Use spinners only for small, localized actions (like a saving button).

---

## Accessibility: Reduced Motion

Always respect `prefers-reduced-motion`. In CSS, wrap your animations in a media query:

```css
@media (prefers-reduced-motion: no-preference) {
  .animated-element {
    transition: transform var(--duration-200) var(--ease-spring);
  }
}
```

The `ScrollReveal` component handles this automatically; if the user prefers reduced motion, it will instantly render children without animation.
