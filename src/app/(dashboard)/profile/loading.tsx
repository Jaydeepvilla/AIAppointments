export default function ProfileLoading() {
  return (
    <div className="space-y-space-6 animate-pulse max-w-3xl">
      <div className="space-y-space-2">
        <div className="h-7 w-44 radius-md bg-muted" />
        <div className="h-4 w-72 radius-md bg-muted" />
      </div>
      <div className="radius-xl border border-border bg-card/30 p-space-6 space-y-space-5">
        <div className="flex items-center gap-space-4">
          <div className="h-16 w-16 radius-full bg-muted" />
          <div className="space-y-space-2 flex-1">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-space-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 radius-md bg-muted/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
