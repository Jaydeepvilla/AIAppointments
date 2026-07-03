import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorState({
  title = "An error occurred",
  description = "Something went wrong while retrieving the details. Please try again.",
  actionText = "Try Again",
  onAction,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
                  "flex min-h-80 flex-col items-center justify-center radius-xl border border-destructive/15 bg-destructive/5 p-space-10 text-center animate-fade-in",
                  className
                )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center radius-xl bg-destructive/10 text-destructive ring-1 ring-destructive/10">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="mt-space-5 text-body-md font-medium text-foreground tracking-tight">{title}</h3>
      <p className="mt-space-2 max-w-sm text-body-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} className="mt-space-6" variant="destructive" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
