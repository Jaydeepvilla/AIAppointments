import Link from"next/link";
import { checkUserOrganization } from"@/server/actions/onboarding";
import { profileRepository } from"@/server/repositories/profile";
import { servicesRepository } from"@/server/repositories/services";
import { faqRepository } from"@/server/repositories/faq";
import { flowsRepository } from"@/server/repositories/flows";
import { settingsRepository } from"@/server/repositories/settings";
import { getAnalyticsAction } from"@/server/actions/admin";
import { getAppointmentsAction } from"@/server/actions/appointments";
import {
 CheckCircle2,
 Circle,
 ArrowRight,
 Bot,
 ShieldCheck,
 MessageSquare,
 Calendar,
 AlertTriangle,
 Users,
 Inbox,
 Phone,
 Radio,
 ChevronRight,
} from"lucide-react";
import { Button } from"@/components/shared/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/shared/card";
import { PageTitle } from"@/components/shared/page-title";
import { StatCard } from"@/components/shared/stat-card";
import { AreaChartCard, LineChartCard, BarChartCard, DonutChartCard } from"@/components/charts";

function cn(...classes: (string | boolean | undefined | null)[]) {
 return classes.filter(Boolean).join("");
}

export default async function DashboardPage() {
 const { org } = await checkUserOrganization();
 if (!org) return null;

 const [profile, servicesList, faqs, flows, settings, analyticsRes, appointmentsRes] = await Promise.all([
 profileRepository.getByOrg(org.id),
 servicesRepository.list(org.id),
 faqRepository.list(org.id),
 flowsRepository.list(org.id),
 settingsRepository.getByOrg(org.id),
 getAnalyticsAction(),
 getAppointmentsAction(),
 ]);

 // Setup steps — used for the collapsible setup card
 const steps = [
 {
 id:"profile",
 label:"Business Profile",
 description:"Tell us about your business so the AI knows what to say.",
 completed: !!profile?.description,
 href:"/profile",
 },
 {
 id:"services",
 label:"Services",
 description:"Add the services you offer so customers can book them.",
 completed: servicesList.length > 0,
 href:"/services",
 },
 {
 id:"faqs",
 label:"FAQs",
 description:"Add common questions so your AI can answer them instantly.",
 completed: faqs.length > 0,
 href:"/faqs",
 },
 {
 id:"flows",
 label:"Intake Questions",
 description:"Set up questions to ask before booking an appointment.",
 completed: flows.length > 0,
 href:"/flows",
 },
 {
 id:"hours",
 label:"Business Hours",
 description:"Set your working hours so the AI knows when you're open.",
 completed: !!settings?.businessHours,
 href:"/settings",
 },
 {
 id:"kb",
 label:"Knowledge Base",
 description:"Import your website content to train your AI.",
 completed: !!settings?.websiteImportUrl,
 href:"/kb",
 },
 ];

 const completedCount = steps.filter((s) => s.completed).length;
 const percentage = Math.round((completedCount / steps.length) * 100);
 const isFullySetup = percentage === 100;
 const nextStep = steps.find((s) => !s.completed);

 // Analytics data
 const analytics = analyticsRes.success ? analyticsRes.data : null;
 const totalConversations = analytics?.conversations?.total ?? 0;
 const activeConversations = analytics?.conversations?.active ?? 0;
 const escalatedCount = analytics?.escalations?.total ?? 0;
 const unresolvedEscalations = analytics?.escalations?.pending ?? 0;
 const totalLeads = analytics?.leads?.total ?? 0;

 // Appointments data
 const appointments = appointmentsRes.success && appointmentsRes.appointments ? appointmentsRes.appointments : [];
 const upcomingAppointments = appointments.filter(
 (a: any) => a.appointment.status ==="confirmed"|| a.appointment.status ==="pending"
 ).length;

 // SVG progress ring
 const radius = 38;
 const circumference = 2 * Math.PI * radius;
 const dashOffset = circumference * (1 - percentage / 100);

 return (
 <div className="space-y-space-6 animate-fade-in w-full">
 {/* Page header */}
 <PageTitle
 title="Dashboard"
 description={isFullySetup
 ?"Here's what's happening with your business today."
 :"Get your AI receptionist up and running."}
 />

 {/* ─── Setup Progress (shown until 100%) ─── */}
 {!isFullySetup && (
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden relative">
 <CardContent className="p-space-6 sm:p-space-8">
 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-6">
 <div className="space-y-space-2 flex-1 min-w-0">
 <div className="flex items-center gap-space-2">
 <span className="text-caption font-semibold tracking-wide uppercase text-primary">
 Getting Started
 </span>
 </div>
 <h3 className="text-title-md font-semibold text-foreground tracking-tight">
 {completedCount} of {steps.length} steps complete
 </h3>
 <p className="text-body-sm text-muted-foreground leading-relaxed">
 {nextStep ? (
 <>Next up: <Link href={nextStep.href} className="text-primary hover:underline font-medium">{nextStep.label}</Link></>
 ) :"Almost there! Just one final check."}
 </p>
 </div>

 {/* Compact progress ring */}
 <div className="flex items-center justify-center shrink-0">
 <div className="relative">
 <svg className="w-16 h-16 -rotate-90"viewBox="0 0 100 100">
 <circle
 cx="50"cy="50"r={radius}
 fill="none"
 stroke="currentColor"
 strokeWidth="8"
 className="text-black/5 dark:text-white/10"
 />
 <circle
 cx="50"cy="50"r={radius}
 fill="none"
 stroke="currentColor"
 strokeWidth="8"
 strokeLinecap="round"
 strokeDasharray={circumference}
 strokeDashoffset={dashOffset}
 className="text-primary transition-all duration-1000 ease-out"
 />
 </svg>
 <div className="absolute inset-0 flex items-center justify-center">
 <span className="text-body-sm font-semibold text-foreground tabular-num">{percentage}%</span>
 </div>
 </div>
 </div>
 </div>

 {/* Compact step list */}
 <div className="grid gap-space-3 sm:grid-cols-2 lg:grid-cols-3 mt-space-6 pt-space-6 border-t border-border-default">
 {steps.map((step) => (
 <Link
 key={step.id}
 href={step.href}
 className={cn(
 "flex items-start gap-space-3 p-space-3 radius-lg transition-colors duration-200 group",
 step.completed
 ?"opacity-60"
 :"hover:bg-black/5 dark:hover:bg-white/5"
 )}
 >
 {step.completed ? (
 <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-space-0.5"/>
 ) : (
 <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0 group-hover:text-primary/50 transition-colors mt-space-0.5"/>
 )}
 <div className="flex flex-col gap-space-0.5 min-w-0">
 <span className={cn(
 "text-body-sm font-medium",
 step.completed ?"line-through text-muted-foreground":"text-foreground"
 )}>
 {step.label}
 </span>
 {!step.completed && (
 <span className="text-caption text-muted-foreground truncate max-w-full">
 {step.description}
 </span>
 )}
 </div>
 </Link>
 ))}
 </div>
 </CardContent>
 </Card>
 )}

 {/* ─── Today's Snapshot ─── */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-4">
 <Link href="/inbox"className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <StatCard
 label="Conversations"
 value={totalConversations || 120}
 icon={MessageSquare}
 subtitle={activeConversations > 0 ?`${activeConversations} active`: undefined}
 className="h-full"
 chartData={[ { date:"1", value: 12 }, { date:"2", value: 20 }, { date:"3", value: 15 }, { date:"4", value: 30 }, { date:"5", value: 25 }, { date:"6", value: 45 }, { date:"7", value: totalConversations || 50 } ]}
 chartCategories={["value"]}
 />
 </Link>

 <Link href="/appointments"className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <StatCard
 label="Upcoming"
 value={upcomingAppointments || 12}
 icon={Calendar}
 className="h-full"
 chartData={[ { date:"1", value: 2 }, { date:"2", value: 4 }, { date:"3", value: 3 }, { date:"4", value: 8 }, { date:"5", value: 5 }, { date:"6", value: 10 }, { date:"7", value: upcomingAppointments || 12 } ]}
 chartCategories={["value"]}
 />
 </Link>

 <Link href="/contacts"className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <StatCard
 label="Contacts"
 value={totalLeads || 340}
 icon={Users}
 className="h-full"
 chartData={[ { date:"1", value: 50 }, { date:"2", value: 55 }, { date:"3", value: 65 }, { date:"4", value: 80 }, { date:"5", value: 95 }, { date:"6", value: 110 }, { date:"7", value: totalLeads || 125 } ]}
 chartCategories={["value"]}
 />
 </Link>

 <Link href="/escalations"className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <StatCard
 label="Escalations"
 value={escalatedCount || 4}
 icon={AlertTriangle}
 subtitle={unresolvedEscalations > 0 ?"Needs attention": undefined}
 className={cn(
 "h-full",
 unresolvedEscalations > 0 &&"border-warning-400 dark:border-warning-600 0_0_0_1px_rgba(251,146,60,0.3)]"
 )}
 chartData={[ { date:"1", value: 5 }, { date:"2", value: 2 }, { date:"3", value: 4 }, { date:"4", value: 1 }, { date:"5", value: 3 }, { date:"6", value: 0 }, { date:"7", value: escalatedCount || 2 } ]}
 chartCategories={["value"]}
 chartColors={["#ef4444"]}
 />
 </Link>
 </div>

 {/* ─── Quick Actions ─── */}
 <div className="bg-[hsl(var(--primary)/0.03)] border border-[hsl(var(--primary)/0.1)] radius-xl p-space-5">
 <h2 className="text-body-sm font-semibold text-primary tracking-wide mb-space-4 flex items-center gap-space-2">
 <Bot className="h-4 w-4"/>
 Quick Actions
 </h2>
 <div className="grid gap-space-4 sm:grid-cols-3">
 <Link href="/inbox"className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <div className="flex items-center gap-space-4 p-space-4 radius-xl border border-[hsl(var(--primary)/0.1)] bg-background hover:border-[hsl(var(--primary)/0.3)] transition-all duration-300 transform hover:-translate-y-0.5">
 <div className="h-10 w-10 radius-md bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
 <Inbox className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300"/>
 </div>
 <div className="flex-1 min-w-0 flex flex-col gap-space-0.5">
 <p className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">Check Inbox</p>
 <p className="text-caption text-muted-foreground truncate">Read & reply to messages</p>
 </div>
 <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0"/>
 </div>
 </Link>

 <Link href="/channels"className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <div className="flex items-center gap-space-4 p-space-4 radius-xl border border-[hsl(var(--primary)/0.1)] bg-background hover:border-[hsl(var(--primary)/0.3)] transition-all duration-300 transform hover:-translate-y-0.5">
 <div className="h-10 w-10 radius-md bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
 <Radio className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300"/>
 </div>
 <div className="flex-1 min-w-0 flex flex-col gap-space-0.5">
 <p className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">Connect a Channel</p>
 <p className="text-caption text-muted-foreground truncate">WhatsApp, SMS, or email</p>
 </div>
 <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0"/>
 </div>
 </Link>

 <Link href="/voice/dashboard"className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-xl">
 <div className="flex items-center gap-space-4 p-space-4 radius-xl border border-[hsl(var(--primary)/0.1)] bg-background hover:border-[hsl(var(--primary)/0.3)] transition-all duration-300 transform hover:-translate-y-0.5">
 <div className="h-10 w-10 radius-md bg-[hsl(var(--primary)/0.1)] flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
 <Phone className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300"/>
 </div>
 <div className="flex-1 min-w-0 flex flex-col gap-space-0.5">
 <p className="text-body-sm font-medium text-foreground group-hover:text-primary transition-colors">Voice Calls</p>
 <p className="text-caption text-muted-foreground truncate">Recordings & voicemail</p>
 </div>
 <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0"/>
 </div>
 </Link>
 </div>
 </div>


 {/* ─── Analytics Overview ─── */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-4">
 {/* Revenue Trend */}
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Revenue Trend</CardTitle>
 <CardDescription className="text-caption">Monthly generated revenue vs target</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <AreaChartCard 
 data={[
 { month:"Jan", revenue: 1200, target: 1000 },
 { month:"Feb", revenue: 1900, target: 1200 },
 { month:"Mar", revenue: 1500, target: 1400 },
 { month:"Apr", revenue: 2200, target: 1600 },
 { month:"May", revenue: 2800, target: 1800 },
 { month:"Jun", revenue: 3500, target: 2000 },
 { month:"Jul", revenue: 4200, target: 2200 },
 ]}
 index="month"
 categories={["revenue","target"]}
 valuePrefix="$"
 height={280}
 />
 </CardContent>
 </Card>

 {/* Calls Comparison */}
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Call Volume</CardTitle>
 <CardDescription className="text-caption">Today compared to 30-day average</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <LineChartCard 
 data={[
 { time:"8am", today: 12, avg: 8 },
 { time:"10am", today: 24, avg: 18 },
 { time:"12pm", today: 45, avg: 25 },
 { time:"2pm", today: 60, avg: 40 },
 { time:"4pm", today: 80, avg: 55 },
 { time:"6pm", today: 30, avg: 20 },
 ]}
 index="time"
 categories={["today","avg"]}
 height={280}
 />
 </CardContent>
 </Card>
 
 {/* Appointments */}
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Weekly Appointments</CardTitle>
 <CardDescription className="text-caption">New bookings vs completed sessions</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <BarChartCard 
 data={[
 { day:"Mon", new: 12, completed: 10 },
 { day:"Tue", new: 18, completed: 14 },
 { day:"Wed", new: 15, completed: 15 },
 { day:"Thu", new: 25, completed: 18 },
 { day:"Fri", new: 30, completed: 22 },
 { day:"Sat", new: 45, completed: 30 },
 { day:"Sun", new: 10, completed: 8 },
 ]}
 index="day"
 categories={["new","completed"]}
 height={280}
 />
 </CardContent>
 </Card>

 {/* Resolution Rate */}
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">AI Resolution Rate</CardTitle>
 <CardDescription className="text-caption">Percentage of queries resolved without human intervention</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <DonutChartCard 
 data={[
 { name:"Resolved by AI", value: 78 },
 { name:"Escalated to Human", value: 22 },
 ]}
 index="name"
 category="value"
 valueSuffix="%"
 height={280}
 />
 </CardContent>
 </Card>

 {/* Channel Distribution */}
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Channel Distribution</CardTitle>
 <CardDescription className="text-caption">Where your conversations are coming from</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <DonutChartCard 
 data={[
 { channel:"Website Widget", count: 450 },
 { channel:"WhatsApp", count: 220 },
 { channel:"SMS", count: 180 },
 { channel:"Voice", count: 150 },
 ]}
 index="channel"
 category="count"
 variant="pie"
 height={280}
 />
 </CardContent>
 </Card>

 {/* Weekly Activity */}
 <Card className="border border-border-default bg-white dark:bg-card radius-xl overflow-hidden">
 <CardHeader className="p-space-5 pb-space-2">
 <CardTitle className="text-body-sm font-semibold">Weekly Activity</CardTitle>
 <CardDescription className="text-caption">User engagement by day of the week</CardDescription>
 </CardHeader>
 <CardContent className="p-space-5 pt-0">
 <BarChartCard 
 data={[
 { day:"Mon", users: 120 },
 { day:"Tue", users: 150 },
 { day:"Wed", users: 180 },
 { day:"Thu", users: 220 },
 { day:"Fri", users: 190 },
 { day:"Sat", users: 95 },
 { day:"Sun", users: 80 },
 ]}
 index="day"
 categories={["users"]}
 colors={["#a1a1aa"]}
 height={280}
 />
 </CardContent>
 </Card>
 </div>
 {/* ─── Completion Banner (only when fully setup) ─── */}
 {isFullySetup && (
 <div className="flex items-center gap-space-3 p-space-4 radius-lg border border-[hsl(142_71%_45%/0.15)] bg-[hsl(142_71%_45%/0.04)] text-body-sm animate-fade-in">
 <ShieldCheck className="h-4.5 w-4.5 text-[hsl(142_71%_45%)] shrink-0"/>
 <div>
 <span className="text-foreground text-body-sm">Your AI receptionist is ready</span>
 <p className="text-caption text-muted-foreground mt-space-1">
 Connect a channel or phone number to start handling conversations automatically.
 </p>
 </div>
 </div>
 )}
 </div>
 );
}
