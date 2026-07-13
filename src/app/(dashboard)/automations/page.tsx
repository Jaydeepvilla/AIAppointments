"use client";

import { useState } from"react";
import { PageTitle } from"@/components/shared/page-title";
import {
 Save,
 Loader2,
 Check,
 AlertCircle,
 HelpCircle,
 Play,
 Settings,
 Clock,
 UserCheck,
 AlertTriangle,
 Zap,
 RotateCcw,
 Sparkles,
} from"lucide-react";
import { Button } from"@/components/shared/button";
import { Input } from"@/components/shared/input";
import { Label } from"@/components/shared/label";
import { 
 Select, 
 SelectContent, 
 SelectItem, 
 SelectTrigger, 
 SelectValue 
} from"@/components/shared/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/shared/card";
import { cn } from"@/components/shared/utils";

export default function AutomationsPage() {
 const [loading, setLoading] = useState(false);
 const [saveSuccess, setSaveSuccess] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");

 // Automation Settings States
 const [missedApptActive, setMissedApptActive] = useState(true);
 const [missedApptDelay, setMissedApptDelay] = useState(2); // hours
 const [missedApptChannel, setMissedApptChannel] = useState("sms");

 const [unfinishedBookingActive, setUnfinishedBookingActive] = useState(true);
 const [unfinishedBookingDelay, setUnfinishedBookingDelay] = useState(1); // hours
 const [unfinishedBookingChannel, setUnfinishedBookingChannel] = useState("sms");

 const [reviewRequestActive, setReviewRequestActive] = useState(true);
 const [reviewRequestDelay, setReviewRequestDelay] = useState(1); // hours
 const [reviewRequestChannel, setReviewRequestChannel] = useState("sms");

 const [reengagementActive, setReengagementActive] = useState(false);
 const [reengagementDelay, setReengagementDelay] = useState(30); // days
 const [reengagementChannel, setReengagementChannel] = useState("email");

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);
 setSaveSuccess(false);
 setErrorMsg("");

 // Simulate saving settings
 setTimeout(() => {
 setSaveSuccess(true);
 setLoading(false);
 setTimeout(() => setSaveSuccess(false), 3000);
 }, 1000);
 };

 return (
 <div className="space-y-space-4 animate-fade-in w-full h-full flex flex-col overflow-hidden">
 {/* Header */}
 <PageTitle
 title="Automations"
 description="Automatic follow-ups that run without you. Reminders, review requests, and more."
 />

 {errorMsg && (
 <div className="flex items-center gap-space-2 radius-lg bg-state-error-bg border border-state-error-text/15 px-space-4 py-space-2.5 text-caption text-state-error-text shrink-0 animate-fade-in">
 <AlertCircle className="h-4 w-4 shrink-0"/>
 <span className="flex-1 font-medium">{errorMsg}</span>
 <Button className="hover:opacity-70 transition-opacity font-semibold px-space-1 text-body-sm cursor-pointer"onClick={() => setErrorMsg("")}>×</Button>
 </div>
 )}

 {saveSuccess && (
 <div className="flex items-center gap-space-2 p-space-3 radius-md bg-emerald-500/10 border border-emerald-500/15 text-caption text-emerald-600 shrink-0 animate-fade-in">
 <Check className="h-4 w-4 text-emerald-500"/> 
 <span className="font-semibold">Automation workflow rules saved successfully.</span>
 </div>
 )}

 <form onSubmit={handleSave} className="flex-1 overflow-y-auto min-h-0 space-y-space-4 pb-space-4 pr-space-1 sidebar-scroll">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-space-4">

 {/* 1. Missed Booking Follow-up */}
 <div className="bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft- flex flex-col justify-between hover:scale-[1.005] hover:border-[hsl(var(--primary)/0.15)] transition-all duration-200">
 <div className="p-space-4.5 space-y-space-4">
 <div className="flex items-start justify-between gap-space-4">
 <div className="space-y-space-1">
 <div className="flex items-center gap-space-2">
 <Zap className="h-4 w-4 text-indigo-500 shrink-0"/>
 <h3 className="text-body-sm font-semibold text-foreground">Unfinished Bookings Nudge</h3>
 </div>
 <p className="text-caption text-muted-foreground/80 leading-normal">
 Follow-up with customers who began the booking wizard but did not confirm.
 </p>
 </div>
 <button
 type="button"
 role="switch"
 aria-checked={unfinishedBookingActive}
 onClick={() => setUnfinishedBookingActive(!unfinishedBookingActive)}
 className={cn(
 "relative inline-flex h-5.5 w-9.5 shrink-0 cursor-pointer items-center radius-full transition-colors focus-visible:outline-none",
 unfinishedBookingActive ?"bg-indigo-500":"bg-[hsl(var(--foreground)/0.12)]"
 )}
 >
 <span
 className={cn(
 "pointer-events-none block h-4 w-4 radius-full bg-background ring-0 transition-transform",
 unfinishedBookingActive ?"translate-x-[16px]":"translate-x-0.5"
 )}
 />
 </button>
 </div>

 {unfinishedBookingActive && (
 <div className="grid grid-cols-2 gap-space-3 p-space-3 bg-[hsl(var(--foreground)/0.005)] border border-[hsl(var(--foreground)/0.04)] radius-lg animate-fade-in text-caption">
 <div className="space-y-space-1.5">
 <Label htmlFor="unfDelay"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Delay (hours)</Label>
 <Input
 id="unfDelay"
 type="number"
 value={unfinishedBookingDelay}
 onChange={(e) => setUnfinishedBookingDelay(parseInt(e.target.value) || 1)}
 className="h-8.5 bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 min={1}
 />
 </div>
 <div className="space-y-space-1.5">
 <Label htmlFor="unfChan"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Channel</Label>
 <Select
 value={unfinishedBookingChannel}
 onValueChange={(val) => setUnfinishedBookingChannel(val)}
 >
 <SelectTrigger className="h-8.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)]">
 <SelectValue placeholder="Select Channel"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="sms">SMS / Twilio</SelectItem>
 <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
 <SelectItem value="email">Email</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* 2. Missed Appointment Trigger */}
 <div className="bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft- flex flex-col justify-between hover:scale-[1.005] hover:border-[hsl(var(--primary)/0.15)] transition-all duration-200">
 <div className="p-space-4.5 space-y-space-4">
 <div className="flex items-start justify-between gap-space-4">
 <div className="space-y-space-1">
 <div className="flex items-center gap-space-2">
 <AlertTriangle className="h-4 w-4 text-emerald-500 shrink-0"/>
 <h3 className="text-body-sm font-semibold text-foreground">No-Show / Missed Appointment</h3>
 </div>
 <p className="text-caption text-muted-foreground/80 leading-normal">
 Trigger follow-up templates to reschedule customers who missed their slot.
 </p>
 </div>
 <button
 type="button"
 role="switch"
 aria-checked={missedApptActive}
 onClick={() => setMissedApptActive(!missedApptActive)}
 className={cn(
 "relative inline-flex h-5.5 w-9.5 shrink-0 cursor-pointer items-center radius-full transition-colors focus-visible:outline-none",
 missedApptActive ?"bg-emerald-500":"bg-[hsl(var(--foreground)/0.12)]"
 )}
 >
 <span
 className={cn(
 "pointer-events-none block h-4 w-4 radius-full bg-background ring-0 transition-transform",
 missedApptActive ?"translate-x-[16px]":"translate-x-0.5"
 )}
 />
 </button>
 </div>

 {missedApptActive && (
 <div className="grid grid-cols-2 gap-space-3 p-space-3 bg-[hsl(var(--foreground)/0.005)] border border-[hsl(var(--foreground)/0.04)] radius-lg animate-fade-in text-caption">
 <div className="space-y-space-1.5">
 <Label htmlFor="missDelay"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Delay (hours)</Label>
 <Input
 id="missDelay"
 type="number"
 value={missedApptDelay}
 onChange={(e) => setMissedApptDelay(parseInt(e.target.value) || 2)}
 className="h-8.5 bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 min={1}
 />
 </div>
 <div className="space-y-space-1.5">
 <Label htmlFor="missChan"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Channel</Label>
 <Select
 value={missedApptChannel}
 onValueChange={(val) => setMissedApptChannel(val)}
 >
 <SelectTrigger className="h-8.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)]">
 <SelectValue placeholder="Select Channel"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="sms">SMS / Twilio</SelectItem>
 <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
 <SelectItem value="email">Email</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* 3. Review Requests Trigger */}
 <div className="bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft- flex flex-col justify-between hover:scale-[1.005] hover:border-[hsl(var(--primary)/0.15)] transition-all duration-200">
 <div className="p-space-4.5 space-y-space-4">
 <div className="flex items-start justify-between gap-space-4">
 <div className="space-y-space-1">
 <div className="flex items-center gap-space-2">
 <Clock className="h-4 w-4 text-amber-500 shrink-0"/>
 <h3 className="text-body-sm font-semibold text-foreground">Review Requests Feed</h3>
 </div>
 <p className="text-caption text-muted-foreground/80 leading-normal">
 Request customer reviews and CSAT scores after appointments have completed.
 </p>
 </div>
 <button
 type="button"
 role="switch"
 aria-checked={reviewRequestActive}
 onClick={() => setReviewRequestActive(!reviewRequestActive)}
 className={cn(
 "relative inline-flex h-5.5 w-9.5 shrink-0 cursor-pointer items-center radius-full transition-colors focus-visible:outline-none",
 reviewRequestActive ?"bg-amber-500":"bg-[hsl(var(--foreground)/0.12)]"
 )}
 >
 <span
 className={cn(
 "pointer-events-none block h-4 w-4 radius-full bg-background ring-0 transition-transform",
 reviewRequestActive ?"translate-x-[16px]":"translate-x-0.5"
 )}
 />
 </button>
 </div>

 {reviewRequestActive && (
 <div className="grid grid-cols-2 gap-space-3 p-space-3 bg-[hsl(var(--foreground)/0.005)] border border-[hsl(var(--foreground)/0.04)] radius-lg animate-fade-in text-caption">
 <div className="space-y-space-1.5">
 <Label htmlFor="revDelay"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Delay (hours)</Label>
 <Input
 id="revDelay"
 type="number"
 value={reviewRequestDelay}
 onChange={(e) => setReviewRequestDelay(parseInt(e.target.value) || 1)}
 className="h-8.5 bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 min={1}
 />
 </div>
 <div className="space-y-space-1.5">
 <Label htmlFor="revChan"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Channel</Label>
 <Select
 value={reviewRequestChannel}
 onValueChange={(val) => setReviewRequestChannel(val)}
 >
 <SelectTrigger className="h-8.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)]">
 <SelectValue placeholder="Select Channel"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="sms">SMS / Twilio</SelectItem>
 <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
 <SelectItem value="email">Email</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* 4. Client Re-engagement drip */}
 <div className="bg-card border border-[hsl(var(--foreground)/0.06)] radius-xl overflow-hidden soft- flex flex-col justify-between hover:scale-[1.005] hover:border-[hsl(var(--primary)/0.15)] transition-all duration-200">
 <div className="p-space-4.5 space-y-space-4">
 <div className="flex items-start justify-between gap-space-4">
 <div className="space-y-space-1">
 <div className="flex items-center gap-space-2">
 <UserCheck className="h-4 w-4 text-purple-500 shrink-0"/>
 <h3 className="text-body-sm font-semibold text-foreground">Lead Re-engagement Drip</h3>
 </div>
 <p className="text-caption text-muted-foreground/80 leading-normal">
 Nurture cold contacts who have not interacted with the AI receptionist in several weeks.
 </p>
 </div>
 <button
 type="button"
 role="switch"
 aria-checked={reengagementActive}
 onClick={() => setReengagementActive(!reengagementActive)}
 className={cn(
 "relative inline-flex h-5.5 w-9.5 shrink-0 cursor-pointer items-center radius-full transition-colors focus-visible:outline-none",
 reengagementActive ?"bg-purple-500":"bg-[hsl(var(--foreground)/0.12)]"
 )}
 >
 <span
 className={cn(
 "pointer-events-none block h-4 w-4 radius-full bg-background ring-0 transition-transform",
 reengagementActive ?"translate-x-[16px]":"translate-x-0.5"
 )}
 />
 </button>
 </div>

 {reengagementActive && (
 <div className="grid grid-cols-2 gap-space-3 p-space-3 bg-[hsl(var(--foreground)/0.005)] border border-[hsl(var(--foreground)/0.04)] radius-lg animate-fade-in text-caption">
 <div className="space-y-space-1.5">
 <Label htmlFor="reDelay"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Delay (days)</Label>
 <Input
 id="reDelay"
 type="number"
 value={reengagementDelay}
 onChange={(e) => setReengagementDelay(parseInt(e.target.value) || 30)}
 className="h-8.5 bg-background text-caption border-[hsl(var(--foreground)/0.08)] focus-visible:ring-primary/20"
 min={7}
 />
 </div>
 <div className="space-y-space-1.5">
 <Label htmlFor="reChan"className="text-caption uppercase tracking-wider font-semibold text-muted-foreground/60">Channel</Label>
 <Select
 value={reengagementChannel}
 onValueChange={(val) => setReengagementChannel(val)}
 >
 <SelectTrigger className="h-8.5 text-caption bg-background border-[hsl(var(--foreground)/0.08)]">
 <SelectValue placeholder="Select Channel"/>
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="email">Email Client</SelectItem>
 <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
 <SelectItem value="sms">SMS / Twilio</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 )}
 </div>
 </div>

 </div>

 <div className="flex justify-end pt-space-4 border-t border-[hsl(var(--foreground)/0.05)] shrink-0 bg-background">
 <Button type="submit" disabled={loading} className="h-8.5 text-caption font-semibold px-space-4 rounded-full">
 {loading ? (
 <>
 <Loader2 className="h-3.5 w-3.5 animate-spin mr-space-1"/>
 <span>Saving Workflows...</span>
 </>
 ) : (
 <>
 <Save className="h-3.5 w-3.5 mr-space-1.5"/>
 <span>Save Automation Settings</span>
 </>
 )}
 </Button>
 </div>
 </form>
 </div>
 );
}
