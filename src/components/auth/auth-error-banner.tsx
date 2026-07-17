"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/components/shared/utils";

interface AuthErrorBannerProps {
  message: string | null;
  className?: string;
  /** Optionally render a contextual action below the message */
  action?: React.ReactNode;
}

/**
 * AuthErrorBanner
 *
 * Inline animated error state for form-level errors.
 * Never uses browser alert(). Uses design system state error tokens.
 */
export function AuthErrorBanner({ message, className, action }: AuthErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        "flex items-start gap-space-3 animate-fade-in",
        "bg-state-error-bg border border-state-error-text/20",
        "text-state-error-text px-space-4 py-space-3 radius-xl",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-state-error-text" aria-hidden="true" />
      <div className="space-y-space-1">
        <p className="text-caption font-semibold leading-normal">{message}</p>
        {action && <div className="text-caption">{action}</div>}
      </div>
    </div>
  );
}

interface AuthFieldErrorProps {
  message: string | null;
  id?: string;
  className?: string;
}

/**
 * AuthFieldError
 *
 * Inline per-field validation error message.
 * Accessible: pair with aria-describedby on the input.
 */
export function AuthFieldError({ message, id, className }: AuthFieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "flex items-center gap-space-1 text-caption text-state-error-text font-medium animate-fade-in",
        className
      )}
    >
      <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
