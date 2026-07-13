"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "./utils";

/**
 * ================================================================
 * OPERATOR ENTERPRISE BUTTON SYSTEM
 * ================================================================
 * Single source of truth for all button interactions.
 * Compliant with:
 *  - WCAG 2.2 AA (keyboard nav, focus rings, contrast, touch targets)
 *  - Operator Design System tokens (zero hardcoded values)
 *  - Enterprise SaaS visual language (Linear, Vercel, Stripe, Notion quality)
 *
 * FORBIDDEN (do not add):
 *  - Hardcoded colors, padding, radius, height, width, font-size, font-weight
 *  - Shadow classes
 *  - Inline styles
 *  - Second Button component anywhere in the project
 * ================================================================
 */

// ─── Base Styles ─────────────────────────────────────────────────────────────
// All values reference design tokens only. No hardcoded px/rem/color values.

const buttonVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center gap-space-2",
    "whitespace-nowrap",
    // Typography — max weight 600 (semibold), never bold/extrabold
    "text-label font-semibold tracking-tight",
    // Transitions — uses motion tokens
    "transition-all duration-fast ease-standard",
    // Focus ring — WCAG 2.2 AA: visible, offset, branded
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // Pressed state
    "active:scale-[0.97]",
    // Disabled — pointer, no interactions
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    // Icon children
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // UX
    "cursor-pointer select-none",
    // Touch target — minimum 44x44px for mobile accessibility (WCAG 2.5.5)
    "min-h-[var(--space-9)]",
  ].join(" "),
  {
    variants: {
      // ─── Variants ─────────────────────────────────────────────────
      variant: {
        /**
         * PRIMARY — Brand identity. Purple. White text. Never black.
         * Use for: primary CTA, save actions, submit forms
         */
        default:
          "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-fg)] border border-transparent " +
          "hover:bg-[var(--btn-primary-hover)] " +
          "active:bg-[var(--btn-primary-active)] " +
          "data-[state=active]:bg-[var(--btn-primary-active)] " +
          "data-[state=selected]:bg-[var(--btn-primary-active)] " +
          "disabled:bg-[var(--btn-primary-disabled-bg)] disabled:text-[var(--btn-primary-disabled-fg)] " +
          "data-[loading=true]:bg-[var(--btn-primary-bg)] data-[loading=true]:text-[var(--btn-primary-fg)] data-[loading=true]:opacity-80",

        /**
         * SECONDARY — Neutral surface. Purple on hover.
         * Use for: secondary actions, toolbar buttons, cancel alternatives
         */
        secondary:
          "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border border-[var(--btn-secondary-border)] " +
          "hover:bg-[var(--btn-secondary-hover-bg)] hover:border-[var(--btn-secondary-hover-border)] " +
          "active:bg-[var(--btn-secondary-active-bg)] " +
          "data-[state=active]:bg-[var(--btn-secondary-active-bg)] data-[state=active]:text-[var(--btn-secondary-text)] " +
          "data-[state=selected]:bg-[var(--btn-secondary-active-bg)] " +
          "disabled:bg-transparent disabled:text-[var(--btn-primary-disabled-fg)] disabled:border-[var(--btn-primary-disabled-bg)] " +
          "data-[loading=true]:bg-[var(--btn-secondary-bg)] data-[loading=true]:text-[var(--btn-secondary-text)] data-[loading=true]:opacity-80",

        /**
         * OUTLINE — Transparent. 1px border. Subtle.
         * Use for: secondary in card/sidebar, filter toggles
         */
        outline:
          "border border-border-default bg-transparent text-foreground " +
          "hover:bg-foreground/[0.04] hover:border-border-hover " +
          "active:bg-foreground/[0.08] " +
          "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5 " +
          "data-[state=selected]:border-primary data-[state=selected]:text-primary " +
          "disabled:text-[var(--btn-primary-disabled-fg)] disabled:border-[var(--btn-primary-disabled-bg)] disabled:bg-transparent",

        /**
         * GHOST — Transparent. No border. Subtle hover.
         * Use for: icon actions, toolbar items, sidebar links, table row actions
         */
        ghost:
          "bg-transparent text-muted-foreground border border-transparent " +
          "hover:text-foreground hover:bg-foreground/[0.06] hover:border-border-subtle " +
          "active:bg-foreground/[0.10] " +
          "data-[state=active]:bg-foreground/[0.06] data-[state=active]:text-foreground " +
          "data-[state=selected]:bg-primary/10 data-[state=selected]:text-primary " +
          "disabled:text-[var(--btn-primary-disabled-fg)] disabled:bg-transparent",

        /**
         * SOFT — Primary tint background. Primary text.
         * Use for: soft CTA, onboarding step actions, feature highlights
         */
        soft:
          "bg-primary/10 text-primary border border-transparent " +
          "hover:bg-primary/15 " +
          "active:bg-primary/20 " +
          "data-[state=active]:bg-primary/20 " +
          "data-[state=selected]:bg-primary/20 " +
          "disabled:bg-[var(--btn-primary-disabled-bg)] disabled:text-[var(--btn-primary-disabled-fg)]",

        /**
         * DESTRUCTIVE — Error semantic color. Danger actions.
         * Use for: delete, remove, irreversible actions
         */
        destructive:
          "bg-error-500 text-white border border-transparent " +
          "hover:bg-error-600 " +
          "active:bg-error-700 " +
          "data-[state=active]:bg-error-700 " +
          "disabled:bg-[var(--btn-primary-disabled-bg)] disabled:text-[var(--btn-primary-disabled-fg)]",

        /**
         * SUCCESS — Green semantic color.
         * Use for: approval, confirm positive outcome
         */
        success:
          "bg-success-500 text-white border border-transparent " +
          "hover:bg-success-600 " +
          "active:bg-success-700 " +
          "disabled:bg-[var(--btn-primary-disabled-bg)] disabled:text-[var(--btn-primary-disabled-fg)]",

        /**
         * WARNING — Amber semantic color.
         * Use for: caution actions, archive, review-required states
         */
        warning:
          "bg-warning-500 text-white border border-transparent " +
          "hover:bg-warning-600 " +
          "active:bg-warning-700 " +
          "disabled:bg-[var(--btn-primary-disabled-bg)] disabled:text-[var(--btn-primary-disabled-fg)]",

        /**
         * INFO — Blue semantic color.
         * Use for: informational triggers, help, learn more
         */
        info:
          "bg-info-500 text-white border border-transparent " +
          "hover:bg-info-600 " +
          "active:bg-info-700 " +
          "disabled:bg-[var(--btn-primary-disabled-bg)] disabled:text-[var(--btn-primary-disabled-fg)]",

        /**
         * LINK — Text only. No background.
         * Use for: inline text links that function as actions
         */
        link:
          "text-primary underline-offset-4 hover:underline " +
          "h-auto p-space-0 min-h-0 bg-transparent border-none " +
          "active:opacity-70 " +
          "disabled:text-[var(--btn-primary-disabled-fg)]",

        /**
         * ICON — Square/circle. Optimized for icon-only use.
         * Use for: toolbar icons, header actions, table row actions
         */
        icon:
          "bg-transparent text-muted-foreground border border-transparent " +
          "hover:text-foreground hover:bg-foreground/[0.06] " +
          "active:bg-foreground/[0.10] " +
          "data-[state=active]:text-foreground data-[state=active]:bg-foreground/[0.06] " +
          "disabled:text-[var(--btn-primary-disabled-fg)] disabled:bg-transparent",
      },

      // ─── Sizes ────────────────────────────────────────────────────
      // All heights, paddings, and font sizes reference design tokens.
      size: {
        /** Extra small — compact UI, table actions, tiny chips */
        xs: "h-space-7 px-space-2.5 text-caption [&_svg]:size-3",

        /** Small — secondary actions, filter buttons, sidebar items */
        sm: "h-space-8 px-space-3 text-caption [&_svg]:size-3.5",

        /** Medium/Default — standard CTA, form submits */
        md: "h-space-9 px-space-4 text-label [&_svg]:size-4",

        /** Default alias → md */
        default: "h-space-9 px-space-4 text-label [&_svg]:size-4",

        /** Large — hero CTA, primary dashboard action */
        lg: "h-space-10 px-space-6 text-body-sm [&_svg]:size-4",

        /** Extra large — marketing CTAs, hero sections */
        xl: "h-space-12 px-space-8 text-body-md [&_svg]:size-5",

        /** Icon square — equal H/W for icon-only buttons */
        icon: "h-space-9 w-space-9 p-space-0 [&_svg]:size-4 min-h-[var(--space-9)]",

        /** Icon small — compact icon actions */
        "icon-sm": "h-space-8 w-space-8 p-space-0 [&_svg]:size-3.5 min-h-[var(--space-8)]",

        /** Icon xs — ultra compact icon  */
        "icon-xs": "h-space-7 w-space-7 p-space-0 [&_svg]:size-3 min-h-[var(--space-7)]",

        /**
         * Responsive — adapts from mobile → tablet → desktop.
         * Use for hero CTAs and primary dashboard actions.
         */
        responsive:
          "h-space-9 md:h-space-10 lg:h-space-12 " +
          "px-space-4 md:px-space-6 lg:px-space-8 " +
          "text-label md:text-body-sm lg:text-body-md " +
          "[&_svg]:size-4 md:[&_svg]:size-4 lg:[&_svg]:size-5",
      },

      // ─── Shape ────────────────────────────────────────────────────
      shape: {
        /** Default — uses radius-md (matches design system card radius) */
        default: "radius-md",
        /** Rounded corners via design system token */
        rounded: "radius-lg",
        /** Fully round — for pill/tag style */
        pill: "radius-full",
        /** Circular — for icon-only round buttons */
        circle: "radius-full aspect-square",
        /** Sharp corners — for grouped button clusters */
        square: "rounded-none",
      },

      // ─── Width ────────────────────────────────────────────────────
      width: {
        auto: "",
        full: "w-full",
        fit: "w-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      width: "auto",
    },
  }
);

