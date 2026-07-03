"use client";

import React, { useState } from"react";
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
} from"lucide-react";

/* ── Mappings and Details ────────────────────────────────────────────────── */

const CHANNELS = {
 Phone: {
 icon: Phone,
 outcome:"Bookings",
 desc:"A customer calls your business line. Operator picks up in 1 second, checks calendar availability, and books the appointment autonomously.",
 accent: {
 text:"text-purple-400 [.light_&]:text-purple-600",
 border:"border-purple-500/40 [.light_&]:border-purple-200",
 bg:"bg-purple-950/20 [.light_&]:bg-purple-50/80",
 glow:" [.light_& border-purple-500/50 [.light_&]:border-purple-300",
 line:"stroke-purple-400 [.light_&]:stroke-purple-500",
 grad:"url(#grad-left-Phone)",
 iconBorder:"border-purple-500/30 [.light_&]:border-purple-200",
 iconBg:"bg-purple-950/40 [.light_&]:bg-purple-50",
 descBorder:"border-purple-500/40 [.light_&]:border-purple-200",
 glowColor:"rgba(168,85,247,0.18)"
 },
 },
 Website: {
 icon: Globe,
 outcome:"CRM",
 desc:"A visitor starts a web chat. Operator answers FAQs from your knowledge base, qualifies interest, and creates a CRM contact card.",
 accent: {
 text:"text-emerald-400 [.light_&]:text-emerald-600",
 border:"border-emerald-500/40 [.light_&]:border-emerald-200",
 bg:"bg-emerald-950/20 [.light_&]:bg-emerald-50/80",
 glow:" [.light_& border-emerald-500/50 [.light_&]:border-emerald-300",
 line:"stroke-emerald-400 [.light_&]:stroke-emerald-500",
 grad:"url(#grad-left-Website)",
 iconBorder:"border-emerald-500/30 [.light_&]:border-emerald-200",
 iconBg:"bg-emerald-950/40 [.light_&]:bg-emerald-50",
 descBorder:"border-emerald-500/40 [.light_&]:border-emerald-200",
 glowColor:"rgba(16,185,129,0.18)"
 },
 },
 WhatsApp: {
 icon: MessageSquare,
 outcome:"CRM",
 desc:"Inbound messages on WhatsApp Business are handled instantly. Operator qualifies leads and captures booking intent.",
 accent: {
 text:"text-teal-400 [.light_&]:text-teal-600",
 border:"border-teal-500/40 [.light_&]:border-teal-200",
 bg:"bg-teal-950/20 [.light_&]:bg-teal-50/80",
 glow:" [.light_& border-teal-500/50 [.light_&]:border-teal-300",
 line:"stroke-teal-400 [.light_&]:stroke-teal-500",
 grad:"url(#grad-left-WhatsApp)",
 iconBorder:"border-teal-500/30 [.light_&]:border-teal-200",
 iconBg:"bg-teal-950/40 [.light_&]:bg-teal-50",
 descBorder:"border-teal-500/40 [.light_&]:border-teal-200",
 glowColor:"rgba(20,184,166,0.18)"
 },
 },
 Instagram: {
 icon: Camera,
 outcome:"Analytics",
 desc:"Prospects send Instagram DMs inquiring about services. Operator answers pricing questions and flags hot prospects in analytics.",
 accent: {
 text:"text-pink-400 [.light_&]:text-pink-600",
 border:"border-pink-500/40 [.light_&]:border-pink-200",
 bg:"bg-pink-950/20 [.light_&]:bg-pink-50/80",
 glow:" [.light_& border-pink-500/50 [.light_&]:border-pink-300",
 line:"stroke-pink-400 [.light_&]:stroke-pink-500",
 grad:"url(#grad-left-Instagram)",
 iconBorder:"border-pink-500/30 [.light_&]:border-pink-200",
 iconBg:"bg-pink-950/40 [.light_&]:bg-pink-50",
 descBorder:"border-pink-500/40 [.light_&]:border-pink-200",
 glowColor:"rgba(236,72,153,0.18)"
 },
 },
} as const;

