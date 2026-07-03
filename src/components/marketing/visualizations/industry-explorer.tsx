"use client";

import React, { useState, useEffect, useRef } from"react";
import { Stethoscope, Scissors, Scale, Home, Dumbbell, Sparkles } from"lucide-react";
import { Button } from"@/components/shared/button";

type IndustryKey ="dental"|"medical"|"salon"|"law"|"realestate"|"gym";

interface IndustryData {
 name: string;
 icon: React.ReactNode;
 challenge: string;
 solution: string;
 metrics: string;
 metricLabel: string;
 dialogue: Array<{ speaker:"customer"|"ai"; text: string }>;
}

const INDUSTRIES_DATA: Record<IndustryKey, IndustryData> = {
 dental: {
 name:"Dental Clinics",
 icon: <Stethoscope className="h-4 w-4"/>,
 challenge:"High volume of emergency appointments and checkup inquiries outside working hours, leading to patient leak to other local providers.",
 solution:"AI integrates with Google Calendar or Dentrix to triage emergency cases, verify dental insurance coverage limits, and book cleanings instantly.",
 metrics:"+40%",
 metricLabel:"increase in checkups booked",
 dialogue: [
 { speaker:"customer", text:"Hi, I have a chipped tooth and need to book an emergency slot tomorrow."},
 { speaker:"ai", text:"I can help with that. Is this causing severe pain or bleeding? I have an emergency cleaning slot open tomorrow at 10:00 AM with Dr. Mitchell. Shall I book it?"},
 { speaker:"customer", text:"Yes please, 10:00 AM works. Do you accept Delta Dental?"},
 { speaker:"ai", text:"Yes, we accept Delta Dental PPO. I have secured your slot. A confirmation text is on its way!"}
 ]
 },
 medical: {
 name:"Medical Clinics",
 icon: <Stethoscope className="h-4 w-4 text-success-500"/>,
 challenge:"Long hold times on phone calls triage patients slowly and tie up receptionist staff, causing administrative bottlenecks.",
 solution:"The AI triages incoming patient symptom severity, answers generic practice FAQs (parking, copays), and schedules telehealth/in-person visits.",
 metrics:"-60%",
 metricLabel:"reduction in phone load",
 dialogue: [
 { speaker:"customer", text:"Hello, I need to schedule a follow-up consultation for my prescription renewal."},
 { speaker:"ai", text:"Hello! I can guide you through that. Our next available slot for a telehealth consultation is Wednesday at 2:00 PM. Would that suit you?"},
 { speaker:"customer", text:"Yes, that works. What copay applies?"},
 { speaker:"ai", text:"Prescription follow-ups generally incur a standard $25 copay, depending on your copay structure. I have booked that for Wednesday at 2:00 PM."}
 ]
 },
 salon: {
 name:"Salons & Spas",
 icon: <Scissors className="h-4 w-4 text-error-500"/>,
 challenge:"Stylists missing calls mid-treatment or appointments getting canceled last minute without quick rescheduling.",
 solution:"AI schedules treatments 24/7, handles rescheduling flow directly via WhatsApp, and collects deposits to avoid no-shows.",
 metrics:"94%",
 metricLabel:"salon calendar utilization",
 dialogue: [
 { speaker:"customer", text:"Hi! Can I book a balayage and haircut for this Saturday afternoon?"},
 { speaker:"ai", text:"Hi! I have openings on Saturday at 1:30 PM with senior stylist Priya. The balayage session takes about 3 hours."},
 { speaker:"customer", text:"Perfect. Book that for me."},
 { speaker:"ai", text:"Great! I have reserved Saturday at 1:30 PM. To confirm, I am sending a secure link to collect the standard $50 booking deposit."}
 ]
 },
 law: {
 name:"Law Firms",
 icon: <Scale className="h-4 w-4 text-warning-500"/>,
 challenge:"Unqualified case leads calling in and taking up consultation hours of valuable billable attorney time.",
 solution:"AI qualifications intakes, questions lead intent, ranks legal case urgency, maps eligibility, and schedules paid consultations.",
 metrics:"3.5×",
 metricLabel:"more qualified client intakes",
 dialogue: [
 { speaker:"customer", text:"Hi, I need a consultation regarding a landlord contract dispute."},
 { speaker:"ai", text:"I can assist. Is this dispute in California? Also, have you already received a written eviction notice?"},
 { speaker:"customer", text:"Yes, in San Francisco, and yes, received it yesterday."},
 { speaker:"ai", text:"Understood, this is urgent. I have routed your case details to our tenancy expert, and I can book an intake call for tomorrow at 11:00 AM."}
 ]
 },
 realestate: {
 name:"Real Estate",
 icon: <Home className="h-4 w-4 text-primary-500"/>,
 challenge:"Buyers inquiring about listings at night and moving on to other listings if agent doesn't reply instantly.",
 solution:"AI answers property spec sheets, schedules viewing appointments, and collects buyer criteria (budget, pre-approval status).",
 metrics:"+45%",
 metricLabel:"lead-to-viewing conversion",
 dialogue: [
 { speaker:"customer", text:"Hi, is 142 Pine Street still available for a tour this week?"},
 { speaker:"ai", text:"Yes! 142 Pine St is active. I can schedule a tour on Thursday at 4:00 PM or Saturday at 11:00 AM. Which do you prefer?"},
 { speaker:"customer", text:"Thursday at 4:00 PM is perfect. Is there parking?"},
 { speaker:"ai", text:"Yes, the property includes a 2-car attached garage. I have confirmed your tour with agent Sarah for Thursday at 4:00 PM."}
 ]
 },
 gym: {
 name:"Gyms & Fitness",
 icon: <Dumbbell className="h-4 w-4 text-primary"/>,
 challenge:"Missing membership registrations and class booking inquiries from busy prospects outside gym hours.",
 solution:"AI books demo classes, answers pricing structure inquiries, and captures membership leads automatically.",
 metrics:"+28%",
 metricLabel:"increase in new trial sign-ups",
 dialogue: [
 { speaker:"customer", text:"Hello, how much is your monthly membership and can I try a class?"},
 { speaker:"ai", text:"Hello! Our individual membership is $65/month. I can sign you up for a free guest pass to our HIIT class tomorrow at 6:00 PM. Sound good?"},
 { speaker:"customer", text:"Awesome, let's do the HIIT class tomorrow at 6:00 PM."},
 { speaker:"ai", text:"Done! I have created your guest pass for tomorrow at 6:00 PM. Just show the SMS code at the front desk when you arrive!"}
 ]
 }
};

