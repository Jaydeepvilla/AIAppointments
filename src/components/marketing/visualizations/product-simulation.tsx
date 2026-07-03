"use client";

import React, { useState, useEffect, useRef } from"react";
import { MessageSquare, Calendar, Bell, Shield } from"lucide-react";

interface ChatMessage {
 sender:"customer"|"ai";
 text: string;
 isTyping?: boolean;
}

const SIMULATION_SCRIPT = [
 {
 sender:"customer"as const,
 text:"Hi, I need to book a case evaluation consultation for tomorrow afternoon if possible.",
 delay: 1500,
 phase:"receiving"
 },
 {
 sender:"ai"as const,
 text:"Hello! Let me check our calendar availability for a consultation tomorrow afternoon...",
 delay: 2000,
 phase:"checking"
 },
 {
 sender:"ai"as const,
 text:"I have a consultation slot open tomorrow at 2:00 PM or 4:30 PM. Which one would you prefer?",
 delay: 1800,
 phase:"options"
 },
 {
 sender:"customer"as const,
 text:"2:00 PM works great. Can you sync this to my calendar?",
 delay: 1500,
 phase:"selecting"
 },
 {
 sender:"ai"as const,
 text:"Perfect! I've booked your consultation for tomorrow at 2:00 PM and synced it. Please provide your email for confirmation.",
 delay: 2000,
 phase:"booked"
 },
 {
 sender:"customer"as const,
 text:"Sure, it is mark.b@example.com.",
 delay: 1200,
 phase:"email"
 },
 {
 sender:"ai"as const,
 text:"Got it! Your confirmation email and calendar invite have been sent. I have also qualified your case details for the intake team.",
 delay: 1800,
 phase:"done"
 }
];

// --- Subcomponents for Encapsulation ---

function BrowserHeader() {
 return (
 <div className="flex items-center justify-between px-space-5 py-space-3.5 bg-zinc-100/60 border-b border-zinc-200/80 dark:bg-zinc-950 dark:border-zinc-800/80 rounded-t-3xl">
 {/* Mac-like Window Controls */}
 <div className="flex items-center gap-space-2">
 <span className="h-3 w-3 rounded-full bg-[#ff5f56] opacity-80"/>
 <span className="h-3 w-3 rounded-full bg-[#ffbd2e] opacity-80"/>
 <span className="h-3 w-3 rounded-full bg-[#27c93f] opacity-80"/>
 </div>
 {/* Address Bar */}
 <div className="flex-1 max-w-md mx-auto flex items-center justify-center">
 <div className="w-full text-center py-space-1 text-caption font-mono tracking-tight text-zinc-450 bg-white border border-zinc-200/60 dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-500 rounded-lg select-none">
 nexx-ai-widget.vercel.app
 </div>
 </div>
 {/* Balance spacer */}
 <div className="w-14 hidden sm:block"/>
 </div>
 );
}

function ChatPane({ chatLog, chatContainerRef }: { chatLog: ChatMessage[], chatContainerRef: React.RefObject<HTMLDivElement | null> }) {
 return (
 <div className="bg-zinc-50/50 dark:bg-zinc-950 p-space-5 flex flex-col justify-between h-96 rounded-none lg:rounded-bl-3xl">
 {/* Pane Header */}
 <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-space-3 mb-space-3">
 <div className="flex items-center gap-space-2">
 <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400"/>
 <span className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-700 dark:text-zinc-300">
 Live Customer Conversation
 </span>
 </div>
 <span className="text-caption uppercase font-mono font-semibold tracking-widest px-space-2 py-space-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-500">
 Website Widget
 </span>
 </div>

 {/* Conversation history list */}
 <div
 ref={chatContainerRef}
 role="log"
 aria-live="polite"
 className="flex-1 overflow-y-auto space-y-space-3 pr-space-1 text-body-sm leading-relaxed no-scrollbar"
 >
 {chatLog.length === 0 ? (
 <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-center p-space-4 font-medium animate-pulse">
 Waiting for incoming client inquiry...
 </div>
 ) : (
 chatLog.map((turn, i) => (
 <div
 key={i}
 className={`flex flex-col max-w-[80%] ${
 turn.sender ==="customer"
 ?"mr-auto items-start animate-fade-in"
 :"ml-auto items-end"
 }`}
 >
 <div
 className={`rounded-2xl px-space-4 py-space-2 ${
 turn.sender ==="customer"
 ?"bg-white border border-zinc-200/60 text-zinc-800 rounded-tl-none dark:bg-zinc-900/60 dark:border-zinc-850 dark:text-zinc-200"
 : turn.isTyping
 ?"bg-purple-50 border border-purple-200 text-purple-600 animate-pulse rounded-tr-none dark:bg-purple-950/20 dark:border-purple-500/20 dark:text-purple-400"
 :"bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white rounded-tr-none font-medium"
 }`}
 >
 {turn.text}
 </div>
 </div>
 ))
 )}
 </div>

 {/* Pane Footer */}
 <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-space-3 text-caption font-mono font-semibold text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
 <span>Powered by Operator Brain</span>
 <span className="flex items-center gap-space-1.5 text-purple-600 dark:text-purple-400">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
 </span>
 AI Active
 </span>
 </div>
 </div>
 );
}

