'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageCircle, BrainCircuit, Calendar, CheckCircle, Bell,
  ClipboardCheck, ChevronRight, ArrowRight, Sparkles
} from 'lucide-react'
import { Tooth } from '@/components/tooth-icon'

interface TimelineStep {
  title: string
  description: string
  icon: string
  badge: string
  color: string
  mockup: React.ReactNode
}

interface WorkflowTimelineProps {
  steps: TimelineStep[]
}

const iconMap: Record<string, any> = {
  MessageCircle,
  BrainCircuit,
  Calendar,
  CheckCircle,
  Bell,
  ClipboardCheck,
  Sparkles
}

export function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPaused) return

    autoPlayTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isPaused, steps.length])

  const activeData = steps[activeStep]
  const ActiveIcon = iconMap[activeData.icon] || Sparkles

  return (
    <div 
      className="space-y-12 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Visual Timeline Navigation Panel */}
      <div className="relative">
        {/* Desktop Horizontal Connect Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0 hidden md:block" />
        
        {/* Desktop Active connection progress fill */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 z-0 hidden md:block transition-all duration-500 ease-out" 
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Nodes Wrapper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-2 relative z-10">
          {steps.map((step, idx) => {
            const StepIcon = iconMap[step.icon] || Sparkles
            const isActive = idx === activeStep
            const isCompleted = idx < activeStep

            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveStep(idx)
                  setIsPaused(true)
                }}
                className="group focus:outline-none text-left md:text-center flex flex-col items-start md:items-center relative cursor-pointer"
              >
                {/* Node bubble */}
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border
                    ${isActive 
                      ? 'bg-gradient-to-tr from-indigo-650 via-indigo-700 to-violet-650 text-white border-indigo-400 scale-110 shadow-lg shadow-indigo-500/20' 
                      : isCompleted
                        ? 'bg-indigo-50 dark:bg-slate-900 text-indigo-500 border-indigo-500/35'
                        : 'bg-card border-border text-muted-foreground group-hover:border-slate-300 dark:group-hover:border-white/10 dark:bg-slate-900'
                    }
                  `}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                
                {/* Text Label */}
                <div className="mt-2.5 md:mx-auto text-left md:text-center">
                  <div className={`text-[10px] font-bold uppercase tracking-wider transition ${isActive ? 'text-indigo-400 font-extrabold' : 'text-slate-400'}`}>
                    Step {idx + 1}
                  </div>
                  <div className={`text-[11px] font-extrabold leading-tight mt-0.5 hidden md:block truncate max-w-[120px] transition ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title.split(' ').slice(0, 2).join(' ')}...
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Showcase dynamic panel display */}
      <div className="grid md:grid-cols-12 gap-8 items-center pt-4">
        {/* Left: Content summary details */}
        <div className="md:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 glass px-3.5 py-1 rounded-full text-[10px] font-bold text-indigo-400 border border-indigo-500/20 shadow-sm uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> {activeData.badge}
          </div>
          
          <h3 className="text-2xl font-black text-foreground tracking-tight leading-tight flex items-center gap-2">
            <ActiveIcon className="w-6 h-6 text-indigo-400" />
            {activeData.title}
          </h3>

          <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">
            {activeData.description}
          </p>

          <div className="pt-2 border-t border-border flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider">
            <Tooth className="w-3.5 h-3.5 text-indigo-500" /> Powered by Nexx Automation Stack
          </div>
        </div>

        {/* Right: Premium visual mockup panel */}
        <div className="md:col-span-7">
          <div className="relative">
            {/* Visual ambient gradients */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-15 pointer-events-none" />
            
            {/* Glass panel */}
            <div className="relative bg-card/65 dark:bg-slate-950/60 border border-border/80 dark:border-white/5 rounded-2xl p-6.5 min-h-[190px] flex flex-col justify-center shadow-xl">
              {activeData.mockup}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button Block */}
      <div className="text-center pt-8">
        <a
          href="https://apps.nexxtechnologies.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glass px-8 py-3.5 text-sm font-bold shadow-lg hover:shadow-[0_4px_25px_rgba(99,102,241,0.35)] transition duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <Tooth className="w-4 h-4 text-white" />
          Open AI Receptionist Demo
        </a>
      </div>
    </div>
  )
}