// ─── Props Interface ──────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component (e.g., Next.js Link) via Radix Slot */
  asChild?: boolean;
  /** Show loading spinner. Disables button and sets aria-busy */
  loading?: boolean;
  /** Show success state icon (replaces children briefly) */
  success?: boolean;
  /** Show error state icon (replaces children briefly) */
  error?: boolean;
  /** Mark as active/pressed state for tabs, toggles */
  active?: boolean;
  /** Mark as selected state for multi-select, segmented controls */
  selected?: boolean;
  /** Accessible label for screen readers (required for icon-only buttons) */
  "aria-label"?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      width,
      asChild = false,
      loading = false,
      success = false,
      error = false,
      active = false,
      selected = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const isDisabled = disabled || loading;

    // Determine current state for data attribute
    const dataState = active ? "active" : selected ? "selected" : undefined;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, width, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? true : undefined}
        aria-disabled={isDisabled ? true : undefined}
        aria-pressed={active ? true : selected ? false : undefined}
        data-state={dataState}
        data-loading={loading ? true : undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {/* Loading state — spinner with screen reader announcement */}
            {loading && (
              <>
                <Loader2
                  className="animate-spin"
                  aria-hidden="true"
                />
                <span className="sr-only">Loading</span>
              </>
            )}

            {/* Success state — green check */}
            {!loading && success && (
              <>
                <CheckCircle2
                  className="text-success-500"
                  aria-hidden="true"
                />
                <span className="sr-only">Success</span>
              </>
            )}

            {/* Error state — alert icon */}
            {!loading && error && (
              <>
                <AlertCircle
                  className="text-error-500"
                  aria-hidden="true"
                />
                <span className="sr-only">Error</span>
              </>
            )}

            {/* Children — always rendered (icons, text, etc.) */}
            {children}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
