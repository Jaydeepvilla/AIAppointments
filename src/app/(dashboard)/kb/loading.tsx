export default function LoadingPage() {
  return (
    <div className="space-y-space-6 animate-pulse max-w-4xl">
      <div className="space-y-space-2">
        <div className="h-8 w-52 radius-md bg-muted" />
        <div className="h-4 w-80 radius-md bg-muted" />
      </div>
      <div className="radius-xl border border-border bg-card/30 p-space-6 space-y-space-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 radius-lg bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
