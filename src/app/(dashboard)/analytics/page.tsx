"use client";

import { useState, useEffect } from"react";
import { getAnalyticsAction } from"@/server/actions/admin";
import {
 BarChart3,
 Clock,
 TrendingUp,
 MessageSquare,
 AlertTriangle,
 Star,
 Users,
 Compass,
 Activity,
 Award,
 RotateCw,
 Loader2,
 Calendar,
 ChevronUp,
 Percent,
} from"lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from"@/components/shared/card";
import { Button } from"@/components/shared/button";
import { PageTitle } from"@/components/shared/page-title";
import { StatCard } from"@/components/shared/stat-card";
import { cn } from"@/components/shared/utils";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/shared/select";
import { AreaChartCard, BarChartCard, DonutChartCard } from"@/components/charts";

function SkeletonCard() {
 return (
 <div className="radius-xl border border-[hsl(var(--foreground)/0.06)] bg-card p-space-5 space-y-space-3 soft-">
 <div className="skeleton h-3.5 w-20 rounded"/>
 <div className="skeleton h-8 w-16 rounded"/>
 <div className="skeleton h-3 w-28 rounded"/>
 </div>
 );
}

export default function AnalyticsPage() {
 const [data, setData] = useState<any | null>(null);
 const [loading, setLoading] = useState(true);
 const [errorMsg, setErrorMsg] = useState("");
 const [timeframe, setTimeframe] = useState("all");

 const loadAnalytics = async () => {
 try {
 setLoading(true);
 const res = await getAnalyticsAction();
 if (res.success && res.data) {
 setData(res.data);
 } else {
 setErrorMsg(res.error ||"Failed to load analytics data");
 }
 } catch (e: any) {
 setErrorMsg(e.message ||"An unexpected error occurred");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadAnalytics();
 }, []);

 if (loading) {
 return (
 <div className="space-y-space-4 animate-fade-in w-full pb-space-8">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-3 pb-space-2 border-b border-[hsl(var(--foreground)/0.06)] shrink-0">
 <div className="space-y-space-1">
 <div className="skeleton h-6 w-32 rounded"/>
 <div className="skeleton h-3.5 w-64 rounded"/>
 </div>
 </div>
 
 {/* KPI Row */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-4 shrink-0">
 {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
 </div>

 {/* Charts block */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-4">
 <div className="skeleton radius-xl border border-[hsl(var(--foreground)/0.06)] bg-card soft- h-full"/>
 <div className="skeleton radius-xl border border-[hsl(var(--foreground)/0.06)] bg-card soft- h-full"/>
 </div>
 </div>
 );
 }

 if (errorMsg || !data) {
 return (
 <div className="flex h-96 flex-col items-center justify-center text-center p-space-8 radius-xl border border-[hsl(var(--foreground)/0.06)] bg-card soft- max-w-lg mx-auto mt-space-10">
 <div className="flex h-12 w-12 items-center justify-center radius-xl bg-destructive/10 text-destructive mb-space-4 ring-1 ring-destructive/15">
 <AlertTriangle className="h-6 w-6"/>
 </div>
 <h3 className="text-body-sm font-semibold text-foreground">Failed to load analytics</h3>
 <p className="text-caption text-muted-foreground mt-space-1 mb-space-4 leading-normal max-w-xs">{errorMsg ||"An unknown error occurred"}</p>
 <Button variant="outline"size="sm"onClick={loadAnalytics} className="font-semibold text-caption h-8.5">
 <RotateCw className="h-3.5 w-3.5 mr-space-1"/>
 Retry
 </Button>
 </div>
 );
 }

 const { conversations, funnel, leads, escalations, feedback, intents } = data;

 const maxFunnelVal = Math.max(...Object.values(funnel) as number[], 1);
 const maxIntentVal = Math.max(...Object.values(intents) as number[], 1);

 const getStageColors = (stage: string) => {
 const name = stage.toLowerCase();
 switch (name) {
 case"new":
 return { dot:"bg-blue-500", bar:"from-blue-500 to-blue-600"};
 case"qualified":
 return { dot:"bg-emerald-500", bar:"from-emerald-500 to-emerald-600"};
 case"hot":
 return { dot:"bg-orange-500", bar:"from-orange-500 to-orange-600"};
 case"booked":
 return { dot:"bg-purple-500", bar:"from-purple-500 to-purple-600"};
 case"escalated":
 return { dot:"bg-rose-500", bar:"from-rose-500 to-rose-600"};
 case"closed":
 return { dot:"bg-slate-400 dark:bg-slate-500", bar:"from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600"};
 default:
 return { dot:"bg-primary", bar:"from-primary/80 to-primary"};
 }
 };

 const conversationStatuses = [
 { label:"Active", count: conversations.active, color:"bg-emerald-500", border:"border-t-emerald-500"},
 { label:"Escalated", count: conversations.escalated, color:"bg-rose-500", border:"border-t-rose-500"},
 { label:"Closed", count: conversations.closed, color:"bg-slate-400 dark:bg-slate-500", border:"border-t-slate-400"},
 ];

 return (
 <div className="space-y-space-4 animate-fade-in w-full pb-space-8">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-3 shrink-0">
 <PageTitle
 title="Analytics Dashboard"
 description="Lead pipelines, conversation funnels, and customer satisfaction metrics."
 className="mb-0"
 />
 
 <div className="flex items-center gap-space-2 self-start sm:self-center">
 {/* Timeframe Select */}
 <Select value={timeframe} onValueChange={(val) => setTimeframe(val)}>
 <SelectTrigger className="h-8.5 w-36 bg-background text-caption border-[hsl(var(--foreground)/0.08)] hover:border-[hsl(var(--primary)/0.25)] transition-all radius-md">
 <div className="flex items-center gap-space-1.5 font-medium">
 <Calendar className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0"/>
 <SelectValue placeholder="All Time"/>
 </div>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="all"className="text-caption">All Time</SelectItem>
 <SelectItem value="7d"className="text-caption">Last 7 Days</SelectItem>
 <SelectItem value="30d"className="text-caption">Last 30 Days</SelectItem>
 </SelectContent>
 </Select>

 {/* Refresh Button */}
 <Button 
 size="icon"
 variant="ghost"
 className="h-8.5 w-8.5 radius-full hover:bg-[hsl(var(--foreground)/0.05)] cursor-pointer"
 onClick={loadAnalytics}
 title="Refresh analytics"
 >
 <RotateCw className={cn("h-4 w-4 text-muted-foreground/65 transition-transform duration-500", loading &&"animate-spin")} />
 </Button>
 </div>
 </div>

 {/* KPI Row */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-4 shrink-0">
 <StatCard label="Sessions"value={conversations.total} icon={MessageSquare} subtitle="Active timeline logs"/>
 <StatCard label="Leads"value={leads.total} icon={Users} trend={{ value:`+${leads.qualified} qualified`, positive: true }} />
 <StatCard label="Escalation"value={`${conversations.total > 0 ? Math.round((escalations.total / conversations.total) * 100) : 0}%`} icon={AlertTriangle} subtitle={`${escalations.pending} pending triage`} />
 <StatCard label="CSAT Rating"value={feedback.averageRating} icon={Award} subtitle={`Based on ${feedback.total} reviews`} />
 </div>

 {/* Analytics Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-4">

 {/* Card 5: Lead Pipeline Funnel */}
 <div className="flex flex-col bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft-">
 <div className="p-space-5 pb-space-2 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="flex items-center gap-space-2">
 <TrendingUp className="h-4 w-4 text-primary"/>
 <h4 className="text-body-sm font-semibold text-foreground">Lead Pipeline Funnel</h4>
 </div>
 <p className="text-caption text-muted-foreground mt-space-0.5">Conversion stages across all captured leads</p>
 </div>
 <div className="flex-1 p-space-5 bg-[hsl(var(--foreground)/0.002)]">
 <BarChartCard 
  data={Object.entries(funnel).filter(([_, v]) => (v as number) > 0).map(([k, v]) => ({ stage: k, count: v as number }))}
 index="stage"
 categories={["count"]}
 layout="vertical"
 height={260}
 />
 </div>
 </div>

 {/* Card 6: Classified Intents */}
 <div className="flex flex-col bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft-">
 <div className="p-space-5 pb-space-2 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.005)] shrink-0">
 <div className="flex items-center gap-space-2">
 <Compass className="h-4 w-4 text-indigo-500"/>
 <h4 className="text-body-sm font-semibold text-foreground">Classified Intents</h4>
 </div>
 <p className="text-caption text-muted-foreground mt-space-0.5">Query intent categories across all conversations</p>
 </div>
 <div className="flex-1 p-space-5 bg-[hsl(var(--foreground)/0.002)]">
 <DonutChartCard 
 data={Object.entries(intents).filter(([_, v]) => v as number > 0).map(([k, v]) => ({ intent: k.replace("_",""), count: v as number }))}
 index="intent"
 category="count"
 height={260}
 />
 </div>
 </div>
 </div>
 
 {/* ─── Advanced Analytics ─── */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-4 shrink-0">
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Conversions Over Time</CardTitle>
 <CardDescription className="text-caption">Appointments booked vs missed calls</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <AreaChartCard 
 data={[
 { date:"Mon", appointments: 12, missed: 4 },
 { date:"Tue", appointments: 18, missed: 2 },
 { date:"Wed", appointments: 15, missed: 6 },
 { date:"Thu", appointments: 25, missed: 3 },
 { date:"Fri", appointments: 30, missed: 5 },
 { date:"Sat", appointments: 45, missed: 10 },
 { date:"Sun", appointments: 10, missed: 8 },
 ]}
 index="date"
 categories={["appointments","missed"]}
 colors={["#10b981","#ef4444"]}
 height={280}
 />
 </CardContent>
 </Card>

 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Revenue Trend</CardTitle>
 <CardDescription className="text-caption">Estimated vs actual revenue from AI bookings</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <AreaChartCard 
 data={[
 { month:"Jan", actual: 4500, estimated: 4200 },
 { month:"Feb", actual: 5200, estimated: 4800 },
 { month:"Mar", actual: 6100, estimated: 5500 },
 { month:"Apr", actual: 5800, estimated: 6300 },
 { month:"May", actual: 7500, estimated: 7100 },
 { month:"Jun", actual: 8200, estimated: 8000 },
 ]}
 index="month"
 categories={["actual","estimated"]}
 colors={["#10b981","#a1a1aa"]}
 valuePrefix="$"
 height={280}
 />
 </CardContent>
 </Card>

 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">AI vs Human Handled</CardTitle>
 <CardDescription className="text-caption">Resolution breakdown across all conversations</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <DonutChartCard 
 data={[
 { source:"Fully AI Handled", count: 850 },
 { source:"AI + Human Takeover", count: 120 },
 { source:"Direct to Human", count: 30 },
 ]}
 index="source"
 category="count"
 variant="pie"
 height={280}
 />
 </CardContent>
 </Card>

 </div>

 {/* Bottom section */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-4 shrink-0">
 {/* Average Lead Score circle card */}
 <div className="bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl p-space-5 soft- flex items-center gap-space-6">
 <div className="relative flex items-center justify-center shrink-0">
 <svg className="w-20 h-20 -rotate-90"viewBox="0 0 100 100">
 <circle cx="50"cy="50"r="38"fill="none"stroke="hsl(var(--foreground)/0.04)"strokeWidth="7"/>
 <circle
 cx="50"
 cy="50"
 r="38"
 fill="none"
 stroke="hsl(var(--primary))"
 strokeWidth="7"
 strokeLinecap="round"
 strokeDasharray={2 * Math.PI * 38}
 strokeDashoffset={2 * Math.PI * 38 * (1 - leads.averageScore / 100)}
 className="transition-all duration-700 (--ds-glow,0_2px_8px_rgba(122,90,248,0.25))]"
 />
 </svg>
 <div className="absolute flex flex-col items-center">
 <span className="text-body-lg font-semibold text-foreground tabular-nums">{leads.averageScore}</span>
 <span className="text-caption text-muted-foreground/60 font-semibold uppercase tracking-wider">Avg</span>
 </div>
 </div>
 <div>
 <h4 className="text-body-sm font-semibold text-foreground tracking-tight-lg">Average Lead Score</h4>
 <p className="text-caption text-muted-foreground/80 leading-relaxed mt-space-1">
 Compiled from profile completeness, qualification answer counts, high-ticket interest signals, and urgency trigger flags.
 </p>
 </div>
 </div>

 {/* Session breakdown ratios card */}
 <div className="bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl p-space-4.5 soft- flex flex-col justify-between gap-space-4">
 <div>
 <div className="flex items-center gap-space-2">
 <Activity className="h-4 w-4 text-emerald-500"/>
 <h4 className="text-body-sm font-semibold text-foreground tracking-tight-lg">Session Breakdown</h4>
 </div>
 <p className="text-caption text-muted-foreground/85 mt-space-0.5">Active vs escalated vs closed ratios</p>
 </div>

 <div className="space-y-space-3">
 <div className="h-3 w-full bg-[hsl(var(--foreground)/0.04)] radius-full overflow-hidden flex border border-[hsl(var(--foreground)/0.015)]">
 {conversationStatuses.map((stat, idx) => {
 const pct = conversations.total > 0 ? (stat.count / conversations.total) * 100 : 0;
 if (pct === 0) return null;
 return (
 <div
 key={idx}
 style={{ width:`${pct}%`}}
 className={cn("h-full transition-all duration-500", stat.color)}
 title={`${stat.label}: ${stat.count}`}
 />
 );
 })}
 </div>

 <div className="grid grid-cols-3 gap-space-3">
 {conversationStatuses.map((stat, idx) => (
 <div key={idx} className={cn("radius-lg border border-[hsl(var(--foreground)/0.05)] bg-[hsl(var(--foreground)/0.01)] border-t-2 p-space-2.5 text-center", stat.border)}>
 <span className="text-caption font-semibold text-muted-foreground/60 uppercase tracking-wider block">{stat.label}</span>
 <span className="text-body-md font-semibold text-foreground tabular-nums block mt-space-1">{stat.count}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
