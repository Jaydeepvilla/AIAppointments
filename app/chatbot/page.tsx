import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ChatbotDemo } from '@/components/chatbot-demo'
import { ScrollReveal } from '@/components/scroll-reveal'
import { Bot, Zap, Calendar, MessageSquare, Clock, Users, ArrowUpRight, BarChart3, HelpCircle, Check, Plus, FileText, ShieldCheck, Sparkles } from 'lucide-react'
import { NAVIGATION_URLS } from '@/config/navigation'
import { auth } from '@clerk/nextjs/server'

export const metadata = {
  title: 'AI Chatbot Assistant - DentalAI',
  description: 'Experience 24/7 intelligent dental booking. Automate patient requests, check availability, and schedule visits instantly.',
}

export default async function ChatbotPage() {
  const { userId } = await auth()

  return (
    <div className="bg-gradient-to-br from-background via-background to-background/95 min-h-screen">
      {/* Navigation */}
      <Navbar userId={userId} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <ScrollReveal animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-1.5 glass px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400 border border-indigo-500/20 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
                Next-Gen Artificial Intelligence
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
                Your AI Patient coordinator, <span className="gradient-text">on duty 24/7</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
                Let patients book appointments, inquire about services, and get answers in real-time.
                DentalAI acts as your virtual front desk, driving booking rates and freeing up your clinic staff.
              </p>
            </ScrollReveal>

            {/* Quick Metrics */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">&lt; 1.0s</p>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">Average Response Speed</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">24/7/365</p>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">Booking Availability</p>
                </div>
              </div>
            </ScrollReveal>

            {/* CTA action buttons */}
            <ScrollReveal animation="fade-up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={NAVIGATION_URLS.getStarted}
                  className="btn-glass px-8 py-3.5 text-base font-semibold shadow-lg text-center justify-center flex hover:shadow-[0_4px_25px_rgba(99,102,241,0.3)]"
                >
                  Configure Your Bot
                </a>
                <a
                  href="#demo"
                  className="px-8 py-3.5 text-center justify-center flex rounded-lg border border-border text-foreground font-medium hover:bg-secondary bg-card/45 transition duration-200"
                >
                  Scroll to Live Preview
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Chat Console (Demo Area) */}
          <div className="lg:col-span-7" id="demo">
            <ScrollReveal animation="scale-in" delay={150}>
              <div className="relative">
                {/* Visual accents around chat console */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                <ChatbotDemo />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* AI Capabilities Bento Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border/40 relative">
        <ScrollReveal animation="fade-up" className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 glass px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400 border border-indigo-500/20 shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities & Workflows
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight">
            AI-Driven Patient Experience
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Explore how SmileAI integrates directly with clinic systems to orchestrate full-loop operations.
          </p>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          {/* Card 1: Appointment Booking */}
          <ScrollReveal animation="fade-up" delay={50} className="md:col-span-7 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/20 hover:bg-secondary/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all duration-300">
                  <Calendar className="w-5.5 h-5.5 text-indigo-650 dark:text-indigo-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Active Tool</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Interactive Appointment Booking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                Direct integration with PMS systems like Dentrix and Eaglesoft lets patients read slot openings, lock reservations, and coordinate scheduling instantly.
              </p>

              {/* Calendar Picker Mock */}
              <div className="mt-6 p-4.5 rounded-xl  dark:bg-slate-900/50 border border-slate-500/10 text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold">
                  <span>Select appointment date</span>
                  <span className="text-indigo-400">June 2026</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {['Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26'].map((day, i) => (
                    <div key={i} className={`p-2 rounded-lg border text-xs cursor-default transition ${i === 1 ? 'bg-indigo-600 border-indigo-500 text-white shadow-md font-bold' : 'bg-card/45 border-slate-500/10 hover:border-slate-500/25 text-foreground'}`}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['09:00 AM', '10:15 AM (Full)', '11:30 AM', '02:00 PM'].map((time, i) => (
                    <div key={i} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition ${i === 2 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-650 dark:text-emerald-400' : i === 1 ? 'opacity-45 line-through bg-card/20 border-slate-500/10 text-muted-foreground' : 'bg-card border-slate-500/10 hover:border-slate-500/25 text-foreground/85'}`}>
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-550 dark:hover:text-indigo-300 cursor-pointer">
              Explore Scheduler API <ArrowUpRight className="w-4 h-4" />
            </div>
          </ScrollReveal>

          {/* Card 2: Lead Qualification */}
          <ScrollReveal animation="fade-up" delay={150} className="md:col-span-5 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/20 hover:bg-secondary/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-all duration-300">
                  <Users className="w-5.5 h-5.5 text-violet-650 dark:text-violet-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">CRM Pipeline</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Intelligent Lead Qualification</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Extract demographic details, chief complaints, phone numbers, and clinical histories dynamically before passing details directly to your sales CRM.
              </p>

              {/* Form capture visualization */}
              <div className="mt-6 p-4 rounded-xl  dark:bg-slate-900/50 border border-slate-500/10 text-left space-y-3.5 shadow-inner">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-muted-foreground font-bold uppercase">Patient Capture</span>
                    <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 font-bold"><ShieldCheck className="w-3 h-3" /> Validated</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { field: 'Phone', val: '+1 (555) 019-2831' },
                      { field: 'Insurance ID', val: 'MET-8930219-X' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-slate-500/10 text-[11px]">
                        <span className="text-muted-foreground font-semibold">{item.field}</span>
                        <span className="text-foreground font-bold flex items-center gap-1">
                          {item.val}
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-violet-650 dark:text-violet-400 hover:text-violet-550 dark:hover:text-violet-300 cursor-pointer">
              View Lead Workflows <ArrowUpRight className="w-4 h-4" />
            </div>
          </ScrollReveal>

          {/* Card 3: Insurance Questions */}
          <ScrollReveal animation="fade-up" delay={250} className="md:col-span-5 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/20 hover:bg-secondary/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
                  <FileText className="w-5.5 h-5.5 text-blue-650 dark:text-blue-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-655 dark:text-blue-400 border border-blue-500/20">FAQ Engine</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Insurance Coverage Verification</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Instantly resolve patient questions about copays, deductibles, and covered treatments (e.g. root canals, implants, cleanings) using natural language.
              </p>

              {/* Chat simulation */}
              <div className="mt-6 p-4 rounded-xl  dark:bg-slate-900/50 border border-slate-500/10 text-left space-y-2.5 text-xs shadow-inner">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-300 font-bold text-[11px]">
                  &ldquo;Is a root canal covered by MetLife?&rdquo;
                </div>
                <div className="p-2 rounded-lg bg-card border border-slate-500/10 text-foreground font-medium flex gap-2">
                  <Bot className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="text-[10px]">
                    Yes, MetLife covers Endodontics (root canals) up to <span className="text-emerald-500 dark:text-emerald-400 font-bold">80%</span>. I can confirm your co-pay.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-blue-650 dark:text-blue-400 hover:text-blue-550 dark:hover:text-blue-300 cursor-pointer">
              Read Insurance API docs <ArrowUpRight className="w-4 h-4" />
            </div>
          </ScrollReveal>

          {/* Card 4: Follow-Ups */}
          <ScrollReveal animation="fade-up" delay={350} className="md:col-span-7 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/20 hover:bg-secondary/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-all duration-300">
                  <MessageSquare className="w-5.5 h-5.5 text-indigo-650 dark:text-indigo-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">Outbound Campaigns</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Smart Automated Follow-Ups</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                Increase retention rates with automated SMS/email flows checking post-op feedback, confirming upcoming appointments, or reminding patient of 6-month cleaning schedules.
              </p>

              {/* SMS/Email timeline */}
              <div className="mt-6 p-4.5 rounded-xl  dark:bg-slate-900/50 border border-slate-500/10 text-left space-y-3 text-xs shadow-inner">
                <div className="relative pl-4 border-l border-indigo-500/30 space-y-4">
                  {[
                    { title: 'Appointment Confirmed', time: 'Immediate', desc: 'SMS booking confirmation code sent' },
                    { title: 'Pre-Visit Check-in', time: '24h before', desc: 'Pre-op medical forms verification link' },
                    { title: 'Re-care Scheduling Reminder', time: '6 months later', desc: 'Routine cleaning reminder follow-up' }
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-900/40" />
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-foreground text-[11px]">{item.title}</span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-450 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold">{item.time}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-550 dark:hover:text-indigo-300 cursor-pointer">
              Analyze Lifecycle Logs <ArrowUpRight className="w-4 h-4" />
            </div>
          </ScrollReveal>

          {/* Card 5: Patient Support */}
          <ScrollReveal animation="fade-up" delay={400} className="md:col-span-6 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/20 hover:bg-secondary/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-all duration-300">
                  <HelpCircle className="w-5.5 h-5.5 text-violet-650 dark:text-violet-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Self-Service</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Full Patient Support FAQ</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Build a self-updating database. Answer clinical questions, explain general treatment timelines, list doctor bios, and detail pricing transparency.
              </p>

              {/* Accordion look */}
              <div className="mt-6 p-4 rounded-xl  dark:bg-slate-900/50 border border-slate-500/10 text-left space-y-2 text-xs shadow-inner">
                {[
                  { q: 'What is the cost of dental implants?', active: true, a: 'Dental implants range from $1,500 to $3,000 depending on insurance coverage and materials.' },
                  { q: 'Do you offer emergency root canals?', active: false }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-500/10 p-2.5 bg-card/65">
                    <div className="flex justify-between items-center font-bold text-foreground">
                      <span>{item.q}</span>
                      <span className="text-indigo-400">{item.active ? '−' : '+'}</span>
                    </div>
                    {item.active && (
                      <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">{item.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-violet-650 dark:text-violet-400 hover:text-violet-550 dark:hover:text-violet-300 cursor-pointer">
              Edit Support KB <ArrowUpRight className="w-4 h-4" />
            </div>
          </ScrollReveal>

          {/* Card 6: 24/7 Availability */}
          <ScrollReveal animation="fade-up" delay={450} className="md:col-span-6 glass p-8 rounded-2xl border border-border flex flex-col justify-between group hover:border-indigo-500/20 hover:bg-secondary/30 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Clock className="w-5.5 h-5.5 text-blue-650 dark:text-blue-400" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-650 dark:text-blue-400 border border-blue-500/20">Uptime</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">Constant 24/7 Front-Desk Availability</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ensure patients are supported outside business hours, on weekends, and during holidays. Never miss a single inbound lead or checkup slot due to busy phone lines.
              </p>

              {/* Animated status widget */}
              <div className="mt-6 p-4 rounded-xl  dark:bg-slate-900/50 border border-slate-500/10 text-left flex items-center justify-between text-xs shadow-inner">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-foreground">Front-Desk Active</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Monitoring inbound requests & chats</p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-lg font-black text-indigo-400">99.98%</span>
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Uptime SLA</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-8 text-xs font-bold text-blue-650 dark:text-blue-400 hover:text-blue-550 dark:hover:text-blue-300 cursor-pointer">
              Uptime Reports <ArrowUpRight className="w-4 h-4" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Results Section */}
      <section className=" border-t border-b border-border/40 py-24 relative overflow-hidden">
        {/* Visual accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-indigo-500/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal animation="fade-up" className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-foreground tracking-tight">
              Backed by Proven Performance
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Real analytics and performance stats driven by clinics operating with DentalAI automation.
            </p>
          </ScrollReveal>

          {/* KPI Dashboard Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: '-60%',
                label: 'Support Workload Reduction',
                desc: 'AI filters and solves routine patient booking and inquiries automatically, freeing staff time.',
                color: 'text-indigo-650 dark:text-indigo-400',
                border: 'border-indigo-500/20',
              },
              {
                stat: '+35%',
                label: 'Conversion Rate Boost',
                desc: 'Immediate replies and conversational appointment flows ensure patient booking drop-offs are minimized.',
                color: 'text-violet-650 dark:text-violet-400',
                border: 'border-violet-500/20',
              },
              {
                stat: '98%',
                label: 'Patient Retention Score',
                desc: 'Clean, instant, and professional response structures drive positive clinical service perceptions.',
                color: 'text-blue-650 dark:text-blue-400',
                border: 'border-blue-500/20',
              },
            ].map((kpi, idx) => (
              <ScrollReveal
                key={idx}
                animation="scale-in"
                delay={idx * 100}
                className={`glass p-8 rounded-2xl border ${kpi.border} text-center flex flex-col justify-between shadow-xl`}
              >
                <div>
                  <span className={`text-5xl sm:text-6xl font-black tracking-tight ${kpi.color}`}>
                    {kpi.stat}
                  </span>
                  <h3 className="text-base font-bold mt-4 mb-2 text-foreground">{kpi.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">{kpi.desc}</p>
                </div>
                <div className="border-t border-border/60 mt-6 pt-4 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Certified Clinic Audited
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <ScrollReveal animation="scale-in">
          <div className="glass p-12 rounded-[2rem] text-center relative overflow-hidden shadow-2xl border border-border">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Supercharge booking efficiency today
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Connect DentalAI directly to your website. Set up custom pricing scales, services, and doctor slots,
                and launch in under 10 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a
                  href={NAVIGATION_URLS.getStarted}
                  className="btn-glass px-8 py-3.5 text-base font-semibold w-full sm:w-auto text-center"
                >
                  Book Free Consultation
                </a>
                <a
                  href={NAVIGATION_URLS.watchDemo}
                  className="px-8 py-3.5 rounded-lg border border-border text-foreground font-medium hover:bg-secondary bg-card/45 transition duration-200 w-full sm:w-auto text-center"
                >
                  Watch Dashboard Demo
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
