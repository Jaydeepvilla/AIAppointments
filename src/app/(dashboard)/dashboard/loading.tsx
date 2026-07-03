import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="space-y-space-8 animate-pulse max-w-4xl">
      {/* Header skeleton */}
      <div className="space-y-space-2">
        <div className="h-8 w-64 radius-md bg-muted" />
        <div className="h-4 w-96 radius-md bg-muted" />
      </div>

      {/* Progress card skeleton */}
      <div className="radius-xl border border-border bg-card/30 p-space-6">
        <div className="flex justify-between items-center gap-space-6">
          <div className="space-y-space-3 flex-1">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-7 w-72 rounded bg-muted" />
            <div className="h-4 w-96 rounded bg-muted" />
          </div>
          <div className="h-24 w-24 radius-full border-4 border-muted bg-card shrink-0" />
        </div>
        <div className="mt-space-6 h-2 w-full radius-full bg-muted" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-space-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 radius-xl border border-border bg-card/30" />
        ))}
      </div>
    </div>
  );
}
