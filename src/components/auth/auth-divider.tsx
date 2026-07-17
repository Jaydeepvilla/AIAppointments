import * as React from "react";
import { cn } from "@/components/shared/utils";

interface AuthDividerProps {
  label?: string;
  className?: string;
}

/**
 * AuthDivider
 *
 * "or continue with" / "or" divider line between social and email sections.
 * Uses design system border tokens only.
 */
export function AuthDivider({ label = "or continue with", className }: AuthDividerProps) {
  return (
    <div className={cn("flex items-center gap-space-3", className)} role="separator">
      <div className="flex-1 h-px bg-border-default" />
      <span className="text-caption text-foreground/30 font-medium whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  );
}
