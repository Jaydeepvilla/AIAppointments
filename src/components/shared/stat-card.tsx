import * as React from"react";
import { LucideIcon } from"lucide-react";
import { cn } from"./utils";
import { SparklineCard } from"@/components/charts"

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
 label: string;
 value: string | number;
 icon?: LucideIcon;
 trend?: {
 value: string;
 positive?: boolean;
 };
 subtitle?: string;
 chartData?: any[];
 chartCategories?: string[];
 chartColors?: string[];
}

/**
 * Premium stat/metric card for dashboards.
 * Uses the .stat-card CSS class from globals.css.
 */
export function StatCard({ label, value, icon: Icon, trend, subtitle, chartData, chartCategories, chartColors, className, ...props }: StatCardProps) {
 return (
 <div
 className={cn(
 "stat-card relative overflow-hidden radius-xl p-space-5 flex flex-col gap-space-4 border border-border-default bg-white dark:bg-card hover:border-border-hover transition-all duration-200",
 className
 )}
 {...props}
 >
 <div className="flex items-center justify-between z-10 relative">
 <span className="text-caption text-muted-foreground font-medium tracking-wide">
 {label}
 </span>
 {Icon && (
 <div className="flex h-8 w-8 items-center justify-center radius-md bg-black/5 dark:bg-white/10 text-foreground">
 <Icon className="h-4 w-4"/>
 </div>
 )}
 </div>

 <div className="flex items-end justify-between gap-space-4 z-10 relative mt-auto">
 <div className="flex flex-col gap-space-1">
 <div className="flex items-end gap-space-2">
 <span className="text-title-xl font-semibold text-foreground tracking-tight leading-none">
 {value}
 </span>
 {trend && (
 <span
 className={cn(
 "text-body-sm font-medium leading-none mb-space-1",
 trend.positive ?"text-success-600 dark:text-success-500":"text-error-600 dark:text-error-500"
 )}
 >
 {trend.positive ?"↑":"↓"} {trend.value}
 </span>
 )}
 </div>
 {subtitle && (
 <span className="text-caption text-muted-foreground">{subtitle}</span>
 )}
 </div>
 
 {chartData && chartCategories && (
 <div className="shrink-0 -mb-space-2 opacity-80">
 <SparklineCard 
 data={chartData} 
 categories={chartCategories} 
 colors={chartColors}
 height={36} 
 />
 </div>
 )}
 </div>
 </div>
 );
}
