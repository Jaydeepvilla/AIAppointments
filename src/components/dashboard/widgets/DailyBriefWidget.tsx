"use client";

import { m } from "framer-motion";
import { hoverScale } from "@/components/motion/hover";
import { DailyBriefData } from "@/lib/dashboard-engine/daily-brief";
import {
 MessageSquare,
 CalendarCheck,
 AlertTriangle,
 Clock,
 TrendingUp,
 DollarSign,
} from "lucide-react";

interface DailyBriefWidgetProps {
 brief: DailyBriefData;
 businessName: string;
}

function BriefMetric({
 icon: Icon,
 value,
 label,
 colorClass,
}: {
 icon: React.ElementType;
 value: string | number;
 label: string;
 colorClass: string;
}) {
 return (
 <div className="flex items-center gap-space-3.5 min-w-0 p-space-4 radius-xl border border-border-subtle bg-bg-surface hover:-translate-y-0.5 hover:bg-bg-layer-1/40 hover:border-border-hover transition-all duration-200">
 <div
 className={`w-space-10 h-space-10 radius-lg flex items-center justify-center shrink-0 ${colorClass}`}
 >
 <Icon className="w-space-4.5 h-space-4.5" />
 </div>
 <div className="min-w-0">
 <p className="text-title-lg font-bold tabular-nums text-foreground leading-none">
 {value}
 </p>
 <p className="text-caption text-neutral-500 mt-space-1 truncate font-medium">
 {label}
 </p>
 </div>
 </div>
 );
}

function formatTimeSaved(minutes: number): string {
 if (minutes >= 60) {
 const h = Math.floor(minutes / 60);
 const m = minutes % 60;
 return m > 0 ? `${h}h ${m}m` : `${h}h`;
 }
 return `${minutes}m`;
}

function formatRevenue(amount: number): string {
 if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
 return `$${amount.toFixed(0)}`;
}

export function DailyBriefWidget({ brief, businessName }: DailyBriefWidgetProps) {
 const hour = new Date().getHours();
 const greeting =
 hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

 // Build a natural language summary
 const summaryParts: string[] = [];
 if (brief.conversationsHandled > 0) {
 summaryParts.push(
 `handled ${brief.conversationsHandled} conversation${brief.conversationsHandled !== 1 ? "s" : ""}`
 );
 }
 if (brief.appointmentsBooked > 0) {
 summaryParts.push(
 `booked ${brief.appointmentsBooked} appointment${brief.appointmentsBooked !== 1 ? "s" : ""}`
 );
 }
 if (brief.escalations > 0) {
 summaryParts.push(
 `escalated ${brief.escalations} to your team`
 );
 }
 if (brief.estimatedTimeSavedMinutes > 0) {
 summaryParts.push(
 `saved ${formatTimeSaved(brief.estimatedTimeSavedMinutes)} of staff time`
 );
 }

 const summaryText =
 summaryParts.length > 0
 ? `Your AI ${summaryParts.join(", ")}.`
 : "Your AI is ready and waiting for its first conversation today.";

 return (
 <section className="os-card radius-2xl overflow-hidden">
 {/* Header with gradient */}
 <div className="relative gradient-hero p-space-5 lg:p-space-6">
 <div className="mesh-glow absolute -top-space-24 -right-space-24 w-space-36 h-space-36 pointer-events-none" aria-hidden />
 <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-3">
 <div>
 <p className="text-caption font-semibold text-primary-500 uppercase tracking-widest mb-space-1">
 {greeting}
 </p>
 <h1 className="text-heading-lg text-foreground tracking-tight">
 {businessName}
 </h1>
 </div>
 <div className="flex items-center gap-space-2 bg-bg-layer-1 border border-border-subtle px-space-3 py-space-1.5 radius-full text-caption text-neutral-500 font-medium self-start sm:self-center">
 <span className="w-2 h-2 radius-full bg-success-500 animate-pulse-soft" />
 AI Receptionist Active
 </div>
 </div>

 {/* Natural language summary */}
 <p className="relative z-10 text-body-sm text-muted-foreground mt-space-3 max-w-prose leading-relaxed">
 {summaryText}
 </p>
 </div>

 {/* Key metric tiles */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-4 p-space-5 lg:p-space-6 border-t border-border-subtle bg-bg-layer-1/20">
 <BriefMetric
 icon={MessageSquare}
 value={brief.conversationsHandled}
 label="Conversations"
 colorClass="bg-primary/10 text-primary"
 />
 <BriefMetric
 icon={CalendarCheck}
 value={brief.appointmentsBooked}
 label="Booked"
 colorClass="bg-state-success-bg text-state-success-text"
 />
 <BriefMetric
 icon={AlertTriangle}
 value={brief.escalations}
 label="Escalations"
 colorClass="bg-state-warning-bg text-state-warning-text"
 />
 <BriefMetric
 icon={TrendingUp}
 value={`${brief.aiSuccessRate}%`}
 label="AI Success"
 colorClass="bg-state-success-bg text-state-success-text"
 />
 <BriefMetric
 icon={Clock}
 value={formatTimeSaved(brief.estimatedTimeSavedMinutes)}
 label="Time Saved"
 colorClass="bg-[hsl(var(--primary)/0.08)] text-primary"
 />
 <BriefMetric
 icon={DollarSign}
 value={formatRevenue(brief.revenueGenerated)}
 label="Revenue"
 colorClass="bg-state-success-bg text-state-success-text"
 />
 </div>
 </section>
 );
}
