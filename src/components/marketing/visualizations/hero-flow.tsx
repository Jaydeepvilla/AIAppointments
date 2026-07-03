"use client";

import React, { useState, useEffect } from"react";
import { Phone, Brain, CalendarDays, DollarSign, Play, RotateCcw } from"lucide-react";
import { Button } from"@/components/shared/button";

interface FlowNode {
 title: string;
 role: string;
 desc: string;
 color: string;
 icon: React.ReactNode;
}

const FLOW_NODES: FlowNode[] = [
 {
 title:"Call Arrives",
 role:"Inbound Channel",
 desc:"A prospect dials your business line. Operator intercepts the call in under 2 seconds over an ultra-low latency voice bridge — no hold music, no voicemail.",
 color:"text-primary-500 border-primary-500/20 bg-primary-500/5",
 icon: <Phone className="h-5 w-5"/>
 },
 {
 title:"AI Responds",
 role:"Cognitive Engine",
 desc:"Operator understands intent, answers questions from your custom Knowledge Base, qualifies the caller, and builds a structured lead card — all in natural conversation.",
 color:"text-primary border-primary/20 bg-primary/5",
 icon: <Brain className="h-5 w-5"/>
 },
 {
 title:"Booking Made",
 role:"Calendar Sync",
 desc:"The booking engine checks your real-time availability, locks the best slot, sends confirmation to the caller, and updates your calendar — zero back-and-forth.",
 color:"text-primary border-primary/20 bg-primary/5",
 icon: <CalendarDays className="h-5 w-5"/>
 },
 {
 title:"Revenue Secured",
 role:"Conversion Complete",
 desc:"Confirmation texts, pre-payment links, and CRM updates fire automatically. Another customer captured, another appointment on the books — while you sleep.",
 color:"text-success-500 border-success-500/20 bg-success-500/5",
 icon: <DollarSign className="h-5 w-5"/>
 }
];

