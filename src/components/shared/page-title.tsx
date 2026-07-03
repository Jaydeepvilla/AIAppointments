import * as React from "react";
import { cn } from "./utils";

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

/**
 * Reusable page title block for dashboard pages.
 * Establishes consistent visual hierarchy: Title + optional description + optional actions.
 */
export function PageTitle({ title, description, actions, badge, className }: PageTitleProps) {
  return (
    <div className={cn("flex flex-col gap-space-1 sm:flex-row sm:items-center sm:justify-between sm:gap-space-4 mb-space-6", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-space-3">
          <h1 className="text-title-lg font-semibold text-foreground tracking-tight truncate">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="mt-space-1 text-body-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-space-2 shrink-0 mt-space-3 sm:mt-space-0">
          {actions}
        </div>
      )}
    </div>
  );
}
