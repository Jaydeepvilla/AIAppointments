import * as React from "react";
import { cn } from "./utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Reusable section header within a page.
 * Smaller than PageTitle — used for card groups, tab content, form sections.
 */
export function SectionHeader({ title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-space-4 mb-space-4", className)}>
      <div className="min-w-0">
        <h2 className="text-body-md font-medium text-foreground tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-space-1 text-caption text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-space-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
