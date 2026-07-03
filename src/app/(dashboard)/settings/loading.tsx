export default function SettingsLoading() {
  return (
    <div className="space-y-space-6 animate-pulse max-w-4xl">
      <div className="space-y-space-2">
        <div className="h-7 w-52 radius-md bg-muted" />
        <div className="h-4 w-80 radius-md bg-muted" />
      </div>
      {/* Tab bar skeleton */}
      <div className="flex gap-space-2 border-b border-border pb-space-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-8 radius-md bg-muted ${i === 0 ? "w-28" : "w-20"}`} />
        ))}
      </div>
      <div className="space-y-space-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-space-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-10 radius-md bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
