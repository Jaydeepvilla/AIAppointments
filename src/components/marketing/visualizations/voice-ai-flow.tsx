"use client";

import React, { useState } from"react";
import { Mic, FileText, Brain, Database, CalendarDays, MessageSquareText } from"lucide-react";

interface PipelineStep {
 title: string;
 subtitle: string;
 metric: string;
 metricLabel: string;
 desc: string;
 icon: React.ReactNode;
 color: string;
}

const PIPELINE: PipelineStep[] = [
 {
 title:"1. Audio Ingestion",
 subtitle:"Low-latency SIP stream",
 metric:"< 80ms",
 metricLabel:"audio stream latency",
 desc:"A client dials your number. Twilio connects the call directly to Nexx's low-latency audio stream, maintaining a crystal clear bidirectional voice bridge.",
 icon: <Mic className="h-4 w-4"/>,
 color:"text-primary-500 border-primary-500/20 bg-primary-500/5"
 },
 {
 title:"2. Transcription",
 subtitle:"Real-time speech-to-text",
 metric:"< 120ms",
 metricLabel:"transcription speed",
 desc:"Our real-time speech engine converts spoken client sentences into structured text, auto-detecting languages and filtering out background noise.",
 icon: <FileText className="h-4 w-4"/>,
 color:"text-primary-500 border-primary-500/20 bg-primary-500/5"
 },
 {
 title:"3. Semantic Brain",
 subtitle:"Intent & Context analysis",
 metric:"< 250ms",
 metricLabel:"LLM semantic reasoning",
 desc:"A custom LLM parses the text to identify user intent (booking, reschedule, price check) and evaluate sentiment guidelines.",
 icon: <Brain className="h-4 w-4"/>,
 color:"text-success-500 border-success-500/20 bg-success-500/5"
 },
 {
 title:"4. Knowledge lookup",
 subtitle:"Vector database search",
 metric:"< 45ms",
 metricLabel:"knowledge retrieval",
 desc:"The AI references your practice FAQ sheet, PDF uploads, and price lists. It extracts the exact facts needed to address the client's query.",
 icon: <Database className="h-4 w-4"/>,
 color:"text-warning-500 border-warning-500/20 bg-warning-500/5"
 },
 {
 title:"5. Calendar Booking",
 subtitle:"Google/Outlook slot lock",
 metric:"< 350ms",
 metricLabel:"calendar sync completion",
 desc:"The booking engine queries your live calendar, checks buffer configurations, locks the selected appointment slot, and updates availability.",
 icon: <CalendarDays className="h-4 w-4"/>,
 color:"text-primary border-primary/20 bg-primary/5"
 },
 {
 title:"6. Text Confirmation",
 subtitle:"Automated SMS notification",
 metric:"Instant",
 metricLabel:"SMS dispatcher delay",
 desc:"Stripe pre-payments are processed if applicable, and an automated SMS confirmation with coordinate links is dispatched immediately to the caller.",
 icon: <MessageSquareText className="h-4 w-4"/>,
 color:"text-primary border-primary/20 bg-primary/5"
 }
];

export function VoiceAiFlow() {
 const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

 const getStepClass = (idx: number) => {
 if (hoveredIdx === null) {
 return"border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] opacity-85 hover:opacity-100 hover:scale-[1.01]";
 }
 return hoveredIdx === idx
 ? PIPELINE[idx].color +"border-primary scale-[1.01] opacity-100"
 :"border-[hsl(var(--foreground)/0.03)] bg-[hsl(var(--foreground)/0.01)] opacity-30 scale-[0.99]";
 };

 return (
 <div className="w-full flex flex-col gap-space-5">
 {/* Pipeline timeline */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-3">
 {PIPELINE.map((step, idx) => (
 <div
 key={idx}
 className={`radius-lg border p-space-4 cursor-pointer transition-all duration-200 ${getStepClass(idx)}`}
 onMouseEnter={() => setHoveredIdx(idx)}
 onMouseLeave={() => setHoveredIdx(null)}
 >
 <div className="flex items-center gap-space-3">
 <div className="radius-md bg-primary/10 p-space-2 text-primary shrink-0">
 {step.icon}
 </div>
 <div className="min-w-0 flex-1">
 <h4 className="text-body-sm text-foreground leading-tight">{step.title}</h4>
 <p className="text-caption text-muted-foreground mt-space-1">{step.subtitle}</p>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Pipeline description box */}
 <div className="radius-xl border border-[hsl(var(--foreground)/0.06)] bg-card/50 backdrop-blur-sm p-space-5 min-h-36 flex flex-col justify-between transition-all duration-300">
 {hoveredIdx !== null ? (
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-4 animate-fade-in h-full">
 <div className="space-y-space-2 flex-1">
 <span className="text-caption uppercase tracking-wider text-primary">Pipeline Stage 0{hoveredIdx + 1}</span>
 <h4 className="text-body-sm text-foreground">{PIPELINE[hoveredIdx].title}</h4>
 <p className="text-caption text-muted-foreground leading-relaxed">
 {PIPELINE[hoveredIdx].desc}
 </p>
 </div>

 <div className="flex flex-col items-start md:items-end justify-center pt-space-3 md:pt-space-0 md:pl-space-5 border-t md:border-t-space-0 md:border-l border-[hsl(var(--foreground)/0.06)] shrink-0 min-w-40">
 <span className="text-caption uppercase tracking-wider text-muted-foreground mb-space-1">Processing time</span>
 <span className="text-heading-lg font-mono text-primary leading-none tabular-num">
 {PIPELINE[hoveredIdx].metric}
 </span>
 <span className="text-caption text-muted-foreground mt-space-1 text-left md:text-right">
 {PIPELINE[hoveredIdx].metricLabel}
 </span>
 </div>
 </div>
 ) : (
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-4 h-full">
 <div className="flex items-center gap-space-4 flex-1">
 <div className="radius-md bg-primary/10 p-space-3 text-primary shrink-0">
 <Mic className="h-5 w-5 animate-pulse"/>
 </div>
 <div>
 <p className="text-body-sm text-foreground">Voice AI Processing Pipeline</p>
 <p className="text-caption text-muted-foreground leading-relaxed max-w-xl">
 Hover over any stage above to trace how real-time calls are ingested, transcribed, and structured by the AI receptionist in milliseconds.
 </p>
 </div>
 </div>
 <div className="flex flex-col items-start md:items-end justify-center pt-space-3 md:pt-space-0 md:pl-space-5 border-t md:border-t-space-0 md:border-l border-[hsl(var(--foreground)/0.06)] shrink-0 min-w-40">
 <span className="text-caption uppercase tracking-wider text-muted-foreground mb-space-1">Total Pipeline Delay</span>
 <span className="text-heading-lg font-mono text-primary leading-none tabular-num">
 &lt; 900ms
 </span>
 <span className="text-caption text-muted-foreground mt-space-1 text-left md:text-right">
 end-to-end response time
 </span>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
