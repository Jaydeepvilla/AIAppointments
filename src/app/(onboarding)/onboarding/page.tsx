import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { OnboardingWizard } from "@/components/forms/onboarding-wizard";
import { Bot, Zap, Shield, Clock, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function OnboardingPage() {
  const { hasOrg } = await checkUserOrganization();
  if (hasOrg) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ background: "hsl(240, 22%, 5%)" }}>

      {/* ── FULL-PAGE MESH BACKGROUND ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Primary aurora */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(258,90%,40%) 0%, transparent 70%)", opacity: 0.18, filter: "blur(80px)" }} />
        {/* Secondary aurora */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vh] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(290,80%,40%) 0%, transparent 70%)", opacity: 0.12, filter: "blur(100px)" }} />
        {/* Accent midpoint */}
        <div className="absolute top-[45%] right-[25%] w-[30vw] h-[30vh] rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(220,90%,50%) 0%, transparent 70%)", opacity: 0.07, filter: "blur(60px)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.25) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.35,
          }} />

        {/* Top gradient fade */}
        <div className="absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(to bottom, hsl(240,22%,5%), transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, hsl(240,22%,5%), transparent)" }} />
      </div>

      {/* ── LEFT PANEL ────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-5/12 flex-col relative z-10">
        <div className="flex flex-col h-full px-12 xl:px-16 py-12 justify-between">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group w-fit">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, hsl(258,80%,55%), hsl(290,80%,50%))", boxShadow: "0 0 30px hsl(258,80%,55%,0.4), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">Operator</span>
          </Link>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center space-y-10 my-10">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 w-fit px-4 py-2 rounded-full border"
              style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.3)", backdropFilter: "blur(12px)" }}>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "hsl(258,100%,80%)" }}>Live AI Setup</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-black leading-[1.05] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}>
                <span className="text-white">Your AI</span>
                <br />
                <span style={{ background: "linear-gradient(135deg, hsl(258,100%,80%), hsl(290,100%,75%), hsl(220,100%,80%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Receptionist
                </span>
                <br />
                <span className="text-white/50">is ready to work.</span>
              </h1>
              <p className="text-white/45 text-sm leading-relaxed max-w-[300px]">
                Tell us about your business and we'll configure everything automatically — calls, appointments, and lead capture.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: Zap, label: "Instant Setup", desc: "Go live in minutes, zero coding", gradient: "from-amber-500 to-orange-500" },
                { icon: Shield, label: "Industry Trained", desc: "Pre-configured for your business", gradient: "from-emerald-500 to-teal-500" },
                { icon: Clock, label: "24/7 Coverage", desc: "Never miss a call or booking", gradient: "from-blue-500 to-indigo-500" },
              ].map(({ icon: Icon, label, desc, gradient }) => (
                <div key={label} className="flex items-center gap-4 group cursor-default">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-200 group-hover:scale-110`}
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                    <Icon className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-none mb-1">{label}</div>
                    <div className="text-xs text-white/40">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              {[["2,400+", "Businesses"], ["98%", "Satisfaction"], ["< 5 min", "Setup"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="p-5 rounded-2xl border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4 italic">
              "Operator answered 3× more calls in the first week. Our front desk can finally focus on patients in person."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(258,80%,55%), hsl(290,80%,50%))" }}>DR</div>
              <div>
                <div className="text-xs font-bold text-white">Dr. Rachel Kim</div>
                <div className="text-[11px] text-white/35">Smile Dental · San Francisco, CA</div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">3× calls</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative z-10">

        {/* Mobile logo */}
        <div className="flex items-center px-6 py-5 lg:hidden border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "linear-gradient(135deg, hsl(258,80%,55%), hsl(290,80%,50%))", boxShadow: "0 0 20px hsl(258,80%,55%,0.4)" }}>
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-black text-lg">Operator</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto py-12 px-6 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-[520px]">

            {/* Desktop heading */}
            <div className="mb-10 hidden lg:block">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 rounded-full" style={{ background: "linear-gradient(to right, hsl(258,100%,70%), transparent)" }} />
                <span className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "hsl(258,100%,72%)" }}>Let&apos;s get started</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-3">
                Set up your workspace
              </h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Answer a few quick questions and your AI receptionist will be ready in minutes.
              </p>
            </div>

            {/* Mobile heading */}
            <div className="mb-8 lg:hidden text-center">
              <h1 className="text-2xl font-black text-white mb-2">Set up your workspace</h1>
              <p className="text-sm text-white/40">Configure your AI receptionist in minutes.</p>
            </div>

            <OnboardingWizard />
          </div>
        </div>
      </div>
    </div>
  );
}