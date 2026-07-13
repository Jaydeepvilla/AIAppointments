"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import dynamic from 'next/dynamic'
const ChartTooltip = dynamic(() => import('./chart-tooltip').then(m => m.ChartTooltip), { ssr: false })
const ChartSkeleton = dynamic(() => import('./chart-skeleton').then(m => m.ChartSkeleton), { ssr: false })
const ChartEmptyState = dynamic(() => import('./chart-empty-state').then(m => m.ChartEmptyState), { ssr: false })
const ChartLegend = dynamic(() => import('./chart-legend').then(m => m.ChartLegend), { ssr: false })

export interface DonutChartCardProps {
  data: any[]
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  valuePrefix?: string
  valueSuffix?: string
  height?: number
  loading?: boolean
  emptyMessage?: string
  showLegend?: boolean
  variant?: "donut" | "pie"
}

const defaultColors = [
  "hsl(var(--primary))",
  "hsl(var(--foreground)/0.4)",
  "#10b981", 
  "#f59e0b",
  "#ef4444"
]

export function DonutChartCard({
  data,
  category,
  index,
  colors = defaultColors,
  valueFormatter,
  valuePrefix = "",
  valueSuffix = "",
  height = 300,
  loading,
  emptyMessage,
  showLegend = true,
  variant = "donut"
}: DonutChartCardProps) {
  const formatter = React.useCallback(
    (v: number) => valueFormatter ? valueFormatter(v) : `${valuePrefix}${v}${valueSuffix}`,
    [valueFormatter, valuePrefix, valueSuffix]
  );

  if (loading) return <div style={{ height }}><ChartSkeleton /></div>
  if (!data || data.length === 0) return <div style={{ height }}><ChartEmptyState message={emptyMessage} /></div>

  return (
    <div style={{ height }} className="w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Tooltip content={<ChartTooltip formatter={formatter} />} />
          {showLegend && <Legend content={<ChartLegend />} layout="horizontal" verticalAlign="bottom" />}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={variant === "donut" ? "60%" : "0%"}
            outerRadius="80%"
            paddingAngle={variant === "donut" ? 2 : 0}
            dataKey={category}
            nameKey={index}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