function MetricsPane({ dbState }: { dbState: any }) {
 return (
 <div className="bg-zinc-50/30 dark:bg-zinc-900/60 p-space-5 flex flex-col justify-between h-96 border-t lg:border-t-space-0 lg:border-l border-zinc-200/80 dark:border-zinc-800/80 rounded-b-3xl lg:rounded-bl-none lg:rounded-br-3xl">
 {/* Pane Header */}
 <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-space-3 mb-space-3">
 <div className="flex items-center gap-space-2">
 <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400"/>
 <span className="text-xs uppercase font-mono font-semibold tracking-wider text-zinc-700 dark:text-zinc-300">
 Live Calendar & CRM State
 </span>
 </div>
 <div className="relative cursor-pointer hover:opacity-85 transition-opacity">
 <Bell className={`h-4 w-4 text-zinc-500 dark:text-zinc-400 ${dbState.notification ?"animate-[bounce_1s_infinite]":""}`} />
 {dbState.notification && (
 <span className="absolute -top-space-0.5 -right-space-0.5 h-2 w-2 rounded-full bg-emerald-500 "/>
 )}
 </div>
 </div>

 {/* Sync status cards */}
 <div className="flex-1 space-y-space-4 pt-space-2">
 {/* System Phase Indicator */}
 <div className="rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/30 p-space-4 flex justify-between items-center">
 <div className="flex flex-col gap-space-1.5">
 <span className="text-caption uppercase tracking-widest font-mono font-semibold text-zinc-400 dark:text-zinc-500 leading-none">
 AI Processing State
 </span>
 <p className="text-body-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200 capitalize transition-all duration-300">
 {dbState.activePhase}
 </p>
 </div>
 <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse "/>
 </div>

 {/* Simulated Calendar Sync Card */}
 <div className="rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/30 p-space-4 space-y-space-3">
 <span className="text-caption uppercase tracking-widest font-mono font-semibold text-zinc-450 dark:text-zinc-500 leading-none">
 Google Calendar Sync
 </span>
 <div className="flex justify-between items-center text-body-sm leading-none">
 <span className="text-zinc-500 dark:text-zinc-400 font-medium">Friday 2:00 PM Slot:</span>
 <span className={`px-space-3 py-space-1 rounded-full text-[10px] font-mono font-normal tracking-wider border transition-all duration-300 ${
 dbState.calendarStatus ==="Available"
 ?"text-emerald-600 bg-emerald-50 border-emerald-250 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
 : dbState.calendarStatus.startsWith("Booked")
 ?"text-purple-600 bg-purple-50 border-purple-250 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400 "
 :"text-blue-600 bg-blue-50 border-blue-250 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400 animate-pulse"
 }`}>
 {dbState.calendarStatus}
 </span>
 </div>
 </div>

 {/* Metrics Counters */}
 <div className="grid grid-cols-2 gap-space-4">
 <div className="rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/30 p-space-4">
 <span className="text-caption uppercase tracking-widest font-mono font-semibold text-zinc-400 dark:text-zinc-500 leading-none">
 Calls Captured
 </span>
 <p className="text-heading-md font-semibold tracking-tight text-zinc-850 dark:text-zinc-100 mt-space-1 font-mono transition-all duration-500">
 {dbState.callCount}
 </p>
 </div>

 <div className="rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/30 p-space-4">
 <span className="text-caption uppercase tracking-widest font-mono font-semibold text-zinc-400 dark:text-zinc-500 leading-none">
 Database Health
 </span>
 <p className="text-heading-md font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 mt-space-1 font-mono">
 100%
 </p>
 </div>
 </div>
 </div>

 {/* Pane Footer */}
 <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-space-3 text-caption font-mono font-semibold text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
 <span className="flex items-center gap-space-1">
 <Shield className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400"/> Data Isolated (SOC2 Secure)
 </span>
 <span>Update interval: Real-time</span>
 </div>
 </div>
 );
}

