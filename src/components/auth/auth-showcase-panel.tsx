"use client";

import * as React from "react";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Bot,
  Phone,
  PhoneIncoming,
  Star,
} from "lucide-react";
import { cn } from "@/components/shared/utils";
import { Logo } from "@/components/shared/logo";

/* ════════════════════════════════════════════════════════════════════════════
   SLIDE 1 — Appointment schedule
   ════════════════════════════════════════════════════════════════════════════ */

const APPOINTMENTS = [
  { initials: "SM", name: "Sarah Mitchell", service: "Dental Hygiene", time: "10:30 AM", status: "active" },
  { initials: "JK", name: "James Kowalski", service: "Root Canal", time: "11:15 AM", status: "confirmed" },
  { initials: "ER", name: "Emily Rosen",    service: "Teeth Whitening", time: "2:00 PM", status: "upcoming" },
  { initials: "DL", name: "David Lee",      service: "Braces Check",    time: "3:45 PM", status: "upcoming" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    "bg-state-success-bg text-state-success-text border border-state-success-text/30",
    confirmed: "bg-primary/10 text-primary border border-primary/25",
    upcoming:  "bg-state-warning-bg text-state-warning-text border border-state-warning-text/25",
  };
  return (
    <span className={cn("px-space-1.5 py-space-0.5 radius-full text-caption font-semibold", map[status] ?? map.upcoming)}>
      {status}
    </span>
  );
}

