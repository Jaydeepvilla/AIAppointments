import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import {
  ArrowRight,
  Check,
  Mic,
  MessageSquare,
  Phone,
  Calendar,
  TrendingUp,
  Brain,
  BarChart3,
  Globe,
  Shield,
  Building2,
  ChevronRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features | Operator— Full Capability Overview",
  description:
    "Explore every feature of Operator Receptionist: Voice AI, omnichannel messaging, appointment booking, lead qualification, analytics, and more.",
};

const FEATURE_SECTIONS = [
  {
    id: "voice",
    title: "Voice AI Receptionist",
    tagline: "Answer every call. Never go to voicemail.",
    desc: "Operator answers inbound calls on your phone number with natural, human-like conversation. It understands context, handles complex questions, and books appointments — all without human intervention.",
    features: [
      "Custom voice persona (name, tone, language)",
      "Inbound call answering on any phone number",
      "Outbound follow-up calls",
      "Real-time speech recognition & synthesis",
      "Multi-language support (40+ languages)",
      "Call recording & transcription",
      "Smart call routing to staff",
      "Voicemail drop for outbound campaigns",
      "Call summary & follow-up scheduling",
      "HIPAA-ready call handling (Medical plans)",
    ],
    metrics: [{ value: "< 1s", label: "Response latency" }, { value: "97%", label: "Call resolution rate" }],
  },
  {
    id: "omnichannel",
    title: "Omnichannel Messaging",
    tagline: "Be everywhere your customers are.",
    desc: "A single AI brain manages conversations across every channel. No matter where a customer reaches out, they get an instant, consistent, intelligent response.",
    features: [
      "Website chat widget (1-line embed)",
      "WhatsApp Business API",
      "SMS / MMS messaging",
      "Email auto-response",
      "Instagram Direct Messages",
      "Facebook Messenger",
      "Unified inbox for all channels",
      "Cross-channel conversation continuity",
      "Custom widget branding & colors",
      "Proactive engagement triggers",
    ],
    metrics: [{ value: "6", label: "Channels supported" }, { value: "< 3s", label: "First response time" }],
  },
  {
    id: "booking",
    title: "Smart Appointment Booking",
    tagline: "Book, reschedule, cancel — automatically.",
    desc: "The AI checks real-time availability, books appointments directly to your calendar, sends confirmations, and handles rescheduling or cancellation requests without staff involvement.",
    features: [
      "Google Calendar integration",
      "Outlook / Microsoft 365 sync",
      "Calendly integration",
      "Real-time availability checking",
      "Multi-service scheduling",
      "Staff assignment & rotation",
      "Automated confirmation emails & SMS",
      "Appointment reminder sequences",
      "Reschedule & cancellation workflows",
      "Buffer time & block-out rules",
    ],
    metrics: [{ value: "3×", label: "More bookings per day" }, { value: "70%", label: "Reduction in no-shows" }],
  },
  {
    id: "leads",
    title: "Lead Qualification Engine",
    tagline: "Only talk to your best prospects.",
    desc: "Define your own qualification criteria. The AI asks the right questions, scores each lead, and routes high-value prospects to your team — so you never waste time on cold calls.",
    features: [
      "Custom qualification question flows",
      "Lead scoring & prioritization",
      "Automatic CRM-style lead profiles",
      "Smart escalation to human team",
      "Disqualification with graceful exit",
      "Intent detection & urgency classification",
      "Lead capture without existing accounts",
      "Conversation summarization",
      "Tag and segment leads automatically",
      "Follow-up scheduling for cold leads",
    ],
    metrics: [{ value: "85%", label: "Lead capture rate" }, { value: "4×", label: "Sales conversion improvement" }],
  },
  {
    id: "knowledge",
    title: "Business Knowledge Base",
    tagline: "AI trained on your exact business.",
    desc: "Upload your pricing sheets, FAQs, service menus, treatment guides, or policy documents. The AI learns your content and answers customer questions accurately — like your best staff member.",
    features: [
      "PDF, DOCX, and plain text uploads",
      "Automatic website content crawling",
      "FAQ builder with AI suggestions",
      "Service & pricing catalog",
      "Version control for content updates",
      "Instant AI re-training on updates",
      "Source citation in AI responses",
      "Confidence scoring per response",
      "Gap detection (unanswered questions)",
      "Multi-language knowledge support",
    ],
    metrics: [{ value: "98%", label: "Answer accuracy" }, { value: "< 5min", label: "AI training time" }],
  },
  {
    id: "analytics",
    title: "Conversation Analytics",
    tagline: "See every interaction. Improve constantly.",
    desc: "Full visibility into every conversation, lead, and booking. Track conversion funnels, response quality, and business performance from a single dashboard.",
    features: [
      "Real-time conversation monitoring",
      "Lead conversion funnel tracking",
      "CSAT & sentiment analysis",
      "Call volume & duration analytics",
      "Revenue attribution per conversation",
      "Channel performance comparison",
      "Peak hours & demand forecasting",
      "AI response quality scoring",
      "Custom report builder",
      "CSV / PDF export",
    ],
    metrics: [{ value: "50+", label: "Analytics metrics" }, { value: "Daily", label: "Automated reports" }],
  },
  {
    id: "platform",
    title: "Multi-Location Platform",
    tagline: "Manage every location from one place.",
    desc: "One account, multiple locations. Each location gets its own AI receptionist, calendar, team, and analytics — with central oversight from a single dashboard.",
    features: [
      "Per-location AI configuration",
      "Centralized dashboard overview",
      "Location-specific phone numbers",
      "Staff assignment per location",
      "Shared or separate knowledge bases",
      "Location-level analytics",
      "Inter-location appointment routing",
      "Franchise & chain support",
      "Custom branding per location",
      "Bulk configuration management",
    ],
    metrics: [{ value: "Unlimited", label: "Locations (Agency)" }, { value: "1", label: "Dashboard for all" }],
  },
  {
    id: "security",
    title: "Enterprise Security",
    tagline: "Built for healthcare, legal, and finance.",
    desc: "Every business gets complete data isolation. Conversations, leads, and appointments are encrypted at rest and in transit. SOC2-ready infrastructure.",
    features: [
      "AES-256 encryption at rest",
      "TLS 1.3 encryption in transit",
      "Multi-tenant data isolation",
      "Role-based access control (RBAC)",
      "Audit logs for all admin actions",
      "SOC2 Type II ready architecture",
      "GDPR data handling",
      "Data retention policies",
      "IP allowlisting",
      "SSO support (Enterprise)",
    ],
    metrics: [{ value: "99.9%", label: "Uptime SLA" }, { value: "SOC2", label: "Ready" }],
  },
  {
    id: "agency",
    title: "Agency & White Label",
    tagline: "Resell AI receptionist under your brand.",
    desc: "Build a recurring revenue stream. Rebrand Operator completely, manage client accounts, set your own pricing, and deliver AI receptionists to your clients at scale.",
    features: [
      "Full white-label branding",
      "Custom domain support",
      "Agency dashboard for all clients",
      "Client account creation & management",
      "Set custom pricing per client",
      "Reseller billing & invoicing",
      "Client onboarding flows",
      "Agency team management",
      "Usage reports per client",
      "Dedicated agency success manager",
    ],
    metrics: [{ value: "Unlimited", label: "Client accounts" }, { value: "100%", label: "White-labeled" }],
  },
];

