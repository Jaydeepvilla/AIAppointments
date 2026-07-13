"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Scale, Scissors, Activity, Sparkles, Presentation,
  Home, Dumbbell, Bot, Globe, Mail, Phone, MapPin, Clock,
  ArrowRight, ArrowLeft, Building, Check, Loader2, Rocket,
  AlertCircle, Stethoscope, Flame,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shared/select";
import { cn } from "@/components/shared/utils";
import { INDUSTRIES, TIMEZONES } from "@/lib/constants";
import { onboardingSchema, OnboardingInput } from "@/lib/validators";
import { createOrganizationAction } from "@/server/actions/onboarding";

type Step = 1 | 2 | 3 | 4 | 5;

/* ── Industry config ─────────────────────────────────────── */
const INDUSTRY_CONFIG: Record<
  string,
  { icon: React.ComponentType<any>; gradient: string; glow: string; emoji: string }
> = {
  "Dental Clinic":   { icon: Stethoscope,  gradient: "135deg, hsl(199,90%,40%), hsl(217,90%,50%)", glow: "hsl(199,90%,50%)", emoji: "🦷" },
  "Medical Clinic":  { icon: Activity,     gradient: "135deg, hsl(152,80%,35%), hsl(171,80%,40%)", glow: "hsl(152,80%,45%)", emoji: "🏥" },
  "Salon":           { icon: Scissors,     gradient: "135deg, hsl(330,80%,50%), hsl(350,80%,55%)", glow: "hsl(330,80%,55%)", emoji: "✂️" },
  "Spa":             { icon: Sparkles,     gradient: "135deg, hsl(270,80%,50%), hsl(290,80%,55%)", glow: "hsl(270,80%,55%)", emoji: "💆" },
  "Law Firm":        { icon: Scale,        gradient: "135deg, hsl(38,90%,45%), hsl(30,90%,50%)",   glow: "hsl(38,90%,50%)",  emoji: "⚖️" },
  "Consultant":      { icon: Presentation, gradient: "135deg, hsl(210,80%,45%), hsl(230,80%,55%)", glow: "hsl(210,80%,55%)", emoji: "💼" },
  "Real Estate":     { icon: Home,         gradient: "135deg, hsl(142,70%,35%), hsl(160,70%,42%)", glow: "hsl(142,70%,45%)", emoji: "🏠" },
  "Gym":             { icon: Flame,        gradient: "135deg, hsl(14,90%,50%), hsl(35,90%,50%)",   glow: "hsl(14,90%,55%)",  emoji: "💪" },
  "Other":           { icon: Bot,          gradient: "135deg, hsl(258,70%,50%), hsl(278,70%,55%)", glow: "hsl(258,70%,55%)", emoji: "✨" },
};

