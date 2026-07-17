import * as React from "react";
import { AuthShowcasePanel, MobileShowcaseCarousel } from "./auth-showcase-panel";
import { AuthFooter } from "./auth-footer";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout — Premium 60 / 40 split
 *
 * Desktop (≥1024px)
 *   LEFT  60% — Sticky brand showcase. Deep primary background. Logo,
 *               headline, floating white cards, carousel dots, trust row.
 *   RIGHT 40% — Clean form column. bg-background. Full whitespace.
 *
 * Mobile / Tablet
 *   Compact primary brand header above the form.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        /* Force light-mode tokens regardless of ThemeProvider on <html> */
        "--background": "250 20% 99%",
        "--foreground": "222 47% 8%",
        "--card": "250 15% 98%",
        "--card-foreground": "222 47% 8%",
        "--primary": "250 75% 52%",
        "--primary-light": "250 75% 58%",
        "--primary-foreground": "0 0% 100%",
        "--border": "250 12% 91%",
        "--input": "250 12% 91%",
        "--border-subtle": "250 12% 94%",
        "--border-default": "250 12% 88%",
        "--border-strong": "250 12% 82%",
        "--border-hover": "250 12% 76%",
        "--border-active": "250 75% 52%",
        "--border-muted": "250 12% 91%",
        "--bg-layer-0": "250 20% 99%",
        "--bg-layer-1": "0 0% 100%",
        "--bg-layer-2": "250 12% 95%",
        "--state-success-text": "154 75% 24%",
        "--state-success-bg": "147 79% 96%",
        "--state-error-text": "3 76% 40%",
        "--state-error-bg": "6 100% 97%",
        "--state-warning-text": "21 90% 37%",
        "--state-warning-bg": "33 100% 96%",
      } as React.CSSProperties}
    >

      {/* ── LEFT: Brand showcase ─────────────────────────────────────── */}
      <aside
        className="hidden lg:flex lg:w-[60%] sticky top-0 h-screen overflow-hidden flex-col"
        aria-label="Operator brand showcase"
      >
        <AuthShowcasePanel />
      </aside>

      {/* ── RIGHT: Form column ───────────────────────────────────────── */}
      <main
        className="relative flex flex-col w-full lg:w-[40%] min-h-screen bg-background overflow-hidden"
        id="auth-form-panel"
      >
        {/* Subtle ambient orb — does not compete with the form */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full mesh-glow opacity-25 animate-pulse-soft"
          style={{ animationDuration: "8s" }}
          aria-hidden="true"
        />

        {/* Mobile brand header */}
        <div className="block lg:hidden" aria-hidden="true">
          <MobileShowcaseCarousel />
        </div>

        {/* Form — vertically centered */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-space-8 py-space-12 sm:px-space-12 lg:px-space-14 xl:px-space-16">
          <div className="w-full max-w-[360px] mx-auto">
            {children}
          </div>
        </div>

        <AuthFooter className="relative z-10" />
      </main>
    </div>
  );
}