type ChannelKey = keyof typeof CHANNELS;
const CHANNEL_KEYS: ChannelKey[] = ["Website","WhatsApp","Phone","Instagram"];

const OUTCOMES = [
 { key:"Bookings", icon: Calendar, desc:"Direct calendar injection & confirmations"},
 { key:"CRM", icon: Database, desc:"Instant profile updates & tag logs"},
 { key:"Analytics", icon: BarChart3, desc:"Frictionless pipeline metrics & audit logs"},
] as const;

const PILLS = [
 {
 name:"#AnalyzeIntent",
 styleClass: {
 active:"text-purple-400 bg-purple-950/30 border-purple-500/30 [.light_&]:text-purple-600 [.light_&]:bg-purple-50 [.light_&]:border-purple-200",
 normal:"text-zinc-400 bg-zinc-900/60 border-zinc-800/80 [.light_&]:text-zinc-500 [.light_&]:bg-zinc-100 [.light_&]:border-zinc-200",
 dimmed:"text-zinc-700 bg-zinc-950/10 border-zinc-900/30 opacity-25 scale-95 [.light_&]:text-zinc-300 [.light_&]:bg-zinc-50/50 [.light_&]:border-zinc-100"
 }
 },
 {
 name:"#CalendarSync",
 styleClass: {
 active:"text-blue-400 bg-blue-950/30 border-blue-500/30 [.light_&]:text-blue-600 [.light_&]:bg-blue-50 [.light_&]:border-blue-200",
 normal:"text-zinc-400 bg-zinc-900/60 border-zinc-800/80 [.light_&]:text-zinc-500 [.light_&]:bg-zinc-100 [.light_&]:border-zinc-200",
 dimmed:"text-zinc-700 bg-zinc-950/10 border-zinc-900/30 opacity-25 scale-95 [.light_&]:text-zinc-300 [.light_&]:bg-zinc-50/50 [.light_&]:border-zinc-100"
 }
 },
 {
 name:"#QualifyLeads",
 styleClass: {
 active:"text-pink-400 bg-pink-950/30 border-pink-500/30 [.light_&]:text-pink-600 [.light_&]:bg-pink-50 [.light_&]:border-pink-200",
 normal:"text-zinc-400 bg-zinc-900/60 border-zinc-800/80 [.light_&]:text-zinc-500 [.light_&]:bg-zinc-100 [.light_&]:border-zinc-200",
 dimmed:"text-zinc-700 bg-zinc-950/10 border-zinc-900/30 opacity-25 scale-95 [.light_&]:text-zinc-300 [.light_&]:bg-zinc-50/50 [.light_&]:border-zinc-100"
 }
 },
 {
 name:"#CRMUpdates",
 styleClass: {
 active:"text-emerald-400 bg-emerald-950/30 border-emerald-500/30 [.light_&]:text-emerald-600 [.light_&]:bg-emerald-50 [.light_&]:border-emerald-200",
 normal:"text-zinc-400 bg-zinc-900/60 border-zinc-800/80 [.light_&]:text-zinc-500 [.light_&]:bg-zinc-100 [.light_&]:border-zinc-200",
 dimmed:"text-zinc-700 bg-zinc-950/10 border-zinc-900/30 opacity-25 scale-95 [.light_&]:text-zinc-300 [.light_&]:bg-zinc-50/50 [.light_&]:border-zinc-100"
 }
 },
];

