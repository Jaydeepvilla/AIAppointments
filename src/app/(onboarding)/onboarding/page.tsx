import { redirect } from "next/navigation";
import { checkUserOrganization } from "@/server/actions/onboarding";
import { OnboardingWizard } from "@/components/forms/onboarding-wizard";
import { Bot, Zap, Shield, Clock } from "lucide-react";
import Link from "next/link";

export default async function OnboardingPage() {
  const { hasOrg } = await checkUserOrganization();

  if (hasOrg) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">

      {/* ── Left Panel: Brand Story ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 flex-col relative overflow-hidden">

        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(250,75%,22%)] via-[hsl(250,75%,30%)] to-[hsl(265,80%,20%)]" />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url(\data:image/svg+xml,%3Csvg viewBox=0 0 256 256 xmlns=http://www.w3.org/2000/svg%3E%3Cfilter id=noise%3E%3CfeTurbulence type=fractalNoise baseFrequency=0.9 numOctaves=4 stitchTiles=stitch/%3E%3C/filter%3E%3Crect width=100%25 height=100%25 filter=url(%23noise) opacity=1/%3E%3C/svg%3E\)]" />

        {/* Radial glows */}
        <div className="absolute top-[-15%] left-[-10%] w-full max-w-lg h-full rounded-full bg-[hsl(250,75%,60%)] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[-10%] w-80 h-80 rounded-full bg-[hsl(265,80%,55%)] opacity-15 blur-3xl pointer-events-none" />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-space-10 xl:p-space-14">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-space-3 group mb-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 border border-white/20 text-white transition-all group-hover:scale-105 group-hover:bg-white/20 backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Operator</span>
          </Link>

          {/* Headline block */}
          <div className="mt-space-12 mb-space-10">
            <div className="inline-flex items-center gap-space-2 px-space-3 py-space-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-space-6">
              <Zap className="h-3.5 w-3.5 text-white/80" />
              <span className="text-white/80 text-xs font-medium">Setup in under 5 minutes</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight mb-space-5">
              Your AI Receptionist<br />
              <span className="text-white/60">is ready to work.</span>
            </h1>
            <p className="text-white/55 text-base leading-relaxed max-w-sm">
              Tell us about your business and we'll configure your AI receptionist to handle calls, book appointments, and capture leads — automatically.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-space-4 mb-space-12">
            {[
              { icon: Zap, title: "Instant Setup", desc: "Go live in minutes, no coding required" },
              { icon: Shield, title: "Industry Trained", desc: "Pre-configured for your business type" },
              { icon: Clock, title: "24/7 Coverage", desc: "Never miss a call or appointment again" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-space-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white/80">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-space-0.5">{title}</p>
                  <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="p-space-5 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm">
            <p className="text-white/70 text-sm leading-relaxed mb-space-4 italic">
              "Operator answered 3× more calls in the first week. Our front desk staff can finally focus on patients."
            </p>
            <div className="flex items-center gap-space-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(250,75%,65%)] to-[hsl(250,75%,50%)] flex items-center justify-center text-white text-xs font-semibold">
                DR
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Dr. Rachel Kim</p>
                <p className="text-white/45 text-xs">Smile Dental — San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex flex-col relative">

        {/* Subtle background */}
        <div className="absolute inset-0 bg-[hsl(var(--background))]" />

        {/* Top-right glow for light mode visibility */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        {/* Mobile logo bar */}
        <div className="relative z-10 flex items-center justify-between p-space-5 lg:hidden border-b border-border/50">
          <Link href="/" className="inline-flex items-center gap-space-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all group-hover:scale-105">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <span className="text-foreground font-semibold text-base tracking-tight">Operator</span>
          </Link>
        </div>

        {/* Scrollable form area */}
        <div className="relative z-10 flex flex-1 items-start lg:items-center justify-center overflow-y-auto py-space-10 px-space-5 sm:px-space-8 lg:px-space-12 xl:px-space-16">
          <div className="w-full max-w-md">

            {/* Mobile header */}
            <div className="text-center mb-space-8 lg:hidden">
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-space-2">
                Welcome to Operator
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Set up your AI receptionist in minutes — no technical knowledge required.
              </p>
            </div>

            {/* Desktop heading */}
            <div className="mb-space-8 hidden lg:block">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-space-3">Let's get started</p>
              <h2 className="text-2xl font-bold text-foreground tracking-tight mb-space-2">
                Set up your workspace
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Answer a few quick questions and your AI receptionist will be ready in minutes.
              </p>
            </div>

            <OnboardingWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
