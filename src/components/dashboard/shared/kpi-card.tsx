import { ReactNode } from "react";
import { ScoreRing } from "./score-ring";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/components/shared/utils";

interface KPICardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  score: number;
  statusLabel?: string;
  statusTextClass?: string;
  alertCount?: number;
  alertText?: string;
  alertIcon?: LucideIcon;
  alertType?: "error" | "warning" | "success" | "info";
  metaText?: string;
  children?: ReactNode;
  className?: string;
  color?: string;
}

export function KPICard({
  title,
  href,
  icon: Icon,
  score,
  statusLabel,
  statusTextClass,
  alertCount = 0,
  alertText = "issue",
  alertIcon: AlertIcon,
  alertType = "warning",
  metaText,
  children,
  className,
  color,
}: KPICardProps) {
  const resolvedStatusLabel = statusLabel ?? ScoreRing.label(score);
  const resolvedStatusTextClass = statusTextClass ?? ScoreRing.textClass(score);

  const alertBg =
    alertType === "error"   ? "bg-rose-500/8 border-rose-500/20 text-rose-500 dark:text-rose-400" :
    alertType === "warning" ? "bg-amber-500/8 border-amber-500/20 text-amber-600 dark:text-amber-400" :
    alertType === "success" ? "bg-emerald-500/8 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
    "bg-neutral-100 dark:bg-neutral-800 border-border-subtle text-neutral-500";

  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-[hsl(var(--foreground)/0.07)] bg-card cursor-pointer group",
        "hover:border-[hsl(var(--foreground)/0.14)] hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="flex flex-col flex-1 p-space-5 gap-space-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-2">
            <div className={cn(
              "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
              score >= 90 ? "bg-emerald-500/10" :
              score >= 70 ? "bg-amber-500/10" :
              "bg-rose-500/10"
            )}>
              <Icon className={cn("w-3.5 h-3.5", resolvedStatusTextClass)} />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest">
              {title}
            </p>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>

        {/* Score Ring + Primary Stats */}
        <div className="flex items-center gap-space-4">
          <div className="shrink-0">
            <ScoreRing score={score} size={72} color={color} />
          </div>
          <div className="flex-1 min-w-0 space-y-space-1.5">
            <span className={cn("text-body-sm font-bold block leading-snug", resolvedStatusTextClass)}>
              {resolvedStatusLabel}
            </span>
            {metaText && (
              <p className="text-[11px] text-muted-foreground/60 leading-snug">
                {metaText}
              </p>
            )}
            {alertCount > 0 && (
              <div className={cn(
                "inline-flex items-center gap-space-1 px-space-2 py-space-0.5 rounded-full border text-[11px] font-semibold",
                alertBg
              )}>
                {AlertIcon && <AlertIcon className="w-3 h-3 shrink-0" />}
                <span>{alertCount} {alertText}{alertCount !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom metrics slot */}
        {children && (
          <div className="mt-auto">
            {children}
          </div>
        )}
      </div>
    </Link>
  );
}