export function ProductSimulation() {
 const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
 const [dbState, setDbState] = useState({
 calendarStatus:"Available",
 callCount: 46,
 notification: false,
 activePhase:"idle"
 });
 const [simStep, setSimStep] = useState(0);
 const chatContainerRef = useRef<HTMLDivElement>(null);

 const updateDatabaseState = React.useCallback((phase: string) => {
 switch (phase) {
 case"receiving":
 setDbState((prev) => ({ ...prev, activePhase:"Intake Request Recieved"}));
 break;
 case"checking":
 setDbState((prev) => ({ ...prev, activePhase:"Searching Calendar slots...", calendarStatus:"Checking availability..."}));
 break;
 case"options":
 setDbState((prev) => ({ ...prev, activePhase:"Displaying Consultation Options", calendarStatus:"Slots Found: 2:00 PM, 4:30 PM"}));
 break;
 case"selecting":
 setDbState((prev) => ({ ...prev, activePhase:"Slot Selected (2:00 PM)"}));
 break;
 case"booked":
 setDbState((prev) => ({
 ...prev,
 activePhase:"Syncing Google Calendar...",
 calendarStatus:"Booked (Mark B. - 2:00 PM)",
 callCount: 47,
 notification: true
 }));
 break;
 case"email":
 setDbState((prev) => ({ ...prev, activePhase:"Adding Email contact card"}));
 break;
 case"done":
 setDbState((prev) => ({ ...prev, activePhase:"Operation Completed (Sync Safe)"}));
 break;
 default:
 break;
 }
 }, []);

 useEffect(() => {
 if (chatContainerRef.current) {
 chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
 }
 }, [chatLog]);

 useEffect(() => {
 if (simStep >= SIMULATION_SCRIPT.length) {
 // Reset simulation loop after 10 seconds of idle
 const timer = setTimeout(() => {
 setChatLog([]);
 setDbState({
 calendarStatus:"Available",
 callCount: 46,
 notification: false,
 activePhase:"idle"
 });
 setSimStep(0);
 }, 10000);
 return () => clearTimeout(timer);
 }

 const scriptItem = SIMULATION_SCRIPT[simStep];

 const timer = setTimeout(() => {
 // If AI message, show typing state first
 if (scriptItem.sender ==="ai") {
 setChatLog((prev) => [...prev, { sender:"ai", text:"...", isTyping: true }]);

 setTimeout(() => {
 setChatLog((prev) => {
 const list = [...prev];
 list[list.length - 1] = { sender:"ai", text: scriptItem.text };
 return list;
 });
 updateDatabaseState(scriptItem.phase);
 setSimStep((prev) => prev + 1);
 }, 1000);
 } else {
 setChatLog((prev) => [...prev, { sender:"customer", text: scriptItem.text }]);
 updateDatabaseState(scriptItem.phase);
 setSimStep((prev) => prev + 1);
 }
 }, scriptItem.delay);

 return () => clearTimeout(timer);
 }, [simStep, updateDatabaseState]);

 return (
 <div className="relative mx-auto max-w-5xl w-full">
 {/* Glow highlight frame borders */}
 <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[hsl(var(--foreground)/0.06)] to-transparent pointer-events-none"/>

 {/* ── Browser Window Shell Container ── */}
 <div className="relative rounded-3xl border border-zinc-200/80 bg-white overflow-hidden mb-space-6 dark:border-zinc-800/80 dark:bg-zinc-950">
 <BrowserHeader />

 {/* ── Two-pane grid layout inside browser window ── */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-200/60 dark:bg-zinc-800/60 rounded-b-3xl">
 <ChatPane chatLog={chatLog} chatContainerRef={chatContainerRef} />
 <MetricsPane dbState={dbState} />
 </div>
 </div>
 </div>
 );
}
