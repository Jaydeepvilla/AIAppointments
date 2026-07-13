"use client";

import { SetupProgressItem } from "@/lib/dashboard-engine/index";
import { Card } from "@/components/shared/card";
import { ScoreRing } from "../shared/score-ring";
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Trophy,
  Rocket,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/components/shared/utils";

interface SetupProgressWidgetProps {
  progress: {
    completed: number;
    total: number;
    percentage: number;
    remainingMinutes: number;
    items: SetupProgressItem[];
  };
}

function getProgressTier(pct: number) {
  if (pct === 100) return { label: "Fully Operational", icon: Trophy, colorClass: "text-emerald-500", bg: "bg-emerald-500/10" };
  if (pct >= 70)   return { label: "Almost There",      icon: Rocket, colorClass: "text-amber-500",   bg: "bg-amber-500/10"  };
  return              { label: "Getting Started",       icon: Zap,    colorClass: "text-primary",      bg: "bg-primary/10"    };
}

const getImpactMessage = (pct: number) => {
  if (pct === 100) return "Your AI receptionist is fully optimized to capture every opportunity.";
  if (pct >= 70)   return "Nearly there! A few more steps unlock maximum booking automation.";
  if (pct >= 40)   return "Adding services & hours will unlock automatic booking features.";
  return "Complete setup to activate your AI and stop missing caller opportunities.";
};

export function SetupProgressWidget({ progress }: SetupProgressWidgetProps) {
  const { completed, total, percentage, remainingMinutes, items } = progress;
  const tier = getProgressTier(percentage);
  const TierIcon = tier.icon;

  const incomplete = items.filter((i) => !i.completed);
  const done       = items.filter((i) => i.completed);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-space-5 pt-space-5 pb-space-3">
        <div className="flex items-center gap-space-2">
          <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", tier.bg)}>
            <TierIcon className={cn("w-3.5 h-3.5", tier.colorClass)} />
          </div>
          <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest">
            Setup Journey
          </p>
        </div>
        {remainingMinutes > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/60 bg-muted/60 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            ~{remainingMinutes}m left
          </span>
        )}
      </div>

      <div className="h-px bg-border mx-space-5 mb-space-3" />

      {/* Hero progress block */}
      <div className="mx-space-4 mb-space-3 rounded-xl border border-border/60 bg-muted/30 p-space-4 flex items-center gap-space-4">
        <ScoreRing score={percentage} size={64} color="var(--primary-500)" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-space-1.5 mb-space-0.5">
            <span className={cn("text-[11px] font-bold uppercase tracking-wide", tier.colorClass)}>
              {tier.label}
            </span>
          </div>
          <p className="text-[12px] font-semibold text-foreground">
            {completed}/{total} steps done
          </p>
          <p className="text-[11px] text-muted-foreground/60 leading-snug mt-0.5 line-clamp-2">
            {getImpactMessage(percentage)}
          </p>
        </div>
      </div>

      {/* Steps list */}
      <div className="flex-1 px-space-4 pb-space-2 space-y-space-1 overflow-auto">
        {/* Incomplete items first */}
        {incomplete.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center justify-between p-space-2.5 rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/40 transition-all group"
          >
            <div className="flex items-center gap-space-3 min-w-0">
              <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0 group-hover:text-primary transition-colors duration-150" />
              <div className="min-w-0">
                <span className="text-[12px] font-semibold text-foreground block truncate">
                  {item.label}
                </span>
                <span className="text-[10px] text-muted-foreground/55 line-clamp-1">
                  {item.description}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-2 shrink-0">
              <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                ~{item.estimatedTimeMinutes}m
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 transition-all duration-150" />
            </div>
          </Link>
        ))}

        {/* Completed items */}
        {done.length > 0 && (
          <>
            {incomplete.length > 0 && (
              <div className="flex items-center gap-2 py-space-1.5">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  Completed
                </span>
                <div className="flex-1 h-px bg-border/40" />
              </div>
            )}
            {done.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between px-space-2.5 py-space-2 rounded-lg border border-transparent hover:bg-muted/30 transition-all group"
              >
                <div className="flex items-center gap-space-3 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[12px] font-medium text-muted-foreground/50 line-through block truncate">
                    {item.label}
                  </span>
                </div>
                <ArrowRight className="w-3 h-3 text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors" />
              </Link>
            ))}
          </>
        )}
      </div>
    </Card>
  );
}
