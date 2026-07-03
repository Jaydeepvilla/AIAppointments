export default function FaqsLoading() {
  return (
    <div className="space-y-space-6 animate-pulse max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="space-y-space-2">
          <div className="h-7 w-36 radius-md bg-muted" />
          <div className="h-4 w-80 radius-md bg-muted" />
        </div>
        <div className="h-9 w-28 radius-md bg-muted" />
      </div>
      <div className="space-y-space-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 radius-xl border border-border bg-card/30" />
        ))}
      </div>
    </div>
  );
}
