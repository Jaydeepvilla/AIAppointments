"use client";import { Badge } from "@/components/shared/badge";

import Link from "next/link";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import {
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock } from
"lucide-react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";

const CATEGORIES = ["All", "Calendars", "Communication", "Payments", "AI & Intelligence", "CRM", "Coming Soon"];

const INTEGRATIONS = [
{
  name: "Google Calendar",
  category: "Calendars",
  status: "live",
  initial: "G",
  color: "#4285F4",
  desc: "Sync appointments directly to Google Calendar. Real-time availability checking and automatic booking confirmation.",
  features: ["Two-way sync", "Real-time availability", "Multi-calendar support", "Buffer time management"],
  badge: "Most Popular"
},

{
  name: "Calendly",
  category: "Calendars",
  status: "live",
  initial: "C",
  color: "#006BFF",
  desc: "Connect your existing Calendly account. AI books using your Calendly event types automatically.",
  features: ["Event type sync", "Availability embedding", "Custom booking links", "Round-robin scheduling"],
  badge: null
},
{
  name: "WhatsApp Business",
  category: "Communication",
  status: "live",
  initial: "W",
  color: "#25D366",
  desc: "Full WhatsApp Business API integration. Send and receive messages, handle bookings, and qualify leads.",
  features: ["WhatsApp Business API", "Rich media support", "Template messages", "Broadcast messaging"],
  badge: "Most Popular"
},
{
  name: "Twilio SMS",
  category: "Communication",
  status: "live",
  initial: "T",
  color: "#F22F46",
  desc: "Send and receive SMS messages. AI handles inbound SMS inquiries and sends booking confirmations automatically.",
  features: ["Inbound SMS handling", "Automated responses", "MMS support", "Delivery receipts"],
  badge: null
},
{
  name: "SendGrid Email",
  category: "Communication",
  status: "live",
  initial: "S",
  color: "#1A82E2",
  desc: "Transactional email for booking confirmations, reminders, and follow-ups. High deliverability guaranteed.",
  features: ["Booking confirmations", "Reminder sequences", "Custom templates", "Open rate tracking"],
  badge: null
},
{
  name: "Instagram DM",
  category: "Communication",
  status: "live",
  initial: "I",
  color: "#E4405F",
  desc: "Handle Instagram Direct Message inquiries automatically. AI responds to DMs and books appointments.",
  features: ["DM auto-response", "Story reply handling", "Lead qualification", "Comment management"],
  badge: null
},
{
  name: "Facebook Messenger",
  category: "Communication",
  status: "live",
  initial: "F",
  color: "#1877F2",
  desc: "Full Facebook Messenger integration for your business page. Automated conversations 24/7.",
  features: ["Page messenger bot", "Quick replies", "Persistent menu", "Lead capture forms"],
  badge: null
},
{
  name: "Stripe",
  category: "Payments",
  status: "live",
  initial: "S",
  color: "#635BFF",
  desc: "Accept payments for appointments, deposits, and subscriptions. Used for Operator subscription billing.",
  features: ["Payment collection", "Subscription billing", "Deposit handling", "Invoice generation"],
  badge: null
},
{
  name: "Razorpay",
  category: "Payments",
  status: "live",
  initial: "R",
  color: "#3395FF",
  desc: "Indian payment gateway support. Accept UPI, net banking, cards, and wallet payments.",
  features: ["UPI payments", "Net banking", "Card processing", "INR billing"],
  badge: "India"
},
{
  name: "OpenAI GPT-4",
  category: "AI & Intelligence",
  status: "live",
  initial: "O",
  color: "#10a37f",
  desc: "The intelligence layer powering Operator. GPT-4 handles natural language understanding and response generation.",
  features: ["Natural language AI", "Context retention", "Multi-turn conversations", "Intent detection"],
  badge: "Core"
},
{
  name: "Twilio Voice",
  category: "Communication",
  status: "live",
  initial: "T",
  color: "#F22F46",
  desc: "Powers the Voice AI Receptionist. Real-time speech recognition and synthesis for natural phone conversations.",
  features: ["Real-time voice AI", "Speech recognition", "Text-to-speech", "Call recording"],
  badge: null
},
{
  name: "HubSpot CRM",
  category: "CRM",
  status: "coming-soon",
  initial: "H",
  color: "#FF7A59",
  desc: "Sync leads, contacts, and deal data to HubSpot automatically from every conversation.",
  features: ["Contact sync", "Deal creation", "Activity logging", "Pipeline tracking"],
  badge: "Q3 2025"
},
{
  name: "Salesforce",
  category: "CRM",
  status: "coming-soon",
  initial: "S",
  color: "#00A1E0",
  desc: "Enterprise CRM integration. Full bi-directional sync with Salesforce objects and workflows.",
  features: ["Lead sync", "Opportunity creation", "Custom fields", "Workflow triggers"],
  badge: "Q4 2025"
},
{
  name: "Zoom",
  category: "Communication",
  status: "coming-soon",
  initial: "Z",
  color: "#2D8CFF",
  desc: "Automatically generate Zoom meeting links when a virtual consultation is booked.",
  features: ["Auto meeting links", "Calendar integration", "Reminder setup", "Recording access"],
  badge: "Q3 2025"
},
{
  name: "Google Meet",
  category: "Communication",
  status: "coming-soon",
  initial: "G",
  color: "#00897B",
  desc: "Generate Google Meet links for virtual appointments. Integrates with Google Calendar.",
  features: ["Meet link generation", "Calendar sync", "Email notifications", "Recording support"],
  badge: "Q3 2025"
}];


