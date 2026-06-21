import { Chatbot } from '@/components/chatbot'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ScrollReveal } from '@/components/scroll-reveal'
import { NAVIGATION_URLS } from '@/config/navigation'
import {
  Check, Star, Calendar, Users, TrendingUp, Shield, Clock,
  ArrowRight, Zap, Smartphone, CheckCircle, AlertTriangle, ShieldCheck, Play,
  MessageCircle, BrainCircuit, Bell, ClipboardCheck, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Tooth } from '@/components/tooth-icon'
import { WorkflowTimeline } from '@/components/workflow-timeline'

const workflowSteps = [
  {
    title: 'Patient Starts Conversation',
    description: 'Patient requests an appointment or asks general scheduling queries in plain English.',
    icon: 'MessageCircle',
    badge: 'Message Received',
    color: 'from-blue-500 to-indigo-500',
    mockup: (
      <div className="space-y-3.5 animate-message">
        <div className="flex gap-2.5 justify-start">
          <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-500">
            <Tooth className="w-3.5 h-3.5" />
          </div>
          <div className="bg-secondary dark:bg-slate-900 border border-border dark:border-white/5 px-3 py-2 rounded-xl rounded-tl-none text-[11px] leading-relaxed max-w-[85%] text-foreground font-medium">
            Hello! I am SmileAI. How can I help you with your dental needs today?
          </div>
        </div>
        <div className="flex gap-2.5 justify-end">
          <div className="bg-gradient-to-r from-indigo-650 to-indigo-700 px-3 py-2 rounded-xl rounded-tr-none text-[11px] leading-relaxed max-w-[85%] text-white shadow-md font-medium">
            Hi! I need to book a routine cleaning and exam sometime next week.
          </div>
        </div>
        <div className="flex gap-2.5 justify-start">
          <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 text-indigo-500">
            <Tooth className="w-3.5 h-3.5" />
          </div>
          <div className="bg-secondary dark:bg-slate-900 border border-border dark:border-white/5 px-3 py-2 rounded-xl rounded-tl-none text-[11px] leading-relaxed max-w-[85%] text-foreground font-medium">
            {"I can definitely help with that! Let's coordinate your visit. What is your full name?"}
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'AI Qualifies Patient',
    description: 'SmileAI extracts critical treatment fields, checks insurance carrier details, and collects coordinates.',
    icon: 'BrainCircuit',
    badge: 'Extraction Active',
    color: 'from-indigo-500 to-violet-500',
    mockup: (
      <div className="space-y-3.5 animate-message">
        <div className="text-[10px] font-bold text-indigo-550 dark:text-indigo-400 uppercase tracking-widest border-b border-border dark:border-white/5 pb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> AI Extracted Parameters
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="bg-secondary/40 dark:bg-slate-950/40 border border-border dark:border-white/5 rounded-lg p-2 flex justify-between items-center text-foreground">
            <span className="text-muted-foreground font-sans">Patient</span>
            <span className="font-bold">Jane Smith</span>
          </div>
          <div className="bg-secondary/40 dark:bg-slate-950/40 border border-border dark:border-white/5 rounded-lg p-2 flex justify-between items-center text-foreground">
            <span className="text-muted-foreground font-sans">Procedure</span>
            <span className="font-bold">Cleaning & Exam</span>
          </div>
          <div className="bg-secondary/40 dark:bg-slate-950/40 border border-border dark:border-white/5 rounded-lg p-2 flex justify-between items-center text-foreground">
            <span className="text-muted-foreground font-sans">Insurance</span>
            <span className="text-emerald-650 dark:text-emerald-400 font-bold">MetLife PPO</span>
          </div>
          <div className="bg-secondary/40 dark:bg-slate-950/40 border border-border dark:border-white/5 rounded-lg p-2 flex justify-between items-center text-foreground">
            <span className="text-muted-foreground font-sans">Status</span>
            <span className="text-indigo-650 dark:text-indigo-400 font-bold">Eligible (100%)</span>
          </div>
        </div>
        <div className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-[9.5px] leading-normal text-indigo-950 dark:text-indigo-300 font-medium">
          <strong>System:</strong> Metadata check passed. Payer connection returned active benefits with $0 preventive copay.
        </div>
      </div>
    )
  },
  {
    title: 'Availability Check',
    description: 'SmileAI links with PMS schedule books (Eaglesoft/Dentrix) to query slots and display openings.',
    icon: 'Calendar',
    badge: 'Schedule Checked',
    color: 'from-violet-500 to-fuchsia-500',
    mockup: (
      <div className="space-y-3 animate-message text-center">
        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-bold">
          <span>Dr. Sarah Johnson (General)</span>
          <span className="text-indigo-650 dark:text-indigo-400">June 2026</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {['Mon 22', 'Tue 23', 'Wed 24', 'Thu 25'].map((dt, i) => (
            <div key={i} className={`p-1.5 rounded-lg border text-center transition ${i === 1 ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md' : 'bg-secondary/40 dark:bg-slate-950/20 border-border dark:border-white/5 text-muted-foreground'}`}>
              <div className="text-[8px] opacity-80">{dt.split(' ')[0]}</div>
              <div className="text-xs font-black">{dt.split(' ')[1]}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 justify-center pt-2">
          <span className="px-2 py-1 bg-secondary/50 dark:bg-indigo-500/10 border border-border dark:border-indigo-500/20 rounded text-[9px] text-muted-foreground font-semibold">9:00 AM</span>
          <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-[9px] text-emerald-650 dark:text-emerald-400 font-bold shadow-sm">10:30 AM (Selected)</span>
          <span className="px-2 py-1 bg-secondary/50 dark:bg-indigo-500/10 border border-border dark:border-indigo-500/20 rounded text-[9px] text-muted-foreground font-semibold">1:30 PM</span>
        </div>
      </div>
    )
  },
  {
    title: 'Appointment Confirmed',
    description: 'Appointment slot is locked in real-time, synced to PMS, and transactional confirmation alerts are fired.',
    icon: 'CheckCircle',
    badge: 'Synced to Eaglesoft',
    color: 'from-fuchsia-500 to-pink-500',
    mockup: (
      <div className="space-y-3 animate-message">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-inner flex-shrink-0">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="font-extrabold text-[11px] text-foreground">Booking Confirmed & Synced</div>
            <p className="text-[9px] text-muted-foreground">Eaglesoft schedule updated successfully</p>
          </div>
        </div>
        <div className="bg-secondary/40 dark:bg-slate-950/40 border border-border dark:border-white/5 rounded-xl p-2.5 font-mono text-[9px] space-y-1 text-foreground">
          <div>APPT ID: <span className="font-bold text-indigo-650 dark:text-indigo-400">APT-92381-C</span></div>
          <div>PMS BOOKING ID: <span className="font-bold">EG-5832</span></div>
          <div>SMS NOTIFICATION: <span className="text-emerald-600 dark:text-emerald-400 font-bold">DISPATCHED</span></div>
        </div>
      </div>
    )
  },
  {
    title: 'Reminders Sent',
    description: 'SmileAI coordinates automated reminders prior to appointment, pre-filling health history intake forms.',
    icon: 'Bell',
    badge: 'Reminder Dispatched',
    color: 'from-pink-500 to-rose-500',
    mockup: (
      <div className="space-y-3.5 animate-message">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border dark:border-white/5 pb-1">Automated Communications</div>
        <div className="relative pl-3.5 border-l border-indigo-500/20 space-y-3">
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900" />
            <div className="flex justify-between items-center text-[10px] font-bold text-foreground">
              <span>SMS Notification</span>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 px-1 rounded border border-indigo-500/20">24h Before</span>
            </div>
            <p className="text-[9px] text-muted-foreground mt-0.5">&quot;Jane, we look forward to seeing you tomorrow at 10:30 AM.&quot;</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[18px] top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900" />
            <div className="flex justify-between items-center text-[10px] font-bold text-foreground">
              <span>Intake Form Reminder</span>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-650 dark:text-indigo-300 px-1 rounded border border-indigo-500/20">2h Before</span>
            </div>
            <p className="text-[9px] text-muted-foreground mt-0.5">&quot;Please fill out your dental history forms before arriving.&quot;</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'Visit Completed',
    description: 'Patient checkout registers immediately. Post-visit checkout reviews are triggered automatically.',
    icon: 'ClipboardCheck',
    badge: 'Visit Finished',
    color: 'from-rose-500 to-emerald-500',
    mockup: (
      <div className="space-y-3 animate-message">
        <div className="flex items-center justify-between border-b border-border dark:border-white/5 pb-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Patient Checkout</span>
          <span className="text-[9px] px-1.5 rounded bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 font-bold border border-emerald-500/20">Checked Out</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-foreground">
          <div>
            <span className="text-muted-foreground block">Check-in time</span>
            <span className="font-bold font-mono">10:24 AM (On Time)</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Clinician</span>
            <span className="font-bold">Dr. Sarah Johnson</span>
          </div>
        </div>
        <div className="p-2 bg-secondary/40 dark:bg-slate-900/60 border border-border dark:border-white/5 rounded-lg text-[9.5px] leading-normal text-muted-foreground flex items-center justify-between">
          <span>Feedback survey triggered (SMS)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    )
  }
]

export default async function HomePage() {
  const { userId } = await auth()

  return (
    <div className="bg-gradient-to-br from-background via-background to-background/95 min-h-screen">
      {/* Floating Chatbot Bubble widget */}
      <Chatbot />

      {/* Shared Navigation Header */}
      <Navbar userId={userId} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20 text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" />

        <div className="space-y-8 max-w-4xl mx-auto">
          <ScrollReveal animation="fade-up" delay={0}>
            <div className="inline-flex items-center justify-center">
              <div className="glass px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-650 dark:text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                AI-Powered Dental Scheduling
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-foreground">
              <span className="gradient-text">Smart Appointment Booking</span>
              <br />
              for Modern Dental Clinics
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2.5xl mx-auto leading-relaxed font-normal">
              Experience the future of dental scheduling. Our intelligent AI assistant works 24/7 to help patients book
              appointments instantly, reducing no-shows and driving clinic efficiency.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
              <a
                href={NAVIGATION_URLS.getStarted}
                className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto shadow-lg hover:shadow-indigo-500/20 text-center"
              >
                Book Free Consultation
              </a>
              <a
                href={NAVIGATION_URLS.watchDemo}
                className="px-8 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary/80 bg-card/45 transition-all duration-200 w-full sm:w-auto text-center inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-foreground" /> Watch Demo
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 pt-6 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Visual Workflow Timeline Showcase */}
        <ScrollReveal animation="scale-in" delay={350} className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass p-6 sm:p-10 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="text-center mb-10 max-w-xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-1.5 glass px-3.5 py-1.5 rounded-full text-[10px] font-bold text-indigo-400 border border-indigo-500/20 shadow-sm uppercase tracking-widest">
                <Tooth className="w-3.5 h-3.5" />
                End-To-End Automation
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none">
                What Happens After Booking?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Our AI receptionist handles the entire workflow automatically.
              </p>
            </div>

            <WorkflowTimeline steps={workflowSteps} />
          </div>
        </ScrollReveal>
      </section>

      {/* Bento Grid Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative" id="features">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />

        <ScrollReveal animation="fade-up" className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight">Capabilities Redefined</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Everything you need to automate scheduling and operate a modern, high-efficiency dental practice.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Chatbot (Double columns) */}
          <ScrollReveal animation="fade-up" delay={50} className="md:col-span-2 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/25 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all duration-300">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">AI Chatbot Assistant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                A smart conversational assistant that guides patients through custom scheduling, checks real-time slot availability,
                answers service questions, and registers bookings 24/7.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <Link href={NAVIGATION_URLS.chatbot} className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 inline-flex items-center gap-1">
                Try Chatbot Page <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Card 2: Analytics (Single column) */}
          <ScrollReveal animation="fade-up" delay={150} className="glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/25 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-all duration-300">
                <TrendingUp className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Analytics Dashboard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Visual analytics indicating clinic growth, completed status distribution, revenue trends, and staff occupancy metrics.
              </p>
            </div>
            <span className="text-xs font-semibold text-violet-650 dark:text-violet-400 mt-8">Real-time charts</span>
          </ScrollReveal>

          {/* Card 3: Patient management (Single column) */}
          <ScrollReveal animation="fade-up" delay={200} className="glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/25 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Patient Records</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Consolidated patient profiles with custom treatment logs, appointment histories, status breakdowns, and communication logs.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-650 dark:text-blue-400 mt-8">Consolidated profiles</span>
          </ScrollReveal>

          {/* Card 4: Security & Reminders (Double columns) */}
          <ScrollReveal animation="fade-up" delay={250} className="md:col-span-2 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/25 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all duration-300">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Enterprise Infrastructure</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                Secure HIPAA-compliant databases, authentication safety layers, encrypted data handling, and automated reminders designed to minimize appointment drop-offs and clinical compliance issues.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-650 dark:text-emerald-400 mt-8">HIPAA-ready structure</span>
          </ScrollReveal>
        </div>
      </section>

      {/* Alternating Layout Sections */}
      <section className="py-24 border-t border-border/40" id="benefits">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Row 1: Image Left / Content Right */}
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Visual Mockup Left */}
            <div className="md:col-span-6 order-last md:order-first">
              <ScrollReveal animation="slide-right">
                <div className="glass p-6 rounded-[2rem] border border-border/50 dark:border-white/5 relative overflow-hidden shadow-xl max-w-md mx-auto">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-xl rounded-full" />
                  <div className="bg-card dark:bg-slate-900/80 rounded-xl p-4 border border-border dark:border-white/5 space-y-4 font-sans text-xs shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-foreground">AI Scheduling Assistant</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">Active Now</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <span className="bg-secondary dark:bg-slate-800 text-foreground dark:text-slate-200 px-3 py-2 rounded-xl rounded-tl-none max-w-[85%] border border-border/40 dark:border-transparent">
                          Hello! Would you like to book a dental checkup, cleaning, or whitening?
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <span className="bg-indigo-600 dark:bg-indigo-655 text-white px-3 py-2 rounded-xl rounded-tr-none max-w-[85%] font-medium shadow-[0_2px_8px_rgba(99,102,241,0.15)] dark:shadow-none">
                          I would like to book teeth whitening tomorrow afternoon.
                        </span>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-secondary dark:bg-slate-800 text-foreground dark:text-slate-200 px-3 py-2 rounded-xl rounded-tl-none max-w-[85%] space-y-2 border border-border/40 dark:border-transparent">
                          <p>Great! We have slots open for Teeth Whitening ($250.00):</p>
                          <div className="flex flex-col gap-1.5 py-1">
                            <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-center font-bold">14:00 (2:00 PM)</span>
                            <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-center font-bold">15:00 (3:00 PM)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Copy Right */}
            <div className="md:col-span-6 space-y-6">
              <ScrollReveal animation="fade-up">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Conversational funnel
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-2">
                  Engage patients instantly with friendly booking flows
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Phones are busy, and patient forms are tedious. Our conversational AI resolves patient inquiries immediately,
                  checks dynamic clinic timetables, collects contact information, and secures slots in less than 30 seconds.
                </p>
                <div className="pt-2">
                  <Link href={NAVIGATION_URLS.chatbot} className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition">
                    Test Interactive Chat Console <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Row 2: Content Left / Image Right */}
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Copy Left */}
            <div className="md:col-span-6 space-y-6">
              <ScrollReveal animation="fade-up">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Growth & Revenue
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-2">
                  Visual performance charts for clinic administrators
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Analyze clinic outcomes directly inside the admin panel. Seamlessly evaluate bookings per status,
                  track monthly revenue growth curves, check staff occupancy parameters, and monitor booking rates without sorting spreadsheets.
                </p>
                <div className="pt-2">
                  <a href={NAVIGATION_URLS.getStarted} className="text-xs font-bold text-violet-650 dark:text-violet-400 hover:text-violet-550 dark:hover:text-violet-300 inline-flex items-center gap-1 transition">
                    Book Presentation Call <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </ScrollReveal>
            </div>

            {/* Visual Mockup Right */}
            <div className="md:col-span-6">
              <ScrollReveal animation="slide-left">
                <div className="glass p-6 rounded-[2rem] border border-border/50 dark:border-white/5 relative overflow-hidden shadow-xl max-w-md mx-auto">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/10 blur-xl rounded-full" />
                  <div className="bg-card dark:bg-slate-900/80 rounded-xl p-4 border border-border dark:border-white/5 space-y-4 font-sans text-xs shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="font-bold text-foreground">Monthly Analytics</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">+14% Growth</span>
                    </div>
                    {/* Simulated Mini Chart */}
                    <div className="h-32 flex items-end gap-3.5 pt-4 px-2">
                      <div className="w-full bg-secondary dark:bg-slate-800 rounded h-[30%] relative group">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground border border-border dark:border-transparent px-1.5 py-0.5 rounded text-[8px] opacity-0 group-hover:opacity-100 transition shadow-sm font-semibold">$1.2k</span>
                      </div>
                      <div className="w-full bg-secondary dark:bg-slate-800 rounded h-[50%]" />
                      <div className="w-full bg-indigo-500/80 rounded h-[75%]" />
                      <div className="w-full bg-indigo-600 rounded h-[90%]" />
                    </div>
                    <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border/40 relative">
        <ScrollReveal animation="fade-up" className="text-center mb-20">
          <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">Workflow Step-by-Step</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight mt-2">
            The Automation Booking Loop
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            How patients schedule clinical appointments instantly, from landing to calendar synchronization.
          </p>
        </ScrollReveal>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {[
            {
              step: '01',
              title: 'Patient Engagement',
              desc: 'Patient visits your site or clicks a widget, prompting the AI Assistant to greet them instantly.',
              icon: Smartphone,
              color: 'border-indigo-500/20 text-indigo-650 dark:text-indigo-400 bg-indigo-500/5',
            },
            {
              step: '02',
              title: 'Intelligent Matching',
              desc: 'AI checks specific service durations (whitening, checkup) and checks dynamic doctor availability.',
              icon: Zap,
              color: 'border-violet-500/20 text-violet-650 dark:text-violet-400 bg-violet-500/5',
            },
            {
              step: '03',
              title: 'Data Collection',
              desc: 'AI qualifies patient names, emails, and phone records before confirming appointment slots.',
              icon: Users,
              color: 'border-blue-500/20 text-blue-650 dark:text-blue-400 bg-blue-500/5',
            },
            {
              step: '04',
              title: 'Synced Confirmation',
              desc: 'Appointment syncs automatically to clinic schedules and sends confirmation email alerts.',
              icon: CheckCircle,
              color: 'border-emerald-500/20 text-emerald-650 dark:text-emerald-400 bg-emerald-500/5',
            },
          ].map((item, index) => (
            <ScrollReveal
              key={index}
              animation="scale-in"
              delay={index * 100}
              className="glass p-6 rounded-2xl border border-border relative flex flex-col justify-between group hover:border-indigo-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-800/40 select-none">{item.step}</span>
                </div>
                <h3 className="font-bold text-base text-foreground tracking-tight mb-2.5">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Comparison Section: Before vs After Automation */}
      <section className="py-24 border-t border-border/40">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-16">
            <span className="text-xs font-bold text-violet-650 dark:text-violet-400 uppercase tracking-widest">Why Automate?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight mt-2">
              Before & After Optimization
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Compare traditional administrative friction with the DentalAI automated pipeline.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <ScrollReveal animation="slide-right" className="glass p-8 rounded-2xl border border-red-500/20 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Manual Friction (The Old Way)</h3>
                </div>
                <ul className="space-y-4 text-sm">
                  {[
                    'Busy phone lines lead to missed inbound leads.',
                    'Manual back-and-forth calendar coordination.',
                    'High rate of patient no-shows with no follow-ups.',
                    'Staff is bogged down by repeating basic FAQs.',
                    'No automated tracking of patient booking trends.',
                  ].map((text, i) => (
                    <li key={i} className="flex gap-2.5 text-slate-600 dark:text-slate-400">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border/60 mt-8 pt-4 text-xs font-bold text-red-500 uppercase tracking-wider">
                Loss of conversions & time
              </div>
            </ScrollReveal>

            {/* The DentalAI Way */}
            <ScrollReveal animation="slide-left" className="glass p-8 rounded-2xl border border-emerald-500/20 flex flex-col justify-between shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">DentalAI Pipeline (The Optimized Way)</h3>
                </div>
                <ul className="space-y-4 text-sm">
                  {[
                    'Instant, automated assistant handles unlimited parallel bookings.',
                    'Real-time automated calendar reads and slot bookings.',
                    'Integrated automated reminder flows reduce no-shows by 40%.',
                    'Staff concentrates on core patient care and clinic work.',
                    'Central analytical dashboard captures growth parameters.',
                  ].map((text, i) => (
                    <li key={i} className="flex gap-2.5 text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-450 flex-shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border/60 mt-8 pt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Maximized productivity & occupancy
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <ScrollReveal animation="scale-in">
          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-border relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
            <h2 className="text-3xl font-extrabold mb-3 text-center tracking-tight text-foreground">Request a Demo</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
              See how DentalAI can transform your clinic and supercharge your booking efficiency.
            </p>

            <form className="space-y-5 relative">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input-field w-full"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input-field w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Clinic Name"
                className="input-field w-full"
              />
              <textarea
                placeholder="Tell us about your clinic..."
                rows={4}
                className="input-field w-full resize-none"
              />
              <button
                type="submit"
                className="w-full btn-glass py-3 text-base font-semibold shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
              >
                Request Demo
              </button>
            </form>
          </div>
        </ScrollReveal>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <ScrollReveal animation="fade-up" className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight">Loved by Dental Professionals</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">Trusted by 500+ modern clinics worldwide to run scheduling automation.</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Sarah Johnson',
              clinic: 'Smile Dental Care',
              text: 'DentalAI reduced our no-shows by 40% in the first month. The AI assistant is incredibly helpful and natural.',
            },
            {
              name: 'Dr. Michael Chen',
              clinic: 'Bright Teeth Clinic',
              text: 'The analytics dashboard gives us clinic insights we never had access to before. High conversion results!',
            },
            {
              name: 'Dr. Emma Wilson',
              clinic: 'Premier Dental Group',
              text: 'Integrating this was extremely simple, and our patients love the instant response. Exceptional utility.',
            },
          ].map((testimonial, idx) => (
            <ScrollReveal
              key={idx}
              animation="scale-in"
              delay={idx * 100}
              className="glass p-8 rounded-2xl border border-border relative flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                  ))}
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed mb-6 italic">&quot;{testimonial.text}&quot;</p>
              </div>
              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-300 font-semibold text-sm">
                  {testimonial.name.split(' ').pop()?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.clinic}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Bottom Funnel CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <ScrollReveal animation="scale-in">
          <div className="glass p-12 rounded-[2rem] text-center relative overflow-hidden shadow-2xl border border-border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Ready to Transform Your Clinic?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Join hundreds of dental clinics already using DentalAI to streamline their booking
                process and improve patient satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a
                  href={NAVIGATION_URLS.startYourFreeTrial}
                  className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto text-center"
                >
                  Book Free Consultation
                </a>

              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Shared Footer component */}
      <Footer />
    </div>
  )
}
