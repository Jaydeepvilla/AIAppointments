"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/components/shared/utils";
import { analyzePasswordStrength } from "@/lib/auth/security-checks";

// ── Score → semantic color map ──────────────────────────────────────────────
// All values come from design token names mapped in globals.css @theme.
const STRENGTH_SEGMENTS = [
  { fill: "bg-state-error-text",   label: "Very weak" },
  { fill: "bg-warning-500",        label: "Weak"      },
  { fill: "bg-warning-500",        label: "Fair"      },
  { fill: "bg-success-500",        label: "Good"      },
  { fill: "bg-success-500",        label: "Strong"    },
];

const STRENGTH_TEXT_COLORS = [
  "text-state-error-text",
  "text-warning-500",
  "text-warning-500",
  "text-success-500",
  "text-success-500",
];

interface Requirement {
  label: string;
  met: boolean;
}

function getRequirements(password: string): Requirement[] {
  return [
    { label: "12+ characters",               met: password.length >= 12 },
    { label: "Uppercase letter",             met: /[A-Z]/.test(password) },
    { label: "Lowercase letter",             met: /[a-z]/.test(password) },
    { label: "Number",                       met: /[0-9]/.test(password) },
    { label: "Special character (!@#$…)",    met: /[!@#$%^&*()_+\-=\[\]{};':",.<>?/\\|]/.test(password) },
  ];
}

interface PasswordStrengthProps {
  password: string;
  /** Optional context fields for smarter scoring */
  email?: string;
  firstName?: string;
  lastName?: string;
  className?: string;
}

/**
 * PasswordStrength
 *
 * Visual password strength meter + requirements checklist.
 * Animates in when the password field has content.
 * Uses only design system semantic tokens.
 */
export function PasswordStrength({
  password,
  email,
  firstName,
  lastName,
  className,
}: PasswordStrengthProps) {
  const strength = React.useMemo(
    () => analyzePasswordStrength(password, email, firstName, lastName),
    [password, email, firstName, lastName]
  );

  const requirements = getRequirements(password);

  if (!password) return null;

  const score = Math.min(strength.score, 5); // 0–5
  const segment = STRENGTH_SEGMENTS[Math.max(0, score - 1)] ?? STRENGTH_SEGMENTS[0];
  const textColor = STRENGTH_TEXT_COLORS[Math.max(0, score - 1)] ?? STRENGTH_TEXT_COLORS[0];

  return (
    <div
      className={cn(
        "space-y-space-3 p-space-3 radius-lg border border-border-default bg-bg-layer-1 animate-fade-in",
        className
      )}
    >
      {/* ── Score header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-foreground/40 font-medium">Password strength</span>
        <span className={cn("text-caption font-semibold", textColor)}>
          {score === 0 ? "None" : segment.label}
        </span>
      </div>

      {/* ── Segmented progress bar ───────────────────────────────── */}
      <div className="grid grid-cols-5 gap-space-1" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={5}>
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 radius-full transition-all duration-moderate",
              level <= score ? segment.fill : "bg-border-strong"
            )}
          />
        ))}
      </div>

      {/* ── Requirements checklist ───────────────────────────────── */}
      <ul className="space-y-space-1.5" aria-label="Password requirements">
        {requirements.map(({ label, met }) => (
          <li key={label} className="flex items-center gap-space-2">
            <span
              className={cn(
                "flex h-3.5 w-3.5 shrink-0 items-center justify-center radius-full border transition-all duration-fast",
                met
                  ? "bg-success-500 border-success-500"
                  : "bg-transparent border-border-strong"
              )}
              aria-hidden="true"
            >
              {met && <Check className="h-2 w-2 text-primary-foreground" strokeWidth={3} />}
            </span>
            <span
              className={cn(
                "text-caption transition-colors duration-fast",
                met ? "text-foreground/60" : "text-foreground/35"
              )}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>

      {/* ── Improvement suggestions ──────────────────────────────── */}
      {score < 4 && strength.suggestions.length > 0 && (
        <ul className="border-t border-border-subtle pt-space-2 space-y-space-1">
          {strength.suggestions.map((s, i) => (
            <li key={i} className="text-caption text-foreground/40 flex items-start gap-space-1.5">
              <span className="text-primary shrink-0">·</span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
