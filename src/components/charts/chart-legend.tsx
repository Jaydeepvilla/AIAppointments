import * as React from "react"
import { cn } from "@/components/shared/utils"

export function ChartLegend({ payload, className }: any) {
  if (!payload || !payload.length) return null

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-space-4 pt-space-4", className)}>
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-space-2">
          <span 
            className="w-2.5 h-2.5 radius-full shrink-0" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-caption text-muted-foreground font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
