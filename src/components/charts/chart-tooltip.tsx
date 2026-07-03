import * as React from"react"

export function ChartTooltip({ active, payload, label, formatter }: any) {
 if (active && payload && payload.length) {
 return (
 <div className="bg-background/90 backdrop-blur-md border border-[hsl(var(--foreground)/0.08)] p-space-3 radius-lg min-w-[140px] z-50">
 {label && <p className="text-caption text-muted-foreground font-medium mb-space-2">{label}</p>}
 <div className="flex flex-col gap-space-1.5">
 {payload.map((entry: any, index: number) => (
 <div key={index} className="flex items-center justify-between gap-space-4">
 <div className="flex items-center gap-space-2">
 <span className="w-2.5 h-2.5 radius-full"style={{ backgroundColor: entry.color }} />
 <span className="text-caption text-foreground">{entry.name}</span>
 </div>
 <span className="text-caption font-semibold tabular-nums text-foreground">
 {formatter ? formatter(entry.value, entry.name, entry) : entry.value}
 </span>
 </div>
 ))}
 </div>
 </div>
 )
 }
 return null
}
