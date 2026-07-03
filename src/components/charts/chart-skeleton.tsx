import * as React from "react"
import { cn } from "@/components/shared/utils"

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-full flex items-end justify-between gap-space-2 p-space-4 animate-pulse", className)}>
      <div className="w-1/6 h-1/3 bg-black/5 dark:bg-white/10 radius-sm" />
      <div className="w-1/6 h-2/3 bg-black/5 dark:bg-white/10 radius-sm" />
      <div className="w-1/6 h-1/2 bg-black/5 dark:bg-white/10 radius-sm" />
      <div className="w-1/6 h-3/4 bg-black/5 dark:bg-white/10 radius-sm" />
      <div className="w-1/6 h-1/4 bg-black/5 dark:bg-white/10 radius-sm" />
      <div className="w-1/6 h-full bg-black/5 dark:bg-white/10 radius-sm" />
    </div>
  )
}
