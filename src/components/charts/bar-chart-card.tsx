"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartTooltip } from "./chart-tooltip"
import { ChartSkeleton } from "./chart-skeleton"
import { ChartEmptyState } from "./chart-empty-state"
import { ChartLegend } from "./chart-legend"

export interface BarChartCardProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  valuePrefix?: string
  valueSuffix?: string
  height?: number
  loading?: boolean
  emptyMessage?: string
  showLegend?: boolean
  stacked?: boolean
  layout?: "horizontal" | "vertical"
}

const defaultColors = [
  "hsl(var(--primary))",
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
]

export function BarChartCard({
  data,
  index,
  categories,
  colors = defaultColors,
  valueFormatter,
  valuePrefix = "",
  valueSuffix = "",
  height = 300,
  loading,
  emptyMessage,
  showLegend = false,
  stacked = false,
  layout = "horizontal"
}: BarChartCardProps) {
  const formatter = React.useCallback(
    (v: number) => valueFormatter ? valueFormatter(v) : `${valuePrefix}${v}${valueSuffix}`,
    [valueFormatter, valuePrefix, valueSuffix]
  );

  if (loading) return <div style={{ height }}><ChartSkeleton /></div>
  if (!data || data.length === 0) return <div style={{ height }}><ChartEmptyState message={emptyMessage} /></div>

  return (
    <div style={{ height }} className="w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout={layout}
          margin={{ top: 10, right: 10, left: layout === "vertical" ? 0 : -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={layout === "vertical"} horizontal={layout === "horizontal"} stroke="hsl(var(--foreground)/0.06)" />
          {layout === "horizontal" ? (
            <>
              <XAxis dataKey={index} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground)/0.5)", fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground)/0.5)", fontSize: 12 }} tickFormatter={formatter} />
            </>
          ) : (
            <>
              <YAxis type="category" dataKey={index} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground)/0.5)", fontSize: 12 }} width={140} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground)/0.5)", fontSize: 12 }} tickFormatter={formatter} />
            </>
          )}
          <Tooltip cursor={{ fill: "hsl(var(--foreground)/0.03)" }} content={<ChartTooltip formatter={formatter} />} />
          {showLegend && <Legend content={<ChartLegend />} />}
          {categories.map((cat, i) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId={stacked ? "a" : undefined}
              fill={colors[i % colors.length]}
              radius={stacked ? [0, 0, 0, 0] : (layout === "horizontal" ? [4, 4, 0, 0] : [0, 4, 4, 0])}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