export function InteractiveArchitecture() {
 const [activeChannel, setActiveChannel] = useState<ChannelKey | null>(null);

 const selectedAccent = activeChannel ? CHANNELS[activeChannel].accent : null;

 const getPillClass = (pillName: string) => {
 if (!activeChannel) return"normal";
 
 // Website & WhatsApp route to CRM
 if (activeChannel ==="Website"|| activeChannel ==="WhatsApp") {
 if (pillName ==="#CalendarSync") return"dimmed";
 return"active";
 }
 // Phone routes to Bookings
 if (activeChannel ==="Phone") {
 if (pillName ==="#CRMUpdates") return"dimmed";
 return"active";
 }
 // Instagram routes to Analytics
 if (activeChannel ==="Instagram") {
 if (pillName ==="#CalendarSync") return"dimmed";
 return"active";
 }
 return"normal";
 };

 return (
 <div className="mx-auto max-w-4xl w-full">
 {/* Dynamic Keyframes Injection */}
 <style dangerouslySetInnerHTML={{__html:`
 @keyframes float {
 0%, 100% { transform: translateY(0px); }
 50% { transform: translateY(-5px); }
 }
 .animate-float {
 animation: float 3s ease-in-out infinite;
 }
 `}} />

 {/* ── Outer Node Container ── */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-space-6 md:gap-space-0 items-center justify-between relative rounded-3xl p-space-6 md:p-space-10 bg-zinc-950 border border-zinc-800/80 overflow-hidden mb-space-6 [.light_&]:bg-zinc-50/70 [.light_&]:border-zinc-200/80">
 
 {/* Sleek Line Grid Layout background */}
 <div className="absolute inset-space-0 line-grid opacity-[0.06] pointer-events-none grid-fade-y [.light_&]:opacity-[0.05]"/>

 {/* Dynamic mesh glow behind engine */}
 <div 
 className="absolute top-space-1/2 left-space-1/2 -translate-x-space-1/2 -translate-y-space-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700"
 style={{ 
 background: activeChannel 
 ?`radial-gradient(circle, ${CHANNELS[activeChannel].accent.glowColor} 0%, transparent 70%)`
 :"radial-gradient(circle, rgba(122,90,248,0.06) 0%, transparent 65%)"
 }}
 />

 {/* ── Left Column: Channels (col-span-3) ── */}
 <div className="md:col-span-3 space-y-space-3.5 relative z-10">
 <div className="flex items-center gap-space-2 mb-space-4 px-space-1 justify-center md:justify-start">
 <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 [.light_&]:bg-zinc-400"/>
 <span className="text-caption uppercase tracking-widest text-zinc-500 font-mono font-semibold [.light_&]:text-zinc-400">
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
 className={`rounded-2xl border p-space-4 flex items-center gap-space-4 transition-all duration-300 cursor-pointer ${
 isActive
 ?`${chan.accent.border} ${chan.accent.bg} ${chan.accent.text} ${chan.accent.glow} scale-[1.04]`
 : isDimmed
 ?"border-zinc-900/30 bg-zinc-950/10 text-zinc-700 opacity-25 scale-[0.97] blur-none [.light_&]:border-zinc-100 [.light_&]:bg-zinc-50/10 [.light_&]:text-zinc-300"
 :"border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md text-zinc-300 hover:border-zinc-700 hover:text-zinc-105 hover:bg-zinc-850/60 [.light_&]:border-zinc-200/80 [.light_&]:bg-white [.light_&]:text-zinc-700 [.light_&]:hover:border-zinc-300 [.light_&]:hover:text-zinc-900 [.light_&]:hover:bg-zinc-50/50 [.light_& [.light_&"
 }`}
 >
 <div className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
 isActive 
 ?`${chan.accent.iconBorder} ${chan.accent.iconBg}`
 :"border-zinc-800 bg-zinc-950/60 text-zinc-400 [.light_&]:border-zinc-200/60 [.light_&]:bg-zinc-50 [.light_&]:text-zinc-500"
 }`}>
 <Icon className="h-4.5 w-4.5 shrink-0"/>
 </div>
 <div className="flex flex-col">
 <span className="text-body-sm font-semibold tracking-tight leading-tight">{key}</span>
 <span className={`text-[10px] font-mono tracking-tight transition-colors ${
 isActive ? chan.accent.text :"text-zinc-500 [.light_&]:text-zinc-400"
 }`}>
 {key ==="Phone"?"Voice Call": key ==="Website"?"Live Chat": key ==="WhatsApp"?"Messenger":"Social DM"}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 {/* ── Connectors Left-to-Center (col-span-1) ── */}
 <div className="hidden md:block md:col-span-1 h-56 relative z-0">
 <svg className="w-full h-full overflow-visible"viewBox="0 0 100 100"preserveAspectRatio="none">
 <defs>
 <linearGradient id="grad-left-Website"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#10b981"/>
 <stop offset="50%"stopColor="#3b82f6"/>
 <stop offset="100%"stopColor="#8b5cf6"/>
 </linearGradient>
 <linearGradient id="grad-left-WhatsApp"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#14b8a6"/>
 <stop offset="50%"stopColor="#3b82f6"/>
 <stop offset="100%"stopColor="#8b5cf6"/>
 </linearGradient>
 <linearGradient id="grad-left-Phone"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#a855f7"/>
 <stop offset="100%"stopColor="#8b5cf6"/>
 </linearGradient>
 <linearGradient id="grad-left-Instagram"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#ec4899"/>
 <stop offset="50%"stopColor="#6366f1"/>
 <stop offset="100%"stopColor="#8b5cf6"/>
 </linearGradient>
 </defs>

 {CHANNEL_KEYS.map((key, idx) => {
 const isActive = activeChannel === key;
 const yStart = 15 + idx * 23.3; // Distribute vertically
 const pathD =`M 0,${yStart} C 50,${yStart} 50,50 100,50`;

 return (
 <g key={key}>
 {/* Background Scrolling Path */}
 <path
 d={pathD}
 className={`fill-none transition-all duration-500 ${
 isActive 
 ?`${selectedAccent?.line} stroke-[2px] opacity-100`
 :"stroke-zinc-800/80 stroke-[1px] animate-dash-scroll [.light_&]:stroke-zinc-200"
 }`}
 />
 {/* Glow layer behind active path */}
 {isActive && (
 <path
 d={pathD}
 className="fill-none stroke-[4px] opacity-30 [.light_&]:opacity-20 blur-[2px]"
 stroke={`url(#grad-left-${key})`}
 />
 )}
 {/* Glowing comet / pulse particle */}
 {isActive && (
 <g>
 <circle r="6"fill={`url(#grad-left-${key})`} className="opacity-40 [.light_&]:opacity-30">
 <animateMotion
 path={pathD}
 dur="1.8s"
 repeatCount="indefinite"
 />
 </circle>
 <circle r="2.5"fill="#ffffff">
 <animateMotion
 path={pathD}
 dur="1.8s"
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

 {/* ── Center Column: Operator Hub (col-span-4) ── */}
 <div className="md:col-span-4 flex flex-col items-center justify-center relative z-10 py-space-6 md:py-space-0 px-space-2">
 <div
 className={`rounded-2xl border p-space-6 flex flex-col items-center justify-center transition-all duration-500 relative w-full text-center ${
 activeChannel
 ?`${selectedAccent?.border} ${selectedAccent?.bg} ${selectedAccent?.glow}`
 :"border-zinc-800 bg-zinc-900/40 [.light_&]:border-zinc-200/80 [.light_&]:bg-white [.light_& [.light_&"
 }`}
 >
 {/* Glowing background inside card */}
 <div className={`absolute inset-space-0 rounded-2xl bg-radial from-current opacity-[0.03] transition-all duration-500 pointer-events-none ${activeChannel ? selectedAccent?.text :"text-transparent"}`} />

 {/* Glowing double border highlight */}
 <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-b -z-10 ${
 activeChannel 
 ?"from-white/10 to-transparent [.light_&]:from-zinc-200/40"
 :"from-zinc-700/20 to-transparent [.light_&]:from-zinc-100/30"
 }`} />

 {/* Radar wave ping animation */}
 {activeChannel && (
 <div 
 className="absolute -inset-space-2.5 rounded-2xl border pointer-events-none transition-all duration-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
 style={{ borderColor: selectedAccent?.glowColor }}
 />
 )}

 <Brain className={`h-8 w-8 mb-space-3 transition-all duration-500 animate-float ${
 activeChannel ? selectedAccent?.text :"text-primary"
 }`} />

 <span className="text-caption font-mono uppercase tracking-widest text-zinc-250 font-semibold [.light_&]:text-zinc-700">
 Operator Engine
 </span>

 {/* Tag Pills */}
 <div className="flex flex-wrap justify-center gap-space-1.5 mt-space-4 max-w-xs">
 {PILLS.map((pill) => {
 const state = getPillClass(pill.name);
 const pillStyles = pill.styleClass[state];

 return (
 <span
 key={pill.name}
 className={`text-[9px] font-mono font-semibold px-space-2 py-space-0.5 rounded-full border transition-all duration-500 ${pillStyles}`}
 >
 {pill.name}
 </span>
 );
 })}
 </div>
 </div>
 </div>

 {/* ── Connectors Center-to-Right (col-span-1) ── */}
 <div className="hidden md:block md:col-span-1 h-56 relative z-0">
 <svg className="w-full h-full overflow-visible"viewBox="0 0 100 100"preserveAspectRatio="none">
 <defs>
 <linearGradient id="grad-right-Bookings"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#8b5cf6"/>
 <stop offset="100%"stopColor="#a855f7"/>
 </linearGradient>
 <linearGradient id="grad-right-CRM"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#8b5cf6"/>
 <stop offset="100%"stopColor="#14b8a6"/>
 </linearGradient>
 <linearGradient id="grad-right-Analytics"x1="0%"y1="0%"x2="100%"y2="0%">
 <stop offset="0%"stopColor="#8b5cf6"/>
 <stop offset="100%"stopColor="#ec4899"/>
 </linearGradient>
 </defs>

 {OUTCOMES.map((out, idx) => {
 const isTarget = activeChannel && CHANNELS[activeChannel].outcome === out.key;
 const yEnd = 20 + idx * 30; // Distribute outcomes vertically
 const pathD =`M 0,50 C 50,50 50,${yEnd} 100,${yEnd}`;

 return (
 <g key={out.key}>
 {/* Background Scrolling Path */}
 <path
 d={pathD}
 className={`fill-none transition-all duration-500 ${
 isTarget 
 ?`${selectedAccent?.line} stroke-[2px] opacity-100`
 :"stroke-zinc-800/80 stroke-[1px] animate-dash-scroll [.light_&]:stroke-zinc-200"
 }`}
 />
 {/* Glow layer behind active path */}
 {isTarget && (
 <path
 d={pathD}
 className="fill-none stroke-[4px] opacity-30 [.light_&]:opacity-20 blur-[2px]"
 stroke={`url(#grad-right-${out.key})`}
 />
 )}
 {/* Glowing comet / pulse particle */}
 {isTarget && (
 <g>
 <circle r="6"fill={`url(#grad-right-${out.key})`} className="opacity-40 [.light_&]:opacity-30">
 <animateMotion
 path={pathD}
 dur="1.8s"
 repeatCount="indefinite"
 />
 </circle>
 <circle r="2.5"fill="#ffffff">
 <animateMotion
 path={pathD}
 dur="1.8s"
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

 {/* ── Right Column: Outcomes (col-span-3) ── */}
 <div className="md:col-span-3 space-y-space-3.5 relative z-10">
 <div className="flex items-center gap-space-2 mb-space-4 px-space-1 justify-center md:justify-start">
 <div className="h-1.5 w-1.5 rounded-full bg-zinc-700 [.light_&]:bg-zinc-400"/>
 <span className="text-caption uppercase tracking-widest text-zinc-500 font-mono font-semibold [.light_&]:text-zinc-400">
 Outcomes
 </span>
 </div>

 {OUTCOMES.map((out) => {
 const isTarget = activeChannel && CHANNELS[activeChannel].outcome === out.key;
 const isDimmed = activeChannel !== null && !isTarget;

 return (
 <div
 key={out.key}
 className={`rounded-2xl border p-space-4 flex items-center gap-space-4 transition-all duration-300 ${
 isTarget
 ?`${selectedAccent?.border} ${selectedAccent?.bg} ${selectedAccent?.text} ${selectedAccent?.glow} scale-[1.04]`
 : isDimmed
 ?"border-zinc-900/30 bg-zinc-950/10 text-zinc-700 opacity-25 scale-[0.97] blur-none [.light_&]:border-zinc-100 [.light_&]:bg-zinc-50/10 [.light_&]:text-zinc-300"
 :"border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md text-zinc-300 [.light_&]:border-zinc-200/80 [.light_&]:bg-white [.light_&]:text-zinc-700"
 }`}
 >
 <div className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
 isTarget 
 ?`${selectedAccent?.iconBorder} ${selectedAccent?.iconBg}`
 :"border-zinc-800 bg-zinc-950/60 text-zinc-450 [.light_&]:border-zinc-200/60 [.light_&]:bg-zinc-50 [.light_&]:text-zinc-500"
 }`}>
 {React.createElement(out.icon, { className:"h-4.5 w-4.5 shrink-0"})}
 </div>
 <div className="flex flex-col">
 <span className="text-body-sm font-semibold tracking-tight leading-tight">{out.key}</span>
 <span className={`text-[10px] font-mono tracking-tight transition-colors ${
 isTarget ? selectedAccent?.text :"text-zinc-500 [.light_&]:text-zinc-450"
 }`}>
 {out.key ==="Bookings"?"Direct Injection": out.key ==="CRM"?"Intake Logs":"Pipeline Audit"}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 </div>

 {/* ── Context / Storytelling Block ── */}
 <div
 className={`rounded-2xl p-space-6 min-h-28 flex items-center transition-all duration-500 relative overflow-hidden bg-zinc-950 border [.light_&]:bg-white/80 ${
 activeChannel
 ?`${selectedAccent?.descBorder}`
 :"border-zinc-800/80 [.light_&]:border-zinc-200/80"
 }`}
 >
 {/* Sleek radial gradient overlay on left when active */}
 {activeChannel && (
 <div 
 className="absolute inset-space-0 opacity-[0.04] transition-all duration-500 pointer-events-none"
 style={{ 
 background:`radial-gradient(circle at 20px 20px, ${selectedAccent?.glowColor} 0%, transparent 65%)`
 }}
 />
 )}

 {activeChannel ? (
 <div className="flex items-start gap-space-4 w-full relative z-10">
 <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center border ${selectedAccent?.iconBorder} ${selectedAccent?.iconBg}`}>
 {React.createElement(CHANNELS[activeChannel].icon, { className:`h-5 w-5 ${selectedAccent?.text}`})}
 </div>
 <div className="flex-1">
 <div className="flex flex-wrap items-center gap-space-2 mb-space-1.5">
 <span className={`text-[10px] uppercase font-semibold tracking-widest font-mono ${selectedAccent?.text}`}>
 {activeChannel} Flow
 </span>
 <ArrowRight className={`h-3 w-3 ${selectedAccent?.text}`} />
 <span className={`text-[10px] ${selectedAccent?.text} opacity-85 font-mono`}>
 routes to → {CHANNELS[activeChannel].outcome}
 </span>
 </div>
 <p className="text-body-sm text-zinc-300 leading-relaxed [.light_&]:text-zinc-600">
 {CHANNELS[activeChannel].desc}
 </p>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-space-4 w-full justify-center text-center relative z-10">
 <div className="flex gap-space-1.5">
 {CHANNEL_KEYS.map((key) => (
 <div key={key} className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse [.light_&]:bg-zinc-300"/>
 ))}
 </div>
 <p className="text-body-sm text-zinc-300 leading-relaxed font-medium [.light_&]:text-zinc-600">
 Hover over any input channel above to trace the real-time data flow through the Operator engine.
 </p>
 <div className="flex gap-space-1.5">
 {CHANNEL_KEYS.map((key) => (
 <div key={key} className="h-1.5 w-1.5 rounded-full bg-zinc-700 animate-pulse [.light_&]:bg-zinc-300"/>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
