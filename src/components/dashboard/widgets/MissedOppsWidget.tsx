"use client";

import { GlobalGapAnalysis } from "@/lib/gap-analysis-engine";
import { Card } from "@/components/shared/card";
import { NativeButton } from "@/components/shared/native";
import Link from "next/link";
import {
  Target,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Package,
  Users,
  FileText,
  Plug,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/components/shared/utils";
import { useState } from "react";

interface MissedOppsWidgetProps {
  gapAnalysis: GlobalGapAnalysis;
}

const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; label: string; href: string; color: string; iconBg: string }
> = {
  businessInfo: { icon: Building2, label: "Business Info", href: "/profile", color: "text-violet-500 dark:text-violet-400", iconBg: "bg-violet-500/10" },
  services:     { icon: Package,   label: "Services",      href: "/services", color: "text-primary",                          iconBg: "bg-primary/10" },
  staff:        { icon: Users,     label: "Staff",          href: "/staff",    color: "text-sky-500 dark:text-sky-400",        iconBg: "bg-sky-500/10" },
  documents:    { icon: FileText,  label: "Knowledge",     href: "/kb",       color: "text-emerald-500 dark:text-emerald-400",iconBg: "bg-emerald-500/10" },
  integrations: { icon: Plug,      label: "Integrations",  href: "/channels", color: "text-amber-500 dark:text-amber-400",   iconBg: "bg-amber-500/10" },
};

export function MissedOppsWidget({ gapAnalysis }: MissedOppsWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const { totalMissingItems, breakdown } = gapAnalysis;

  const categories = Object.entries(breakdown)
    .map(([key, result]) => {
      const meta = CATEGORY_META[key] ?? {
        icon: AlertTriangle,
        label: key,
        href: "#",
        color: "text-amber-500",
        iconBg: "bg-amber-500/10",
      };
      return { key, ...meta, missing: result.missingItems, score: result.score };
    })
    .filter((c) => c.missing.length > 0)
    .sort((a, b) => a.score - b.score);

  const visibleCategories = expanded ? categories : categories.slice(0, 3);

  if (totalMissingItems === 0) {
    return (
      <Card className="h-full p-space-5 flex flex-col items-center justify-center text-center gap-space-3 border border-[hsl(var(--foreground)/0.07)]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <p className="text-body-sm font-bold text-foreground">No Gaps Found</p>
          <p className="text-[11px] text-muted-foreground/60 mt-1">Your business is fully configured.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border border-[hsl(var(--foreground)/0.07)]">
      <div className="p-space-5 flex flex-col gap-space-4 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-2">
            <div className="h-7 w-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Target className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest">
              Missing Requirements
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {totalMissingItems} total
          </span>
        </div>

        {/* Categorized missing items */}
        <div className="space-y-space-2 flex-1">
          {visibleCategories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={cat.key}
                href={cat.href}
                className="flex items-center gap-space-3 p-space-3 rounded-xl border border-[hsl(var(--foreground)/0.05)] bg-[hsl(var(--foreground)/0.01)] hover:border-[hsl(var(--foreground)/0.10)] hover:bg-[hsl(var(--foreground)/0.03)] transition-all duration-200 group"
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cat.iconBg)}>
                  <IconComp className={cn("w-4 h-4", cat.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-body-sm font-semibold text-foreground">{cat.label}</p>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5 truncate">
                    {cat.missing.slice(0, 2).join(" · ")}
                    {cat.missing.length > 2 && ` +${cat.missing.length - 2} more`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Expand/Collapse */}
        {categories.length > 3 && (
          <NativeButton
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors pt-space-1"
          >
            {expanded ? (
              <>Show less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show all {categories.length} categories <ChevronDown className="w-3 h-3" /></>
            )}
          </NativeButton>
        )}
      </div>
    </Card>
  );
}
