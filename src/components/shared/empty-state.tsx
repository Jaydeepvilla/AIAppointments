import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
                  "flex min-h-80 flex-col items-center justify-center radius-xl border border-[hsl(var(--foreground)/0.05)] bg-[hsl(var(--foreground)/0.015)] p-space-12 text-center animate-fade-in relative overflow-hidden",
                  className
                )}
      {...props}
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-space-0 left-space-1/2 -translate-x-space-1/2 w-72 h-48 bg-[radial-gradient(ellipse,hsl(var(--primary)/0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Icon container */}
      <div className="relative flex h-12 w-12 items-center justify-center radius-xl bg-[hsl(var(--primary)/0.08)] text-primary ring-1 ring-[hsl(var(--primary)/0.10)]">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <h3 className="mt-space-5 text-body-md font-medium text-foreground tracking-tight">{title}</h3>
      <p className="mt-space-2 max-w-sm text-body-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Actions */}
      {(actionText || secondaryActionText) && (
        <div className="mt-space-6 flex items-center gap-space-3">
          {actionText && onAction && (
            <Button onClick={onAction} size="sm">
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="ghost" size="sm">
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
