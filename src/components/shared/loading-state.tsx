import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function LoadingState({ message = "Loading details...", className, ...props }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={message}
      className={cn(
                  "flex min-h-64 w-full flex-col items-center justify-center p-space-8 text-center animate-fade-in",
                  className
                )}
      {...props}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
      <p className="mt-space-3 text-body-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("radius-md bg-[hsl(var(--foreground)/0.04)] animate-shimmer", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ─── Contextual Skeleton Presets ──────────────────────────────────────────── */

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("radius-xl border border-[hsl(var(--foreground)/0.06)] p-space-6 space-y-space-4", className)} {...props}>
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-8 w-3/5" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className, ...props }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn("space-y-space-2", className)} {...props}>
      {/* Header */}
      <div className="flex gap-space-4 py-space-3 border-b border-[hsl(var(--foreground)/0.06)]">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/5" />
        <Skeleton className="h-3 w-1/6" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-space-4 py-space-3">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/5" />
          <Skeleton className="h-3 w-1/6" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ rows = 4, className, ...props }: SkeletonProps & { rows?: number }) {
  return (
    <div className={cn("space-y-space-3", className)} {...props}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-space-3">
          <Skeleton className="h-9 w-9 radius-md shrink-0" />
          <div className="flex-1 space-y-space-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