export function InteractiveIndustryExplorer() {
 const [activeTab, setActiveTab] = useState<IndustryKey>("dental");
 const dialogueContainerRef = useRef<HTMLDivElement>(null);

 const data = INDUSTRIES_DATA[activeTab];

 useEffect(() => {
 if (dialogueContainerRef.current) {
 dialogueContainerRef.current.scrollTop = dialogueContainerRef.current.scrollHeight;
 }
 }, [activeTab]);

 return (
 <div className="relative mx-auto max-w-5xl w-full">
 {/* Hide scrollbar styles locally */}
 <style dangerouslySetInnerHTML={{__html:`
 .no-scrollbar::-webkit-scrollbar {
 display: none;
 }
 .no-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
 }
 `}} />

 <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(var(--foreground)/0.06)] to-transparent pointer-events-none"/>
 
 <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden [.light_&]:border-zinc-200/80 [.light_&]:bg-white [.light_&">
 {/* Industry selector tabs */}
 <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-zinc-800/80 bg-zinc-950/40 divide-x divide-zinc-800/60 [.light_&]:border-zinc-200/80 [.light_&]:bg-zinc-50/50 [.light_&]:divide-zinc-200/60">
 {(Object.keys(INDUSTRIES_DATA) as IndustryKey[]).map((key) => {
 const ind = INDUSTRIES_DATA[key];
 const isActive = activeTab === key;
 return (
 <button
 key={key}
 onClick={() => setActiveTab(key)}
 className={`flex flex-col items-center gap-space-2 py-space-4 px-space-2 text-caption transition-all relative ${
 isActive
 ?"text-primary bg-zinc-950/20 [.light_&]:bg-white font-medium"
 :"text-zinc-450 hover:text-zinc-250 hover:bg-zinc-900/10 [.light_&]:text-zinc-500 [.light_&]:hover:text-zinc-800 [.light_&]:hover:bg-zinc-150/10"
 }`}
 >
 {ind.icon}
 <span className="truncate w-full text-center">{ind.name}</span>
 {isActive && (
 <span className="absolute bottom-space-0 left-space-0 right-space-0 h-0.5 bg-primary"/>
 )}
 </button>
 );
 })}
 </div>

 {/* Content Panel */}
 <div className="p-space-6 md:p-space-8 grid grid-cols-1 lg:grid-cols-2 gap-space-8 items-start">
 {/* Text Summary */}
 <div className="space-y-space-5">
 <div>
 <span className="text-caption text-primary uppercase tracking-wider">Vertical Alignment</span>
 <h3 className="text-title-lg text-foreground mt-space-1">{data.name} AI Agent</h3>
 </div>

 <div className="space-y-space-3">
 <div className="p-space-4 rounded-xl bg-state-error-bg border border-state-error-text/15">
 <span className="text-caption uppercase text-state-error-text font-semibold">Core Challenge</span>
 <p className="text-body-sm text-zinc-300 [.light_&]:text-zinc-700 mt-space-1 leading-relaxed">{data.challenge}</p>
 </div>

 <div className="p-space-4 rounded-xl bg-state-success-bg border border-state-success-text/15">
 <span className="text-caption uppercase text-state-success-text font-semibold">AI Capabilities</span>
 <p className="text-body-sm text-zinc-300 [.light_&]:text-zinc-700 mt-space-1 leading-relaxed">{data.solution}</p>
 </div>
 </div>

 {/* Impact Metric */}
 <div className="flex items-center gap-space-4 rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-space-4 [.light_&]:border-zinc-200/60 [.light_&]:bg-zinc-50/40">
 <div className="text-heading-lg font-mono text-primary leading-none shrink-0">{data.metrics}</div>
 <p className="text-caption text-zinc-400 [.light_&]:text-zinc-500 leading-snug">{data.metricLabel}</p>
 </div>
 </div>

 {/* Dialogue Simulator Wrapped in Browser Frame */}
 <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-950 overflow-hidden [.light_&]:border-zinc-200/80 [.light_&]:bg-white">
 {/* Glow highlight frame border */}
 <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[hsl(var(--foreground)/0.06)] to-transparent pointer-events-none"/>

 {/* Mock Browser Header Bar */}
 <div className="flex items-center justify-between px-space-4 py-space-2.5 bg-zinc-950 border-b border-zinc-800/80 [.light_&]:bg-zinc-100/60 [.light_&]:border-zinc-200/80 rounded-t-[15px] relative z-10">
 {/* Mac-like Window Controls */}
 <div className="flex items-center gap-space-1.5">
 <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] opacity-80"/>
 <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] opacity-80"/>
 <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] opacity-80"/>
 </div>
 {/* Address Bar */}
 <div className="flex-1 max-w-40 mx-auto flex items-center justify-center">
 <div className="w-full text-center py-space-0.5 text-caption font-mono tracking-tight text-zinc-500 bg-zinc-900 border border-zinc-800/80 rounded select-none [.light_&]:bg-white [.light_&]:border-zinc-200/60 [.light_&]:text-zinc-450">
 chat.nexx.ai
 </div>
 </div>
 <div className="w-10 hidden sm:block"/>
 </div>

 {/* Dialogue Simulator Content Area */}
 <div className="bg-zinc-950 [.light_&]:bg-zinc-50/50 p-space-4 space-y-space-4 rounded-b-[15px] relative z-10">
 <div className="flex items-center justify-between border-b border-zinc-850 [.light_&]:border-zinc-200/60 pb-space-3">
 <div className="flex items-center gap-space-2">
 <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/>
 <span className="text-caption uppercase font-mono font-semibold tracking-wider text-zinc-300 [.light_&]:text-zinc-700">
 Interactive Conversation Simulation
 </span>
 </div>
 <span className="text-caption uppercase font-mono font-semibold tracking-widest px-space-2 py-space-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 [.light_&]:bg-zinc-100 [.light_&]:border-zinc-200 [.light_&]:text-zinc-400">
 Real-time Answering
 </span>
 </div>

 <div 
 ref={dialogueContainerRef}
 className="space-y-space-4 h-56 overflow-y-auto no-scrollbar pr-space-1"
 >
 {data.dialogue.map((turn, i) => (
 <div
 key={i}
 className={`flex flex-col max-w-5/6 ${
 turn.speaker ==="customer"
 ?"mr-auto items-start"
 :"ml-auto items-end"
 }`}
 >
 <span className="text-caption uppercase font-mono font-semibold tracking-wider text-zinc-500 [.light_&]:text-zinc-400 mb-space-1 capitalize">
 {turn.speaker}
 </span>
 <div
 className={`radius-xl px-space-4 py-space-2 text-body-sm leading-relaxed ${
 turn.speaker ==="customer"
 ?"bg-zinc-900/60 border border-zinc-850 text-zinc-200 radius-tl-none [.light_&]:bg-white [.light_&]:border-zinc-200/60 [.light_&]:text-zinc-800"
 :"bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 text-white radius-tr-none font-medium"
 }`}
 >
 {turn.text}
 </div>
 </div>
 ))}
 </div>

 <div className="border-t border-zinc-850 [.light_&]:border-zinc-200/60 pt-space-3 flex items-center justify-between text-caption font-mono font-semibold text-zinc-500 [.light_&]:text-zinc-400">
 <span>Channel: Phone Call</span>
 <span className="flex items-center gap-space-1 text-purple-400 [.light_&]:text-purple-600">
 <Sparkles className="h-3.5 w-3.5 animate-pulse"/> System Active
 </span>
 </div>
 </div>
 </div>

 </div>
 </div>
 </div>
 );
}