/* ── Step Progress ──────────────────────────────────────── */
const STEP_META = [
  { label: "Industry", desc: "Business type" },
  { label: "Details",  desc: "Contact info" },
  { label: "Location", desc: "Where you are" },
  { label: "Review",   desc: "Confirm & launch" },
];

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      {/* Progress track */}
      <div className="flex items-center mb-4">
        {STEP_META.map((_, idx) => {
          const s = idx + 1;
          const done = step > s;
          const current = step === s;
          return (
            <React.Fragment key={s}>
              {/* Node */}
              <div className={cn(
                "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all duration-500 z-10",
              )}>
                {done ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "linear-gradient(135deg, hsl(258,80%,55%), hsl(290,80%,50%))", boxShadow: "0 0 16px hsl(258,80%,55%,0.6)" }}>
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                ) : current ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full relative"
                    style={{ background: "rgba(139,92,246,0.15)", border: "2px solid hsl(258,80%,60%)", boxShadow: "0 0 20px hsl(258,80%,60%,0.3)" }}>
                    <span style={{ color: "hsl(258,100%,78%)", fontSize: "12px", fontWeight: 900 }}>{s}</span>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping [animation-duration:2s]" />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.09)" }}>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", fontWeight: 700 }}>{s}</span>
                  </div>
                )}
              </div>
              {/* Connector */}
              {s < 4 && (
                <div className="flex-1 h-px mx-1 relative" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="absolute inset-0 rounded-full transition-all duration-700"
                    style={{
                      background: "linear-gradient(to right, hsl(258,80%,55%), hsl(290,80%,50%))",
                      width: done ? "100%" : "0%",
                    }} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Labels row */}
      <div className="flex items-start">
        {STEP_META.map((meta, idx) => {
          const s = idx + 1;
          const done = step > s;
          const current = step === s;
          const isLast = s === 4;
          return (
            <React.Fragment key={s}>
              <div className={cn("flex flex-col items-center w-9 shrink-0")}>
                <span className={cn("text-[10px] font-bold leading-none whitespace-nowrap",
                  current ? "text-violet-400" : done ? "text-white/50" : "text-white/20")}>
                  {meta.label}
                </span>
              </div>
              {!isLast && <div className="flex-1 mx-1" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ── Glassmorphism Panel ────────────────────────────────── */
function GlassPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
        backdropFilter: "blur(20px)",
      }}>
      {children}
    </div>
  );
}

/* ── Input ──────────────────────────────────────────────── */
const Field = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string; icon: React.ComponentType<any>; error?: string; optional?: boolean;
  }
>(({ label, icon: Icon, error, optional, className, ...props }, ref) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]"
      style={{ color: "rgba(255,255,255,0.4)" }}>
      {label}
      {optional && <span className="normal-case tracking-normal font-normal text-white/20">(optional)</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none z-10 transition-colors duration-200"
        style={{ color: "rgba(255,255,255,0.25)" }} />
      <input
        ref={ref}
        className={cn(
          "w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white font-medium transition-all duration-200 outline-none",
          "placeholder:text-white/20",
          className
        )}
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1.5px solid rgba(255,255,255,0.09)",
        }}
        onFocus={e => {
          e.target.style.border = "1.5px solid hsl(258,80%,60%)";
          e.target.style.boxShadow = "0 0 0 3px hsl(258,80%,60%,0.15), 0 0 20px hsl(258,80%,60%,0.08)";
          e.target.style.background = "rgba(139,92,246,0.08)";
        }}
        onBlur={e => {
          e.target.style.border = "1.5px solid rgba(255,255,255,0.09)";
          e.target.style.boxShadow = "none";
          e.target.style.background = "rgba(255,255,255,0.06)";
        }}
        {...props}
      />
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0" />
        {error}
      </p>
    )}
  </div>
));
Field.displayName = "Field";

/* ── Buttons ────────────────────────────────────────────── */
function Btn({ children, onClick, type = "button", disabled, wide }: {
  children: React.ReactNode; onClick?: () => void;
  type?: "button" | "submit"; disabled?: boolean; wide?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn("inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black text-white transition-all duration-200",
        "hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
        wide && "min-w-44")}
      style={{
        background: disabled ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, hsl(258,80%,55%), hsl(278,80%,50%))",
        boxShadow: disabled ? "none" : "0 4px 24px hsl(258,80%,55%,0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
      }}>
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick, disabled }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white/50 transition-all duration-200 hover:text-white/80 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30"
      style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.10)" }}>
      {children}
    </button>
  );
}

