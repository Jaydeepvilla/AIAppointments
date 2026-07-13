"use client";

import React, { useState } from "react";
import {
 Globe,
 MessageSquare,
 Phone,
 Camera,
 Brain,
 Calendar,
 Database,
 BarChart3,
 ArrowRight,
} from "lucide-react";

/* --- Mappings and Details --- */
const CHANNELS = {
 Phone: {
 icon: Phone,
 outcome: "Bookings",
 desc: "A customer calls your business line. Operator picks up in 1 second, checks calendar availability, and books the appointment autonomously.",
 accent: {
 text: "text-purple-600 dark:text-purple-400",
 border: "border-purple-500 dark:border-purple-500/40",
 bg: "bg-purple-50/40 dark:bg-purple-950/10",
 glow: "shadow-sm",
 line: "stroke-purple-500 dark:stroke-purple-400",
 grad: "url(#grad-left-Phone)",
 iconBorder: "border-purple-500/20 dark:border-purple-500/25",
 iconBg: "bg-purple-100/50 dark:bg-purple-950/30",
 descBorder: "border-purple-500/30 dark:border-purple-500/35",
 glowColor: "rgba(168, 85, 247, 0.25)",
 bgGlow: "from-purple-500/6 to-transparent",
 },
 },
 Website: {
 icon: Globe,
 outcome: "CRM",
 desc: "A visitor starts a web chat. Operator answers FAQs from your knowledge base, qualifies interest, and creates a CRM contact card.",
 accent: {
 text: "text-emerald-600 dark:text-emerald-400",
 border: "border-emerald-500 dark:border-emerald-500/40",
 bg: "bg-emerald-50/40 dark:bg-emerald-950/10",
 glow: "shadow-sm",
 line: "stroke-emerald-500 dark:stroke-emerald-450",
 grad: "url(#grad-left-Website)",
 iconBorder: "border-emerald-500/20 dark:border-emerald-500/25",
 iconBg: "bg-emerald-100/50 dark:bg-emerald-950/30",
 descBorder: "border-emerald-500/30 dark:border-emerald-500/35",
 glowColor: "rgba(16, 185, 129, 0.25)",
 bgGlow: "from-emerald-500/6 to-transparent",
 },
 },
 WhatsApp: {
 icon: MessageSquare,
 outcome: "CRM",
 desc: "Inbound messages on WhatsApp Business are handled instantly. Operator qualifies leads and captures booking intent.",
 accent: {
 text: "text-teal-600 dark:text-teal-455",
 border: "border-teal-500 dark:border-teal-500/40",
 bg: "bg-teal-50/40 dark:bg-teal-950/10",
 glow: "shadow-sm",
 line: "stroke-teal-500 dark:stroke-teal-450",
 grad: "url(#grad-left-WhatsApp)",
 iconBorder: "border-teal-500/20 dark:border-teal-500/25",
 iconBg: "bg-teal-100/50 dark:bg-teal-950/30",
 descBorder: "border-teal-500/30 dark:border-teal-500/35",
 glowColor: "rgba(20, 184, 166, 0.25)",
 bgGlow: "from-teal-500/6 to-transparent",
 },
 },
 Instagram: {
 icon: Camera,
 outcome: "Analytics",
 desc: "Prospects send Instagram DMs inquiring about services. Operator answers pricing questions and flags hot prospects in analytics.",
 accent: {
 text: "text-pink-650 dark:text-pink-405",
 border: "border-pink-500 dark:border-pink-500/40",
 bg: "bg-pink-50/40 dark:bg-pink-950/10",
 glow: "shadow-sm",
 line: "stroke-pink-500 dark:stroke-pink-455",
 grad: "url(#grad-left-Instagram)",
 iconBorder: "border-pink-500/20 dark:border-pink-500/25",
 iconBg: "bg-pink-100/50 dark:bg-pink-950/30",
 descBorder: "border-pink-500/30 dark:border-pink-550/35",
 glowColor: "rgba(236, 72, 153, 0.25)",
 bgGlow: "from-pink-500/6 to-transparent",
 },
 },
} as const;

type ChannelKey = keyof typeof CHANNELS;
const CHANNEL_KEYS: ChannelKey[] = ["Website", "WhatsApp", "Phone", "Instagram"];

const OUTCOMES = [
 { key: "Bookings", icon: Calendar, desc: "Direct calendar injection & confirmations" },
 { key: "CRM", icon: Database, desc: "Instant profile updates & tag logs" },
 { key: "Analytics", icon: BarChart3, desc: "Frictionless pipeline metrics & audit logs" },
] as const;