export function HeroFlow() {
 const [activeStep, setActiveStep] = useState(0);
 const [isPlaying, setIsPlaying] = useState(true);
 const [progressKey, setProgressKey] = useState(0);

 useEffect(() => {
 if (!isPlaying) return;

 const interval = setInterval(() => {
 setActiveStep((prev) => (prev + 1) % FLOW_NODES.length);
 setProgressKey((prev) => prev + 1);
 }, 3800);

 return () => clearInterval(interval);
 }, [isPlaying]);

 return (
 <div className="relative mx-auto max-w-4xl w-full">
 {/* BACKGROUND LAYER: Soft mesh glow */}
 <div className="absolute -inset-space-12 mesh-glow opacity-40 pointer-events-none z-0"/>
 
 {/* MIDGROUND LAYER: Glass Container */}
 <div className="relative radius-2xl glass-panel p-space-6 md:p-space-10 space-y-space-8 z-10">
 
 {/* Header with Control Buttons */}
 <div className="flex justify-between items-center border-b border-[hsl(var(--foreground)/0.06)] pb-space-4">
 <div className="flex items-center gap-space-2">
 <span className="h-2.5 w-2.5 radius-md bg-primary animate-pulse"/>
 <span className="text-caption font-mono uppercase tracking-wider text-muted-foreground">Operator Pipeline — Live</span>
 </div>
 <div className="flex items-center gap-space-2">
 <Button
 onClick={() => {
 setIsPlaying(!isPlaying);
 if (!isPlaying) setProgressKey((prev) => prev + 1);
 }}
 className="radius-md border border-[hsl(var(--foreground)/0.08)] bg-card/65 px-space-3 py-space-1 text-caption text-foreground hover:bg-[hsl(var(--foreground)/0.04)] flex items-center gap-space-2 transition-all cursor-pointer"
 >
 {isPlaying ? (
 <>Pause</>
 ) : (
 <>
 <Play className="h-3 w-3 fill-foreground"/> Play
 </>
 )}
 </Button>
 <Button
 onClick={() => {
 setActiveStep(0);
 setIsPlaying(false);
 }}
 className="radius-md border border-[hsl(var(--foreground)/0.08)] bg-card/65 px-space-2 py-space-1 text-foreground hover:bg-[hsl(var(--foreground)/0.04)] transition-all cursor-pointer"
 title="Reset Flow"
 >
 <RotateCcw className="h-3 w-3"/>
 </Button>
 </div>
 </div>

 {/* Linear Nodes Flow — Larger circles for readability */}
 <div className="relative grid grid-cols-4 gap-space-3 items-center justify-between">
 
 {/* Connection Line SVG with Animated Signal Pulse */}
 <div className="absolute left-space-0 right-space-0 top-space-7 h-2 pointer-events-none z-0">
 <svg className="w-full h-full"viewBox="0 0 100 10"preserveAspectRatio="none">
 {/* Background trace line */}
 <line x1="12.5"y1="5"x2="87.5"y2="5"stroke="hsl(var(--foreground)/0.08)"strokeWidth="1"strokeDasharray="3 3"/>
 {/* Active animated pulse stream */}
 {isPlaying && (
 <circle r="1.8"fill="hsl(var(--primary))">
 <animateMotion
 path="M 12.5,5 L 87.5,5"
 dur="5s"
 repeatCount="indefinite"
 />
 </circle>
 )}
 </svg>
 </div>

 {FLOW_NODES.map((node, idx) => {
 const isActive = activeStep === idx;
 const isCompleted = idx < activeStep;
 return (
 <div
 key={idx}
 onClick={() => {
 setActiveStep(idx);
 setIsPlaying(false);
 }}
 className="flex flex-col items-center cursor-pointer z-10 select-none group"tabIndex={0} onKeyDown={() => {}}
 >
 {/* Node circle — LARGER for better readability */}
 <div className={`radius-md border p-space-3 md:p-space-4 transition-all duration-300 flex items-center justify-center bg-card/90 ${
 isActive
 ? node.color +"border-primary scale-110 ring-4 ring-primary/10"
 : isCompleted
 ?"border-primary text-primary"
 :"border-[hsl(var(--foreground)/0.08)] text-muted-foreground/50 group-hover:border-[hsl(var(--foreground)/0.12)] group-hover:text-muted-foreground"
 }`}>
 {node.icon}
 </div>
 
 {/* Short label */}
 <span className={`text-caption text-center mt-space-2 hidden sm:block truncate w-full font-mono ${
 isActive ?"text-primary": isCompleted ?"text-foreground/70":"text-muted-foreground"
 }`}>
 {node.title}
 </span>
 </div>
 );
 })}
 </div>

 {/* Auto-play progress bar indicator */}
 {isPlaying && (
 <div className="auto-progress-bar"key={progressKey}>
 <div className="auto-progress-fill"/>
 </div>
 )}

 {/* FOREGROUND LAYER: Dynamic explanation card — MORE BREATHING ROOM */}
 <div className="radius-xl border border-[hsl(var(--foreground)/0.06)] bg-card/70 p-space-6 md:p-space-8 min-h-36 transition-all duration-300">
 <div className="space-y-space-2">
 <div className="flex items-center gap-space-3">
 <span className="inline-flex items-center gap-space-1 text-caption uppercase tracking-wider text-primary font-mono px-space-2 py-space-1 radius-md bg-primary/5 border border-primary/10 font-semibold">
 Step {activeStep + 1} of {FLOW_NODES.length}
 </span>
 <span className="text-caption uppercase tracking-wider text-muted-foreground font-mono">
 {FLOW_NODES[activeStep].role}
 </span>
 </div>
 <h4 className="text-title-md text-foreground font-semibold">
 {FLOW_NODES[activeStep].title}
 </h4>
 <p className="text-body-sm text-muted-foreground leading-relaxed mt-space-1">
 {FLOW_NODES[activeStep].desc}
 </p>
 </div>
 </div>

 </div>
 </div>
 );
}