function ScheduleCard() {
  return (
    <div
      className="bg-bg-layer-1 radius-2xl p-space-5 -rotate-2"
      style={{ boxShadow: "0 20px 60px hsl(var(--primary) / 0.18), 0 4px 16px hsl(var(--primary) / 0.08)" }}
    >
      <div className="flex items-center justify-between mb-space-4">
        <div>
          <p className="text-caption text-foreground/40 font-medium">Today&apos;s Schedule</p>
          <p className="text-label font-semibold text-foreground">Thursday, Jul 24</p>
        </div>
        <div className="flex items-center gap-space-1.5 px-space-2.5 py-space-1 radius-full bg-state-success-bg border border-state-success-text/25">
          <div className="h-1.5 w-1.5 rounded-full bg-state-success-text animate-pulse-soft shrink-0" style={{ animationDuration: "2s" }} aria-hidden="true" />
          <span className="text-caption text-state-success-text font-semibold">AI Active</span>
        </div>
      </div>
      <div className="space-y-space-0.5">
        {APPOINTMENTS.map((a, i) => (
          <div key={i} className="flex items-center gap-space-3 px-space-2.5 py-space-2 radius-lg hover:bg-foreground/[0.03] transition-colors duration-fast">
            <div className="h-8 w-8 shrink-0 radius-full bg-primary/10 border border-primary/15 flex items-center justify-center">
              <span className="text-primary font-bold text-caption">{a.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-caption font-semibold text-foreground truncate">{a.name}</p>
              <p className="text-caption text-foreground/40 truncate">{a.service}</p>
            </div>
            <div className="flex flex-col items-end gap-space-0.5 shrink-0">
              <p className="text-caption font-medium text-foreground/60 tabular-nums">{a.time}</p>
              <StatusBadge status={a.status} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-space-2 border-t border-border-subtle mt-space-3 pt-space-3">
        <Bot className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
        <span className="text-caption text-foreground/40">AI handling 3 new requests…</span>
        <div className="flex gap-space-0.5 ml-auto">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 120}ms`, animationDuration: "0.8s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfirmationCard() {
  return (
    <div
      className="bg-bg-layer-1 radius-xl p-space-4 rotate-3 animate-float"
      style={{ animationDuration: "8s", boxShadow: "0 12px 40px hsl(var(--primary) / 0.16), 0 2px 8px hsl(var(--primary) / 0.08)" }}
    >
      <div className="flex items-center gap-space-2 mb-space-2">
        <CheckCircle2 className="h-4 w-4 text-state-success-text shrink-0 animate-success" aria-hidden="true" />
        <span className="text-caption font-semibold text-state-success-text">Appointment Confirmed</span>
      </div>
      <p className="text-label font-semibold text-foreground">Sarah Mitchell</p>
      <div className="flex items-center gap-space-3 mt-space-1.5">
        <div className="flex items-center gap-space-1 text-foreground/45">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          <span className="text-caption">Thu, Jul 24</span>
        </div>
        <div className="flex items-center gap-space-1 text-foreground/45">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span className="text-caption">10:30 AM</span>
        </div>
      </div>
      <p className="text-caption text-foreground/30 mt-space-1.5">SMS confirmation sent ✓</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SLIDE 2 — Recent calls
   ════════════════════════════════════════════════════════════════════════════ */

const CALLS = [
  { initials: "AT", name: "Alicia Torres",  duration: "2:14", outcome: "booked",  time: "9:12 AM" },
  { initials: "MR", name: "Marcus Reid",    duration: "1:47", outcome: "informed", time: "9:38 AM" },
  { initials: "PK", name: "Priya Kapoor",   duration: "3:02", outcome: "booked",  time: "10:05 AM" },
  { initials: "CW", name: "Chris Walsh",    duration: "0:58", outcome: "missed",   time: "10:22 AM" },
];

function OutcomeBadge({ outcome }: { outcome: string }) {
  const map: Record<string, string> = {
    booked:   "bg-state-success-bg text-state-success-text border border-state-success-text/30",
    informed: "bg-primary/10 text-primary border border-primary/25",
    missed:   "bg-state-error-bg text-state-error-text border border-state-error-text/25",
  };
  return (
    <span className={cn("px-space-1.5 py-space-0.5 radius-full text-caption font-semibold", map[outcome] ?? map.informed)}>
      {outcome}
    </span>
  );
}

function CallsCard() {
  return (
    <div
      className="bg-bg-layer-1 radius-2xl p-space-5 -rotate-2"
      style={{ boxShadow: "0 20px 60px hsl(var(--primary) / 0.18), 0 4px 16px hsl(var(--primary) / 0.08)" }}
    >
      <div className="flex items-center justify-between mb-space-4">
        <div>
          <p className="text-caption text-foreground/40 font-medium">Recent Calls</p>
          <p className="text-label font-semibold text-foreground">Thursday, Jul 24</p>
        </div>
        <div className="flex items-center gap-space-1.5 px-space-2.5 py-space-1 radius-full bg-primary/10 border border-primary/20">
          <PhoneIncoming className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
          <span className="text-caption text-primary font-semibold">24 today</span>
        </div>
      </div>
      <div className="space-y-space-0.5">
        {CALLS.map((c, i) => (
          <div key={i} className="flex items-center gap-space-3 px-space-2.5 py-space-2 radius-lg hover:bg-foreground/[0.03] transition-colors duration-fast">
            <div className="h-8 w-8 shrink-0 radius-full bg-primary/10 border border-primary/15 flex items-center justify-center">
              <span className="text-primary font-bold text-caption">{c.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-caption font-semibold text-foreground truncate">{c.name}</p>
              <p className="text-caption text-foreground/40 truncate">{c.time} · {c.duration}</p>
            </div>
            <div className="shrink-0">
              <OutcomeBadge outcome={c.outcome} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-space-2 border-t border-border-subtle mt-space-3 pt-space-3">
        <Bot className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
        <span className="text-caption text-foreground/40">AI resolved 96% without escalation</span>
      </div>
    </div>
  );
}

function LiveCallCard() {
  return (
    <div
      className="bg-bg-layer-1 radius-xl p-space-4 -rotate-2 animate-float"
      style={{ animationDuration: "9s", boxShadow: "0 12px 40px hsl(var(--primary) / 0.16), 0 2px 8px hsl(var(--primary) / 0.08)" }}
    >
      <div className="flex items-center gap-space-2 mb-space-2">
        <div className="flex items-center gap-space-1.5 px-space-2 py-space-0.5 radius-full bg-state-error-bg border border-state-error-text/25">
          <div className="h-1.5 w-1.5 rounded-full bg-state-error-text animate-pulse-soft shrink-0" style={{ animationDuration: "1s" }} aria-hidden="true" />
          <span className="text-caption text-state-error-text font-semibold">Live Call</span>
        </div>
      </div>
      <div className="flex items-center gap-space-2 mb-space-1.5">
        <div className="h-7 w-7 shrink-0 radius-full bg-primary/10 border border-primary/15 flex items-center justify-center">
          <Phone className="h-3 w-3 text-primary" aria-hidden="true" />
        </div>
        <div>
          <p className="text-label font-semibold text-foreground">Emma Rodriguez</p>
        </div>
      </div>
      <p className="text-caption text-foreground/45 mb-space-2">Calling to book an appointment</p>
      <div className="flex items-center justify-between">
        <span className="text-caption text-foreground/35 tabular-nums">0:42</span>
        <span className="text-caption text-state-success-text font-medium">AI handling…</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SLIDE 3 — Patient satisfaction / reviews
   ════════════════════════════════════════════════════════════════════════════ */

const REVIEWS = [
  { initials: "JL", name: "Jessica Liu",    rating: 5, text: "The AI booked my appointment in seconds. Absolutely seamless." },
  { initials: "TR", name: "Tom Robertson",  rating: 5, text: "Couldn't believe how fast the reception handled my call!" },
  { initials: "AK", name: "Anita Khan",     rating: 4, text: "Super convenient — even sent an SMS confirmation right away." },
];

function StarRating({ count, size = "sm" }: { count: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-space-0.5" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "shrink-0 fill-current",
            size === "md" ? "h-5 w-5" : "h-3 w-3",
            s <= count ? "text-state-warning-text" : "text-foreground/15"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function ReviewsCard() {
  return (
    <div
      className="bg-bg-layer-1 radius-2xl p-space-5 -rotate-2"
      style={{ boxShadow: "0 20px 60px hsl(var(--primary) / 0.18), 0 4px 16px hsl(var(--primary) / 0.08)" }}
    >
      <div className="flex items-center justify-between mb-space-4">
        <div>
          <p className="text-caption text-foreground/40 font-medium">Patient Satisfaction</p>
          <div className="flex items-baseline gap-space-2 mt-space-0.5">
            <p className="text-heading-md font-bold text-foreground">4.9</p>
            <StarRating count={5} size="sm" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-caption text-foreground/35">Based on</p>
          <p className="text-label font-semibold text-primary">1,247 reviews</p>
        </div>
      </div>
      <div className="space-y-space-2">
        {REVIEWS.map((r, i) => (
          <div key={i} className="flex items-start gap-space-3 px-space-2.5 py-space-2 radius-lg hover:bg-foreground/[0.03] transition-colors duration-fast">
            <div className="h-8 w-8 shrink-0 radius-full bg-primary/10 border border-primary/15 flex items-center justify-center">
              <span className="text-primary font-bold text-caption">{r.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-space-2 mb-space-0.5">
                <p className="text-caption font-semibold text-foreground">{r.name}</p>
                <StarRating count={r.rating} size="sm" />
              </div>
              <p className="text-caption text-foreground/45 leading-body line-clamp-1">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-space-2 border-t border-border-subtle mt-space-3 pt-space-3">
        <Bot className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
        <span className="text-caption text-foreground/40">AI collected 47 new reviews this month</span>
      </div>
    </div>
  );
}

function NewReviewCard() {
  return (
    <div
      className="bg-bg-layer-1 radius-xl p-space-4 rotate-2 animate-float"
      style={{ animationDuration: "10s", boxShadow: "0 12px 40px hsl(var(--primary) / 0.16), 0 2px 8px hsl(var(--primary) / 0.08)" }}
    >
      <div className="flex items-center gap-space-2 mb-space-2">
        <Star className="h-4 w-4 text-state-warning-text fill-current shrink-0" aria-hidden="true" />
        <span className="text-caption font-semibold text-state-warning-text">New 5-star Review</span>
      </div>
      <StarRating count={5} size="sm" />
      <p className="text-caption text-foreground/55 leading-body mt-space-2 line-clamp-2">
        &ldquo;Incredible! The AI booking system is the best thing that happened to this clinic.&rdquo;
      </p>
      <p className="text-caption text-foreground/35 mt-space-1.5 font-medium">— Michael Torres</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SLIDES CONFIG
   ════════════════════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    headline: "The AI front desk\nfor modern businesses.",
    sub: "Operator handles every call and booking — automatically, 24/7.",
    MainCard: ScheduleCard,
    SmallCard: ConfirmationCard,
  },
  {
    headline: "Never miss another\nappointment or call.",
    sub: "Our AI receptionist is always on, capturing every opportunity for your practice.",
    MainCard: CallsCard,
    SmallCard: LiveCallCard,
  },
  {
    headline: "Delight customers.\nAutomate the rest.",
    sub: "From booking to confirmation, Operator manages the full patient journey seamlessly.",
    MainCard: ReviewsCard,
    SmallCard: NewReviewCard,
  },
] as const;

const TRUST = ["SOC-2 Type II", "GDPR Ready", "256-bit SSL", "99.9% Uptime"];

/* ════════════════════════════════════════════════════════════════════════════
   MOBILE HERO
   ════════════════════════════════════════════════════════════════════════════ */
export function MobileShowcaseCarousel() {
  return (
    <div
      className="relative overflow-hidden px-space-6 py-space-8 text-center"
      style={{
        background: `
          radial-gradient(ellipse 80% 70% at 20% 30%, hsl(var(--primary) / 0.20) 0%, transparent 65%),
          radial-gradient(ellipse 60% 55% at 80% 60%, hsl(var(--primary-light) / 0.15) 0%, transparent 60%),
          hsl(var(--background))
        `,
      }}
    >
      <div className="relative z-10 space-y-space-2">
        <p className="text-caption font-semibold text-primary/70 tracking-widest uppercase">AI Business Operating System</p>
        <p className="text-title-lg font-semibold tracking-tight text-foreground leading-heading">
          The AI front desk for<br />modern businesses.
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PANEL
   ════════════════════════════════════════════════════════════════════════════ */
export function AuthShowcasePanel() {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 75% 65% at 10% 15%, hsl(var(--primary) / 0.22) 0%, transparent 65%),
          radial-gradient(ellipse 55% 50% at 85% 25%, hsl(var(--primary-light) / 0.18) 0%, transparent 60%),
          radial-gradient(ellipse 65% 55% at 30% 80%, hsl(var(--primary) / 0.14) 0%, transparent 60%),
          radial-gradient(ellipse 45% 45% at 90% 80%, hsl(var(--primary-light) / 0.10) 0%, transparent 55%),
          hsl(var(--background))
        `,
      }}
    >
      <div className="pointer-events-none absolute inset-0 dot-grid grid-fade-y" style={{ opacity: 0.05 }} aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col px-space-10 xl:px-space-14 py-space-10">

        {/* Logo */}
        <div className="animate-fade-down" style={{ animationFillMode: "both" }}>
          <Logo />
        </div>

        {/* Center */}
        <div className="flex flex-1 flex-col justify-center gap-space-8">

          {/* ── Cycling headline — display-xl ── */}
          <div className="relative min-h-[13rem]">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className="absolute inset-0 space-y-space-3"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: i === active ? "auto" : "none",
                }}
                aria-hidden={i !== active}
              >
                <h2
                  className="text-display-xl font-bold tracking-tight text-foreground leading-display"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {slide.headline}
                </h2>
                <p className="text-body-md text-foreground/65 leading-body max-w-sm">
                  {slide.sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── Card composition — switches per slide ── */}
          <div className="relative min-h-[19rem]">
            {SLIDES.map((slide, i) => {
              const { MainCard, SmallCard } = slide;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex w-full justify-center"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: i === active ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                  aria-hidden={i !== active}
                >
                  <div
                    className="relative"
                    style={{ paddingTop: "3.5rem", paddingRight: "4.5rem" }}
                  >
                    {/* Small card — top-right corner of the main card */}
                    <div className="absolute top-0 right-0 w-[200px] z-10">
                      <SmallCard />
                    </div>
                    {/* Main card */}
                    <div style={{ width: "320px", position: "relative", zIndex: 1 }}>
                      <MainCard />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-space-2" role="tablist" aria-label="Showcase slides">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 radius-full transition-all duration-base",
                  i === active ? "w-6 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/40"
                )}
              />
            ))}
          </div>
        </div>

        {/* Trust row */}
        <div
          className="flex flex-wrap items-center gap-x-space-5 gap-y-space-1.5 border-t border-border-subtle pt-space-5 animate-fade-up"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          {TRUST.map((badge) => (
            <span key={badge} className="flex items-center gap-space-1.5 text-caption text-foreground/35 font-medium">
              <span className="h-1 w-1 rounded-full bg-primary/30 shrink-0" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