/* ── Main Wizard ────────────────────────────────────────── */
export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [hoveredIndustry, setHoveredIndustry] = React.useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors }, trigger } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { industry: undefined, name: "", website: "", email: "", phone: "", address: "", timezone: "UTC" },
  });

  const selectedIndustry = watch("industry");
  const formValues = watch();

  const nextStep = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["industry"]);
    else if (step === 2) valid = await trigger(["name", "website", "email", "phone"]);
    else if (step === 3) valid = await trigger(["address", "timezone"]);
    if (valid) setStep(p => (p + 1) as Step);
  };

  const onSubmit = async (data: OnboardingInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setStep(5);
    try {
      const res = await createOrganizationAction(data);
      if (res.success) { router.refresh(); router.push("/dashboard"); }
      else { setSubmitError(res.error || "Failed"); setStep(4); }
    } catch (e: any) {
      setSubmitError(e?.message || "Unexpected error");
      setStep(4);
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step < 5 && <StepBar step={step} />}

      {/* ── STEP 1: Industry ── */}
      {step === 1 && (
        <GlassPanel>
          {/* Header */}
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-base font-black text-white mb-1">What type of business do you run?</h3>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              We'll auto-configure your AI Receptionist — no manual setup needed.
            </p>
          </div>

          {/* Industry grid */}
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {INDUSTRIES.map((industry) => {
                const cfg = INDUSTRY_CONFIG[industry] || INDUSTRY_CONFIG["Other"];
                const Icon = cfg.icon;
                const isSelected = selectedIndustry === industry;
                const isHovered = hoveredIndustry === industry;

                return (
                  <button key={industry} type="button"
                    onClick={() => setValue("industry", industry, { shouldValidate: true })}
                    onMouseEnter={() => setHoveredIndustry(industry)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                    className="relative flex flex-col items-center justify-center gap-3 py-5 px-3 rounded-2xl text-center cursor-pointer select-none transition-all duration-300"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${cfg.gradient.split(", ").map(c => c + "25").join(", ")})`
                        : isHovered
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(255,255,255,0.03)",
                      border: isSelected
                        ? `2px solid ${cfg.glow}60`
                        : isHovered
                          ? "2px solid rgba(255,255,255,0.15)"
                          : "2px solid rgba(255,255,255,0.07)",
                      boxShadow: isSelected
                        ? `0 0 24px ${cfg.glow}30, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`
                        : isHovered
                          ? "0 4px 16px rgba(0,0,0,0.2)"
                          : "none",
                      transform: isSelected ? "scale(1.03)" : isHovered ? "scale(1.02)" : "scale(1)",
                    }}>

                    {/* Checkmark */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ background: `linear-gradient(135deg, ${cfg.gradient})`, boxShadow: `0 0 10px ${cfg.glow}80` }}>
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300"
                      style={{
                        background: isSelected || isHovered
                          ? `linear-gradient(135deg, ${cfg.gradient})`
                          : "rgba(255,255,255,0.07)",
                        boxShadow: isSelected
                          ? `0 4px 20px ${cfg.glow}50`
                          : isHovered
                            ? `0 4px 16px ${cfg.glow}30`
                            : "none",
                      }}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>

                    <span className="text-[11px] font-bold leading-tight transition-colors duration-200"
                      style={{ color: isSelected ? "rgba(255,255,255,0.95)" : isHovered ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)" }}>
                      {industry}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.industry && (
              <p className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0 inline-block" />
                {errors.industry.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}>
            <span className="text-[11px]" style={{ color: selectedIndustry ? "hsl(258,100%,78%)" : "rgba(255,255,255,0.25)" }}>
              {selectedIndustry
                ? <span className="flex items-center gap-1.5 font-semibold"><Check className="h-3.5 w-3.5" /> {selectedIndustry} selected</span>
                : "Select your industry to continue"}
            </span>
            <Btn onClick={nextStep} disabled={!selectedIndustry}>
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Btn>
          </div>
        </GlassPanel>
      )}

      {/* ── STEP 2: Details ── */}
      {step === 2 && (
        <GlassPanel>
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-base font-black text-white mb-1">Your contact details</h3>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>How customers and your AI Receptionist will identify your business.</p>
          </div>
          <div className="p-6 space-y-4">
            <Field label="Business Name" icon={Building} error={errors.name?.message} id="name"
              placeholder="Acme Dental Clinic" {...register("name")} />
            <Field label="Website" icon={Globe} error={errors.website?.message} id="website"
              optional placeholder="https://acmedental.com" {...register("website")} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" icon={Mail} error={errors.email?.message} id="email"
                type="email" placeholder="info@acme.com" {...register("email")} />
              <Field label="Phone" icon={Phone} error={errors.phone?.message} id="phone"
                placeholder="+1 555-0199" {...register("phone")} />
            </div>
          </div>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}>
            <OutlineBtn onClick={() => setStep(p => (p - 1) as Step)}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </OutlineBtn>
            <Btn onClick={nextStep}>Continue <ArrowRight className="h-3.5 w-3.5" /></Btn>
          </div>
        </GlassPanel>
      )}

      {/* ── STEP 3: Location ── */}
      {step === 3 && (
        <GlassPanel>
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-base font-black text-white mb-1">Where are you located?</h3>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Used for scheduling in the right timezone and location-based answers.</p>
          </div>
          <div className="p-6 space-y-4">
            <Field label="Business Address" icon={MapPin} error={errors.address?.message} id="address"
              placeholder="123 Main St, Suite 100, New York, NY" {...register("address")} />
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]"
                style={{ color: "rgba(255,255,255,0.4)" }}>Timezone</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none z-10" style={{ color: "rgba(255,255,255,0.25)" }} />
                <Select defaultValue={watch("timezone")} onValueChange={v => setValue("timezone", v, { shouldValidate: true })}>
                  <SelectTrigger className="pl-10 h-11 rounded-xl text-sm text-white font-medium w-full"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.09)", outline: "none" }}>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent style={{ background: "hsl(240,22%,10%)", border: "1px solid rgba(255,255,255,0.10)", color: "white" }}>
                    {TIMEZONES.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}
                        style={{ color: "rgba(255,255,255,0.75)" }}>{tz.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.timezone && <p className="text-[11px] text-rose-400">{errors.timezone.message}</p>}
            </div>
          </div>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}>
            <OutlineBtn onClick={() => setStep(p => (p - 1) as Step)}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </OutlineBtn>
            <Btn onClick={nextStep}>Continue <ArrowRight className="h-3.5 w-3.5" /></Btn>
          </div>
        </GlassPanel>
      )}

      {/* ── STEP 4: Review ── */}
      {step === 4 && (
        <GlassPanel>
          <div className="px-6 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-base font-black text-white mb-1">Everything look right?</h3>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Review your details. You can change these later in settings.</p>
          </div>
          <div className="p-6 space-y-5">
            {submitError && (
              <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-rose-300 leading-relaxed">{submitError}</p>
              </div>
            )}

            {/* Selected industry hero */}
            {formValues.industry && (() => {
              const cfg = INDUSTRY_CONFIG[formValues.industry] || INDUSTRY_CONFIG["Other"];
              const Icon = cfg.icon;
              return (
                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${cfg.gradient.split(", ").map(c => c + "20").join(", ")})`, border: `1px solid ${cfg.glow}30` }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ background: `linear-gradient(135deg, ${cfg.gradient})`, boxShadow: `0 4px 20px ${cfg.glow}40` }}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">{formValues.industry}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">Industry configuration ready</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.25)" }}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400">Ready</span>
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "Business Name", v: formValues.name },
                { l: "Email", v: formValues.email },
                { l: "Phone", v: formValues.phone },
                { l: "Address", v: formValues.address },
                ...(formValues.website ? [{ l: "Website", v: formValues.website }] : []),
                { l: "Timezone", v: TIMEZONES.find(t => t.value === formValues.timezone)?.label || formValues.timezone },
              ].map(({ l, v }) => (
                <div key={l} className="flex flex-col gap-1 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-[9px] font-black uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.25)" }}>{l}</span>
                  <span className="text-[11px] font-bold text-white/80 truncate">{v || "—"}</span>
                </div>
              ))}
            </div>

            {/* Launch callout */}
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(168,85,247,0.08))", border: "1px solid rgba(139,92,246,0.2)" }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, hsl(258,80%,55%), hsl(278,80%,50%))", boxShadow: "0 4px 20px hsl(258,80%,55%,0.4)" }}>
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed">
                <span className="text-white font-black">Ready to launch.</span> Your AI Receptionist for{" "}
                <span className="font-bold" style={{ color: "hsl(258,100%,78%)" }}>{formValues.industry}</span> will go live the moment you click below.
              </p>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.15)" }}>
            <OutlineBtn onClick={() => setStep(p => (p - 1) as Step)} disabled={isSubmitting}>
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </OutlineBtn>
            <Btn type="submit" disabled={isSubmitting} wide>
              {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Creating…</>
                : <><Rocket className="h-3.5 w-3.5" />Launch Workspace</>}
            </Btn>
          </div>
        </GlassPanel>
      )}

      {/* ── STEP 5: Loading ── */}
      {step === 5 && (
        <GlassPanel>
          <div className="px-6 py-24 flex flex-col items-center text-center gap-8">
            {/* Animated orb */}
            <div className="relative flex items-center justify-center">
              <div className="absolute h-32 w-32 rounded-full animate-ping [animation-duration:2.5s]"
                style={{ border: "1px solid hsl(258,80%,60%,0.2)" }} />
              <div className="absolute h-24 w-24 rounded-full animate-pulse [animation-duration:1.8s]"
                style={{ background: "radial-gradient(circle, hsl(258,80%,60%,0.15), transparent)" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, hsl(258,80%,50%), hsl(290,80%,45%))",
                  boxShadow: "0 0 40px hsl(258,80%,60%,0.6), 0 0 80px hsl(258,80%,60%,0.2)",
                }}>
                <Bot className="h-9 w-9 text-white animate-bounce [animation-duration:1.5s]" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-white tracking-tight">Building your AI Receptionist…</h3>
              <p className="text-[11px] text-white/40 leading-relaxed max-w-[260px] mx-auto">
                Configuring templates, scheduling models, and tuning your AI for {formValues.industry}.
              </p>
            </div>

            {/* Progress checklist */}
            <div className="w-full max-w-[280px] space-y-3 p-5 rounded-2xl text-left"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {[
                { label: "Setting up your organization profile", done: true },
                { label: `Loading templates for ${formValues.industry}`, done: true },
                { label: "Tuning AI conversational flow", done: false },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                    style={done
                      ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }
                      : { background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                    {done
                      ? <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
                      : <Loader2 className="h-3 w-3 animate-spin" style={{ color: "hsl(258,100%,78%)" }} />}
                  </div>
                  <span className="text-[11px] leading-none" style={{ color: done ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)", fontWeight: done ? 400 : 700 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      )}
    </form>
  );
}