const ALL_FEATURES = [
  "Voice call answering", "Outbound calling", "Call transcription", "WhatsApp messaging",
  "SMS auto-response", "Email handling", "Instagram DMs", "Facebook Messenger",
  "Website chat widget", "Appointment booking", "Calendar sync", "Staff scheduling",
  "Lead qualification", "Lead scoring", "CRM-style profiles", "Smart escalation",
  "Knowledge base", "PDF ingestion", "Website crawling", "FAQ builder",
  "Conversation analytics", "Revenue attribution", "CSAT tracking", "Custom reports",
  "Multi-location support", "Franchise management", "Agency white-label", "Custom domains",
  "Role-based access", "Audit logs", "SOC2-ready", "Data encryption",
  "Multi-language AI", "Custom AI persona", "Qualification flows", "Reminder sequences",
  "Confirmation emails", "No-show reduction", "Follow-up automation", "Sentiment analysis",
];

export default function FeaturesPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <MarketingNav />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 dot-grid grid-fade-b pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[var(--bg-blob)] h-[var(--bg-blob-h)] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-space-6 pt-space-24 pb-space-16 text-center">
            <p className="text-body-sm text-primary  mb-space-4">Full Feature List</p>
            <h1 className="text-display-xl  tracking-tight-xs leading-display text-foreground mb-space-5">
              Everything your business
              <br />
              <span className="text-primary">needs to grow.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-title-lg text-muted-foreground leading-relaxed mb-space-10">
              Operatoris a complete AI-powered front desk — not just a chatbot. From voice calls to appointment booking, every touchpoint is handled automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-space-2">
              {FEATURE_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="radius-full border border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.03)] px-space-4 py-space-2 text-caption  text-muted-foreground hover:text-foreground hover:border-[hsl(var(--foreground)/0.15)] transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Feature sections */}
        <div className="mx-auto max-w-6xl px-space-6 pb-space-24">
          {FEATURE_SECTIONS.map((section, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-space-20 py-space-20 border-t border-[hsl(var(--foreground)/0.06)] first:border-t-0"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-space-16 items-start ${reversed ? "lg:[direction:rtl]" : ""}`}>
                  {/* Content */}
                  <div className={reversed ? "lg:[direction:ltr]" : ""}>
                    <p className="text-body-sm text-primary  mb-space-3">{section.title}</p>
                    <h2 className="text-heading-lg sm:text-heading-lg  tracking-tight-md leading-snug text-foreground mb-space-3">
                      {section.tagline}
                    </h2>
                    <p className="text-muted-foreground text-body-md leading-relaxed mb-space-6">{section.desc}</p>

                    {/* Metrics */}
                    <div className="flex gap-space-4 mb-space-6">
                      {section.metrics.map((m) => (
                        <div key={m.label} className="text-center radius-lg border border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] px-space-5 py-space-3">
                          <p className="text-heading-lg  text-primary font-mono mb-space-1">{m.value}</p>
                          <p className="text-caption text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/sign-up"
                      className="inline-flex items-center gap-space-2 radius-lg bg-primary px-space-5 py-space-2 text-body-sm  text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Try it free <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* Feature list */}
                  <div className={`radius-xl border border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] p-space-7 ${reversed ? "lg:[direction:ltr]" : ""}`}>
                    <p className="text-caption  uppercase tracking-wider text-muted-foreground mb-space-4">Included Features</p>
                    <ul className="space-y-space-3">
                      {section.features.map((f) => (
                        <li key={f} className="flex items-center gap-space-3 text-body-sm">
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* All Features Grid */}
        <section className="border-y border-[hsl(var(--foreground)/0.06)] py-space-20">
          <div className="mx-auto max-w-6xl px-space-6">
            <div className="text-center mb-space-12">
              <div className="inline-flex items-center gap-space-2 px-space-4 py-space-2 radius-full border border-primary/20 bg-primary/5 mb-space-6">
                <span className="text-caption uppercase tracking-widest text-primary font-semibold">At a glance</span>
              </div>
              <h2 className="text-heading-lg  tracking-tight-md text-foreground mb-space-3">
                Full Feature Map.
                <br />
                <span className="text-primary">Every feature, at a glance.</span>
              </h2>
              <p className="text-muted-foreground">50+ features across 9 capability areas</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-space-3">
              {ALL_FEATURES.map((feat) => (
                <div key={feat} className="flex items-center gap-space-2 radius-lg border border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] px-space-3 py-space-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-caption  text-foreground/75">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-space-28 md:py-space-36 overflow-hidden">
          <div className="absolute inset-0 dot-grid grid-fade-y pointer-events-none" />
          <div className="relative mx-auto max-w-2xl px-space-6 text-center">
            <div className="inline-flex items-center gap-space-2 px-space-4 py-space-2 radius-full border border-primary/20 bg-primary/5 mb-space-6">
              <span className="text-caption uppercase tracking-widest text-primary font-semibold">Live Demo</span>
            </div>
            <h2 className="text-heading-lg sm:text-heading-lg  tracking-tight-sm leading-snug text-foreground mb-space-5">
              Ready to see
              <br />
              Operator <span className="text-primary">live?</span>
            </h2>
            <p className="text-muted-foreground text-title-lg mb-space-8 max-w-xl mx-auto leading-relaxed">
              Set up your AI receptionist in 30 minutes. No code. No technical knowledge needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-space-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-space-2 radius-lg bg-primary px-space-6 py-space-3 text-body-sm  text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Start free trial <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-space-2 radius-lg border border-[hsl(var(--foreground)/0.08)] px-space-6 py-space-3 text-body-sm  text-foreground hover:bg-[hsl(var(--foreground)/0.04)] transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