const PILLS = [
 { name: "#AnalyzeIntent" },
 { name: "#CalendarSync" },
 { name: "#QualifyLeads" },
 { name: "#CRMUpdates" },
] as const;

export function InteractiveArchitecture() {
 const [activeChannel, setActiveChannel] = useState<ChannelKey | null>(null);

 const selectedAccent = activeChannel ? CHANNELS[activeChannel].accent : null;

 const getPillClass = (pillName: string) => {
 if (!activeChannel) return "normal";
 
 // Website & WhatsApp route to CRM
 if (activeChannel === "Website" || activeChannel === "WhatsApp") {
 if (pillName === "#CalendarSync") return "dimmed";
 return "active";
 }
 // Phone routes to Bookings
 if (activeChannel === "Phone") {
 if (pillName === "#CRMUpdates") return "dimmed";
 return "active";
 }
 // Instagram routes to Analytics
 if (activeChannel === "Instagram") {
 if (pillName === "#CalendarSync") return "dimmed";
 return "active";
 }
 return "normal";
 };

 const getPillStyles = (pillName: string) => {
 const state = getPillClass(pillName);
 
 if (state === "normal") {
 return "text-zinc-500 bg-zinc-50 border-zinc-200 dark:text-zinc-400 dark:bg-zinc-900/50 dark:border-zinc-800/80";
 }
 if (state === "dimmed") {
 return "text-zinc-300/40 bg-zinc-50/10 border-zinc-100/10 dark:text-zinc-700 dark:bg-zinc-950/20 dark:border-zinc-900/20 opacity-25 scale-95 blur-[0.5px]";
 }
 
 // Active state matches current hovered channel's theme
 if (activeChannel === "Phone") {
 return "text-purple-605 bg-purple-500/10 border-purple-500/20 dark:text-purple-400 dark:bg-purple-950/30 dark:border-purple-500/40 shadow-lg";
 }
 if (activeChannel === "Website") {
 return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-500/40 shadow-lg";
 }
 if (activeChannel === "WhatsApp") {
 return "text-teal-600 bg-teal-500/10 border-teal-500/20 dark:text-teal-400 dark:bg-teal-950/30 dark:border-teal-500/40 shadow-lg";
 }
 if (activeChannel === "Instagram") {
 return "text-pink-600 bg-pink-500/10 border-pink-500/20 dark:text-pink-400 dark:bg-pink-950/30 dark:border-pink-500/40 shadow-lg";
 }
 return "";
 };

 return (
 <div className="mx-auto max-w-4xl w-full animate-fade-up">
 {/* --- Outer Node Container --- */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-space-6 md:gap-space-0 items-center justify-between relative rounded-3xl p-space-6 md:p-space-10 bg-zinc-50/40 border border-zinc-200/80 overflow-hidden mb-space-6 dark:bg-zinc-950/30 dark:border-zinc-800/80 backdrop-blur-sm shadow-sm">
 
 {/* Figma-Style Schematic Grid Sheet Background */}
 <div className="absolute inset-space-0 pointer-events-none opacity-20 dark:opacity-10"
 style={{
 backgroundImage: `
 linear-gradient(to right, var(--color-border) 1px, transparent 1px),
 linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
 `,
 backgroundSize: "24px 24px"
 }}
 />

 {/* Corner Crosshair Accents */}
 <div className="absolute top-space-3 left-space-3 text-zinc-350 dark:text-zinc-700 font-mono text-caption select-none pointer-events-none">+</div >
 <div className="absolute top-space-3 right-space-3 text-zinc-350 dark:text-zinc-700 font-mono text-caption select-none pointer-events-none">+</div >
 <div className="absolute bottom-space-3 left-space-3 text-zinc-350 dark:text-zinc-700 font-mono text-caption select-none pointer-events-none">+</div >
 <div className="absolute bottom-space-3 right-space-3 text-zinc-350 dark:text-zinc-700 font-mono text-caption select-none pointer-events-none">+</div >

 {/* Glow Behind Middle Operator Engine */}
 <div 
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
 style={{ 
 background: activeChannel 
 ? `radial-gradient(circle, ${selectedAccent?.glowColor} 0%, transparent 70%)`
 : "radial-gradient(circle, rgba(122,90,248,0.04) 0%, transparent 65%)"
 }}
 />

 {/* --- Left Column: Input Channels --- */}
 <div className="md:col-span-3 space-y-space-3.5 relative z-10">
 <div className="flex items-center gap-space-2 mb-space-4 px-space-1 justify-center md:justify-start">
 <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse"/>
 <span className="text-caption uppercase tracking-wider text-zinc-450 font-mono font-bold dark:text-zinc-500">
 Input Channels
 </span>
 </div>

 {CHANNEL_KEYS.map((key) => {
 const chan = CHANNELS[key];
 const Icon = chan.icon;
 const isActive = activeChannel === key;
 const isDimmed = activeChannel !== null && !isActive;

 return (
 <div
 key={key}
 onMouseEnter={() => setActiveChannel(key)}
 onMouseLeave={() => setActiveChannel(null)}
 className={`group relative rounded-2xl border p-space-4 flex items-center gap-space-4 transition-all duration-300 cursor-pointer ${
 isActive
 ? `${chan.accent.border} ${chan.accent.bg} ${chan.accent.text} border-[1px]`
 : isDimmed
 ? "border-zinc-200/50 bg-zinc-50/20 text-zinc-400 dark:border-zinc-800/40 dark:bg-zinc-900/10 dark:text-zinc-500 opacity-60"
 : "border-zinc-200/80 bg-white/70 text-zinc-700 dark:border-zinc-850 dark:bg-zinc-900/40 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/20 dark:hover:bg-zinc-850/10"
 }`}
 >
 {/* Inner subtle gradient background reveal on hover */}
 <div className={`absolute inset-space-0 bg-gradient-to-r ${chan.accent.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`} />

 {/* Visual socket terminal on right edge of card */}
 <div className={`absolute right-[-4px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border transition-all duration-300 z-20 ${
 isActive 
 ? "bg-white dark:bg-white border-current"
 : "bg-zinc-200 border-zinc-350 dark:bg-zinc-950 dark:border-zinc-800"
 }`}
 style={{
 color: isActive ? chan.accent.glowColor : undefined,
 borderColor: isActive ? "currentColor" : undefined,
 boxShadow: isActive ? `0 0 8px ${chan.accent.glowColor}` : undefined
 }}
 />

 <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-300 z-10 ${
 isActive 
 ? `${chan.accent.iconBorder} ${chan.accent.iconBg}`
 : "border-zinc-200 bg-zinc-50 text-zinc-450 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400"
 }`}>
 <Icon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110"/>
 </div>
 <div className="flex flex-col z-10">
 <span className="text-sm font-semibold tracking-tight leading-tight">{key}</span>
 <span className={`text-caption font-mono tracking-tight transition-colors ${
 isActive ? chan.accent.text : "text-zinc-400 dark:text-zinc-500"
 }`}>
 {key === "Phone" ? "Voice Call" : key === "Website" ? "Live Chat" : key === "WhatsApp" ? "Messenger" : "Social DM"}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 {/* --- Connectors Left-to-Center --- */}
 <div className="hidden md:block md:col-span-1 h-56 relative z-0">
 <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
 <defs>
 <linearGradient id="grad-left-Website" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#10b981" />
 <stop offset="100%" stopColor="#7a5af8" />
 </linearGradient>
 <linearGradient id="grad-left-WhatsApp" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#14b8a6" />
 <stop offset="100%" stopColor="#7a5af8" />
 </linearGradient>
 <linearGradient id="grad-left-Phone" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#a855f7" />
 <stop offset="100%" stopColor="#7a5af8" />
 </linearGradient>
 <linearGradient id="grad-left-Instagram" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#ec4899" />
 <stop offset="100%" stopColor="#7a5af8" />
 </linearGradient>
 </defs>

 {CHANNEL_KEYS.map((key, idx) => {
 const isActive = activeChannel === key;
 const yStart = 15 + idx * 23.3; 
 // Horizontal-Flat S-curve path: runs flat for first 40%, bends vertically in middle 16%, runs flat again to end
 const pathD = `M 0,${yStart} H 40 C 48,${yStart} 48,50 56,50 H 100`;

 return (
 <g key={key}>
 {/* Background scrolling line */}
 <path
 d={pathD}
 className={`fill-none transition-all duration-500 ${
 isActive 
 ? `${selectedAccent?.line} stroke-[1.2px] opacity-100`
 : "stroke-zinc-300/40 dark:stroke-zinc-800/80 stroke-[1] animate-dash-scroll"
 }`}
 />
 
 {/* Core Glow path */}
 {isActive && (
 <path
 d={pathD}
 fill="none"
 stroke={`url(#grad-left-${key})`}
 strokeWidth="1.5"
 className="opacity-15 blur-[1px]"
 />
 )}

 {/* Glowing neon comet pulse */}
 {isActive && (
 <g>
 {/* Long trailing dash segment */}
 <path
 d={pathD}
 fill="none"
 stroke={`url(#grad-left-${key})`}
 strokeWidth="1.2"
 strokeDasharray="15 80"
 className="opacity-100"
 >
 <animate
 attributeName="stroke-dashoffset"
 from="120"
 to="0"
 dur="1.2s"
 repeatCount="indefinite"
 />
 </path>

 {/* Glowing head particle */}
 <circle r="1.5" fill="#ffffff" className="shadow-md">
 <animateMotion
 path={pathD}
 dur="1.2s"
 repeatCount="indefinite"
 />
 </circle>
 </g>
 )}
 </g>
 );
 })}
 </svg>
 </div>

 {/* --- Center Column: Operator Engine Core --- */}
 <div className="md:col-span-4 px-space-4 relative z-10 flex justify-center">
 <div className={`relative w-full max-w-[240px] rounded-3xl p-space-6 flex flex-col items-center justify-center text-center transition-all duration-500 border z-10 ${
 activeChannel
 ? `${selectedAccent?.border} ${selectedAccent?.bg} border-[1px]`
 : "border-zinc-200 bg-white/70 dark:border-zinc-800/85 dark:bg-zinc-900/40 shadow-sm"
 }`}>
 


 {/* Visual socket terminal on left edge of core card */}
 <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border transition-all duration-300 z-20 ${
 activeChannel 
 ? "bg-white dark:bg-white border-current"
 : "bg-zinc-200 border-zinc-350 dark:bg-zinc-950 dark:border-zinc-800"
 }`}
 style={{
 color: activeChannel ? selectedAccent?.glowColor : undefined,
 borderColor: activeChannel ? "currentColor" : undefined,
 boxShadow: activeChannel ? `0 0 8px ${selectedAccent?.glowColor}` : undefined
 }}
 />

 {/* Visual socket terminal on right edge of core card */}
 <div className={`absolute right-[-4px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border transition-all duration-300 z-20 ${
 activeChannel 
 ? "bg-white dark:bg-white border-current"
 : "bg-zinc-200 border-zinc-350 dark:bg-zinc-950 dark:border-zinc-800"
 }`}
 style={{
 color: activeChannel ? selectedAccent?.glowColor : undefined,
 borderColor: activeChannel ? "currentColor" : undefined,
 boxShadow: activeChannel ? `0 0 8px ${selectedAccent?.glowColor}` : undefined
 }}
 />

 {/* Rotating Processor Orbital Rings */}
 <div className="relative h-20 w-20 flex items-center justify-center mb-space-3">
 {/* Outer Ring (Dashed) */}
 <svg className={`absolute inset-space-0 w-full h-full transition-all duration-1000 ${
 activeChannel ? "animate-[spin_10s_linear_infinite] opacity-90 scale-105" : "animate-[spin_25s_linear_infinite] opacity-35"
 }`} viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="46" fill="none" 
 stroke={activeChannel ? selectedAccent?.glowColor : "var(--color-primary)"} 
 strokeWidth="1.5" strokeDasharray="8 8 16 8" 
 className="transition-[stroke] duration-500 ease-in-out"
 />
 </svg>

 {/* Inner Ring (Dotted) - Counter-rotating */}
 <svg className={`absolute inset-space-2 w-full h-full transition-all duration-1000 ${
 activeChannel ? "animate-[spin_7s_linear_infinite_reverse] opacity-90" : "animate-[spin_18s_linear_infinite_reverse] opacity-35"
 } scale-[0.85]`} viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="46" fill="none" 
 stroke={activeChannel ? selectedAccent?.glowColor : "var(--neutral-400)"} 
 strokeWidth="2" strokeDasharray="3 6" 
 className="transition-[stroke] duration-500 ease-in-out"
 />
 </svg>

 {/* Central Brain Core */}
 <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-500 border z-10 ${
 activeChannel 
 ? `${selectedAccent?.iconBorder} ${selectedAccent?.iconBg} shadow-[0_0_15px_rgba(122,90,248,0.2)] scale-105`
 : "border-zinc-200/80 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/60"
 }`}>
 <Brain className={`h-5.5 w-5.5 transition-all duration-500 ${
 activeChannel ? selectedAccent?.text : "text-primary animate-pulse"
 }`} />
 </div>
 </div>

 <span className="text-caption font-mono uppercase tracking-widest text-zinc-550 font-bold dark:text-zinc-400 transition-colors">
 Operator Engine
 </span>

 {/* Tags / Processing Pills */}
 <div className="flex flex-wrap justify-center gap-space-1.5 mt-space-4 max-w-48">
 {PILLS.map((pill) => (
 <span
 key={pill.name}
 className={`text-caption font-mono font-bold px-space-2 py-space-0.5 rounded-full border transition-all duration-300 ${getPillStyles(pill.name)}`}
 >
 {pill.name}
 </span>
 ))}
 </div>
 </div>
 </div>

 {/* --- Connectors Center-to-Right --- */}
 <div className="hidden md:block md:col-span-1 h-56 relative z-0">
 <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
 <defs>
 <linearGradient id="grad-right-Bookings" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#7a5af8" />
 <stop offset="100%" stopColor="#purple-500" />
 </linearGradient>
 <linearGradient id="grad-right-CRM-web" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#7a5af8" />
 <stop offset="100%" stopColor="#10b981" />
 </linearGradient>
 <linearGradient id="grad-right-CRM-wa" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#7a5af8" />
 <stop offset="100%" stopColor="#14b8a6" />
 </linearGradient>
 <linearGradient id="grad-right-Analytics" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stopColor="#7a5af8" />
 <stop offset="100%" stopColor="#ec4899" />
 </linearGradient>
 </defs>

 {OUTCOMES.map((out, idx) => {
 const isTarget = activeChannel && CHANNELS[activeChannel].outcome === out.key;
 const yEnd = 20 + idx * 30; 
 // Horizontal-Flat S-curve path: runs flat for first 44%, bends vertically in middle 16%, runs flat again to outcome socket
 const pathD = `M 0,50 H 44 C 52,50 52,${yEnd} 60,${yEnd} H 100`;
 
 // Select matching right gradient based on current active channel
 const getGradId = () => {
 if (out.key === "CRM") {
 return activeChannel === "WhatsApp" ? "grad-right-CRM-wa" : "grad-right-CRM-web";
 }
 return `grad-right-${out.key}`;
 };

 return (
 <g key={out.key}>
 {/* Background scrolling line */}
 <path
 d={pathD}
 className={`fill-none transition-all duration-500 ${
 isTarget 
 ? `${selectedAccent?.line} stroke-[1.2px] opacity-100`
 : "stroke-zinc-300/40 dark:stroke-zinc-800/80 stroke-[1] animate-dash-scroll"
 }`}
 />
 
 {/* Core Glow path */}
 {isTarget && (
 <path
 d={pathD}
 fill="none"
 stroke={`url(#${getGradId()})`}
 strokeWidth="1.5"
 className="opacity-15 blur-[1px]"
 />
 )}

 {/* Glowing neon comet pulse */}
 {isTarget && (
 <g>
 {/* Long trailing dash segment */}
 <path
 d={pathD}
 fill="none"
 stroke={`url(#${getGradId()})`}
 strokeWidth="1.2"
 strokeDasharray="15 80"
 className="opacity-100"
 >
 <animate
 attributeName="stroke-dashoffset"
 from="120"
 to="0"
 dur="1.2s"
 repeatCount="indefinite"
 />
 </path>

 {/* Glowing head particle */}
 <circle r="1.5" fill="#ffffff" className="shadow-md">
 <animateMotion
 path={pathD}
 dur="1.2s"
 repeatCount="indefinite"
 />
 </circle>
 </g>
 )}
 </g>
 );
 })}
 </svg>
 </div>

 {/* --- Right Column: Outcomes --- */}
 <div className="md:col-span-3 space-y-space-3.5 relative z-10">
 <div className="flex items-center gap-space-2 mb-space-4 px-space-1 justify-center md:justify-start">
 <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse"/>
 <span className="text-caption uppercase tracking-wider text-zinc-455 font-mono font-bold dark:text-zinc-500">
 Outcomes
 </span>
 </div>

 {OUTCOMES.map((out) => {
 const isTarget = activeChannel && CHANNELS[activeChannel].outcome === out.key;
 const isDimmed = activeChannel !== null && !isTarget;

 return (
 <div
 key={out.key}
 className={`group relative rounded-2xl border p-space-4 flex items-center gap-space-4 transition-all duration-300 ${
 isTarget
 ? `${selectedAccent?.border} ${selectedAccent?.bg} ${selectedAccent?.text} border-[1px]`
 : isDimmed
 ? "border-zinc-200/50 bg-zinc-50/20 text-zinc-400 dark:border-zinc-800/40 dark:bg-zinc-900/10 dark:text-zinc-500 opacity-60"
 : "border-zinc-200/80 bg-white/70 text-zinc-700 shadow-sm dark:border-zinc-800/85 dark:bg-zinc-900/40 dark:text-zinc-300"
 }`}
 >
 {/* Visual socket terminal on left edge of outcome card */}
 <div className={`absolute left-[-4px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full border transition-all duration-300 z-20 ${
 isTarget 
 ? "bg-white dark:bg-white border-current"
 : "bg-zinc-200 border-zinc-350 dark:bg-zinc-950 dark:border-zinc-800"
 }`}
 style={{
 color: isTarget ? selectedAccent?.glowColor : undefined,
 borderColor: isTarget ? "currentColor" : undefined,
 boxShadow: isTarget ? `0 0 8px ${selectedAccent?.glowColor}` : undefined
 }}
 />

 <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-300 z-10 ${
 isTarget 
 ? `${selectedAccent?.iconBorder} ${selectedAccent?.iconBg}`
 : "border-zinc-200 bg-zinc-50 text-zinc-450 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-400"
 }`}>
 {React.createElement(out.icon, { className: "h-5 w-5 shrink-0 animate-pulse-soft" })}
 </div>
 <div className="flex flex-col z-10">
 <span className="text-sm font-semibold tracking-tight leading-tight">{out.key}</span>
 <span className={`text-caption font-mono tracking-tight transition-colors ${
 isTarget ? selectedAccent?.text : "text-zinc-450 dark:text-zinc-500"
 }`}>
 {out.key === "Bookings" ? "Direct Injection" : out.key === "CRM" ? "Intake Logs" : "Pipeline Audit"}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 </div>

 {/* --- Context / Storytelling Status Block --- */}
 <div
 className={`rounded-2xl p-space-6 min-h-28 flex items-center transition-all duration-500 relative overflow-hidden bg-white border border-zinc-200/80 dark:bg-zinc-950/30 ${
 activeChannel
 ? `${selectedAccent?.descBorder} shadow-sm`
 : "border-zinc-200 dark:border-zinc-800/80"
 }`}
 >
 {/* Inner accent glow under context when hovered */}
 {activeChannel && (
 <div 
 className="absolute inset-space-0 opacity-[0.05] transition-all duration-500 pointer-events-none"
 style={{ 
 background: `radial-gradient(circle at 30px 30px, ${selectedAccent?.glowColor} 0%, transparent 65%)`
 }}
 />
 )}

 {activeChannel ? (
 <div className="flex items-start gap-space-4 w-full relative z-10 animate-content-show">
 <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center border ${selectedAccent?.iconBorder} ${selectedAccent?.iconBg}`}>
 {React.createElement(CHANNELS[activeChannel].icon, { className: `h-5 w-5 ${selectedAccent?.text}` })}
 </div>
 <div className="flex-1">
 <div className="flex flex-wrap items-center gap-space-2 mb-space-1.5">
 <span className={`text-caption uppercase font-bold tracking-wider font-mono ${selectedAccent?.text}`}>
 {activeChannel} Flow
 </span>
 <ArrowRight className={`h-3 w-3 ${selectedAccent?.text} opacity-60`} />
 <span className={`text-caption ${selectedAccent?.text} opacity-90 font-mono font-bold`}>
 routes to &rarr; {CHANNELS[activeChannel].outcome}
 </span>
 </div>
 <p className="text-sm text-zinc-650 leading-relaxed dark:text-zinc-300">
 {CHANNELS[activeChannel].desc}
 </p>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-space-4 w-full justify-center text-center relative z-10 animate-fade-in">
 <div className="flex gap-space-1.5">
 {CHANNEL_KEYS.map((key) => (
 <div key={key} className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800 animate-pulse"/>
 ))}
 </div>
 <p className="text-sm text-zinc-500 leading-relaxed font-semibold dark:text-zinc-400">
 Hover over any input channel above to trace the real-time data flow through the Operator engine.
 </p>
 <div className="flex gap-space-1.5">
 {CHANNEL_KEYS.map((key) => (
 <div key={key} className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800 animate-pulse"/>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