const liveCount = INTEGRATIONS.filter((i) => i.status === "live").length;

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = INTEGRATIONS.filter((i) => {
    const matchCategory = activeCategory === "All" || (
    activeCategory === "Coming Soon" ? i.status === "coming-soon" : i.category === activeCategory);
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.desc.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingNav />

      {/* Background */}
      <div className="pointer-events-none fixed inset-space-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] right-[10%] h-96 w-full max-w-sm radius-full bg-[hsl(var(--primary)/0.05)] blur-[100px]" />
        <div className="dot-grid absolute inset-space-0 grid-fade-b opacity-40" />
      </div>

      <main className="relative z-10 overflow-x-hidden">
        {/* Hero */}
        <section className="container mx-auto max-w-3xl px-space-6 pt-space-28 pb-space-16 text-center">
          <Badge variant="soft" className="mb-space-6">
            <Sparkles className="h-3 w-3 text-primary" /> Integration Directory
          </Badge>
          <h1 className="text-display-lg sm:text-display-lg  tracking-tight-2xs text-foreground leading-heading mb-space-5">
            Connects to the tools{" "}
            <span className="text-primary">you already use</span>
          </h1>
          <p className="text-body-md text-muted-foreground leading-relaxed mb-space-8 max-w-xl mx-auto">
            {liveCount} live integrations across calendars, communications, payments, and AI. More added every month.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-space-6 text-body-sm">
            <div className="text-center">
              <span className="text-heading-lg  text-foreground tabular-num block tracking-tight">{liveCount}</span>
              <span className="text-muted-foreground">Live</span>
            </div>
            <div className="h-8 w-px bg-[hsl(var(--foreground)/0.08)]" />
            <div className="text-center">
              <span className="text-heading-lg  text-foreground tabular-num block tracking-tight">{INTEGRATIONS.length - liveCount}</span>
              <span className="text-muted-foreground">Coming Soon</span>
            </div>
            <div className="h-8 w-px bg-[hsl(var(--foreground)/0.08)]" />
            <div className="text-center">
              <span className="text-heading-lg  text-foreground tabular-num block tracking-tight">∞</span>
              <span className="text-muted-foreground">Zapier via API</span>
            </div>
          </div>
        </section>

        {/* Search + Filter */}
        <section className="container mx-auto max-w-6xl px-space-6 pb-space-8">
          <div className="flex flex-col sm:flex-row gap-space-3 mb-space-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-space-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full radius-lg border border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.03)] pl-space-8 pr-space-4 py-space-2 text-body-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[hsl(var(--primary)/0.4)] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.2)]"
                placeholder="Search integrations..." />
              
            </div>
          </div>

          <div className="flex flex-wrap gap-space-2 mb-space-8">
            {CATEGORIES.map((cat) =>
            <Button key={cat} onClick={() => setActiveCategory(cat)}
            className={`radius-lg border px-space-4 py-space-2 text-caption  transition-all duration-150 ${activeCategory === cat ?
            "border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.06)] text-primary" :
            "border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.03)] text-muted-foreground hover:text-foreground hover:border-[hsl(var(--foreground)/0.12)]"}`
            }>
              
                {cat}
              </Button>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-4">
            {filtered.map((int) =>
            <div
              key={`${int.name}-${int.category}`}
              className={`radius-lg border p-space-5 flex flex-col gap-space-4 transition-all duration-150 ${int.status === "coming-soon" ?
              "border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.01)] opacity-70" :
              "border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] hover:border-[hsl(var(--foreground)/0.10)]"}`
              }>
              
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-3">
                    <div
                    className="h-9 w-9 radius-lg flex items-center justify-center text-body-md  border"
                    style={{
                      backgroundColor: `${int.color}12`,
                      color: int.color,
                      borderColor: `${int.color}20`
                    }}>
                    
                      {int.initial}
                    </div>
                    <div>
                      <h3 className=" text-body-sm text-foreground tracking-tight-lg">{int.name}</h3>
                      <span className="text-caption text-muted-foreground">{int.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-2 shrink-0">
                    {int.badge &&
                  <span className={`text-caption  px-space-2 py-space-1 rounded border uppercase tracking-wide ${int.status === "live" ?
                  "bg-[hsl(var(--primary)/0.06)] text-primary border-[hsl(var(--primary)/0.15)]" :
                  "bg-[hsl(var(--foreground)/0.05)] text-muted-foreground border-[hsl(var(--foreground)/0.08)]"}`
                  }>
                        {int.badge}
                      </span>
                  }
                    <span className={`text-caption  px-space-2 py-space-1 rounded border uppercase tracking-wide ${int.status === "live" ?
                  "bg-[hsl(142_71%_45%/0.08)] text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%/0.15)]" :
                  "bg-[hsl(var(--foreground)/0.04)] text-muted-foreground border-[hsl(var(--foreground)/0.08)]"}`
                  }>
                      {int.status === "live" ? "Live" : "Soon"}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-caption text-muted-foreground leading-relaxed">{int.desc}</p>

                {/* Features */}
                <ul className="space-y-space-2">
                  {int.features.map((f) =>
                <li key={f} className="flex items-center gap-space-2 text-caption text-foreground/70">
                      <CheckCircle2 className="h-3 w-3 text-[hsl(142_71%_45%)] shrink-0" />
                      {f}
                    </li>
                )}
                </ul>

                {/* CTA */}
                {int.status === "live" ?
              <Link
                href="/sign-up"
                className="mt-auto text-caption  text-primary hover:text-primary/80 flex items-center gap-space-1 transition-colors duration-150">
                
                    Connect now <ArrowRight className="h-3 w-3" />
                  </Link> :

              <span className="mt-auto text-caption text-muted-foreground flex items-center gap-space-1">
                    <Clock className="h-3 w-3" /> Expected {int.badge || "2025"}
                  </span>
              }
              </div>
            )}
          </div>

          {filtered.length === 0 &&
          <div className="text-center py-space-16 text-muted-foreground radius-lg border border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)]">
              <Search className="h-6 w-6 mx-auto mb-space-3 opacity-30" />
              <p className="text-body-sm">No integrations match "{search}"</p>
            </div>
          }
        </section>

        {/* Request CTA */}
        <section className="border-t border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)] py-space-16">
          <div className="container mx-auto max-w-2xl px-space-6 text-center">
            <div className="inline-flex items-center gap-space-2 px-space-4 py-space-2 radius-full border border-primary/20 bg-primary/5 mb-space-6">
              <span className="text-caption uppercase tracking-widest text-primary font-semibold">Request Custom</span>
            </div>
            <h2 className="text-heading-lg  tracking-tight-xs mb-space-3">
              Missing Integration?
              <br />
              Request <span className="text-primary">your custom tool.</span>
            </h2>
            <p className="text-body-sm text-muted-foreground mb-space-7 leading-relaxed max-w-md mx-auto">
              Request an integration — we prioritize based on customer demand. Most integrations ship within 4–6 weeks.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-space-2 radius-lg bg-primary px-space-6 py-space-2 text-body-sm  text-primary-foreground hover:bg-primary/90 transition-colors duration-150">
              
              Request an Integration <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>);

}