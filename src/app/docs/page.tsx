"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import {
  Sparkles,
  ArrowRight,
  Book,
  Terminal,
  Mic,
  Calendar,
  MessageSquare,
  Brain,
  CreditCard,
  Building2,
  AlertCircle,
  Code,
  Search,
  ChevronRight,
  CheckCircle2,
  Globe,
  Zap,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";

const SIDEBAR = [
  {
    section: "Getting Started",
    icon: Zap,
    items: [
      { id: "quickstart", label: "Quick Start Guide", badge: "Start here" },
      { id: "account-setup", label: "Account Setup" },
      { id: "industry-templates", label: "Industry Templates" },
      { id: "first-ai", label: "Configure Your AI" },
    ],
  },
  {
    section: "Website Widget",
    icon: Globe,
    items: [
      { id: "widget-install", label: "Installation" },
      { id: "widget-customize", label: "Customization" },
      { id: "widget-events", label: "Events & Callbacks" },
      { id: "widget-advanced", label: "Advanced Config" },
    ],
  },
  {
    section: "Voice AI",
    icon: Mic,
    items: [
      { id: "voice-setup", label: "Phone Number Setup" },
      { id: "voice-configure", label: "Voice & Persona" },
      { id: "voice-routing", label: "Call Routing Rules" },
      { id: "voice-recording", label: "Recordings & Transcripts" },
    ],
  },
  {
    section: "Appointment Booking",
    icon: Calendar,
    items: [
      { id: "booking-calendars", label: "Calendar Integration" },
      { id: "booking-services", label: "Services & Pricing" },
      { id: "booking-availability", label: "Availability Rules" },
      { id: "booking-confirmations", label: "Confirmations & Reminders" },
    ],
  },
  {
    section: "Knowledge Base",
    icon: Brain,
    items: [
      { id: "kb-adding", label: "Adding Content" },
      { id: "kb-uploads", label: "Document Uploads" },
      { id: "kb-faqs", label: "FAQ Builder" },
      { id: "kb-web-crawl", label: "Website Crawling" },
    ],
  },
  {
    section: "Omnichannel",
    icon: MessageSquare,
    items: [
      { id: "channels-whatsapp", label: "WhatsApp Setup" },
      { id: "channels-sms", label: "SMS Setup" },
      { id: "channels-email", label: "Email Integration" },
      { id: "channels-instagram", label: "Instagram DM" },
    ],
  },
  {
    section: "API Reference",
    icon: Code,
    items: [
      { id: "api-auth", label: "Authentication" },
      { id: "api-conversations", label: "Conversations API" },
      { id: "api-bookings", label: "Bookings API" },
      { id: "api-leads", label: "Leads API" },
      { id: "api-webhooks", label: "Webhooks" },
    ],
  },
  {
    section: "Agency Mode",
    icon: Building2,
    items: [
      { id: "agency-setup", label: "Agency Account Setup" },
      { id: "agency-clients", label: "Managing Clients" },
      { id: "agency-branding", label: "White-Label Branding" },
      { id: "agency-billing", label: "Reseller Billing" },
    ],
  },
  {
    section: "Billing",
    icon: CreditCard,
    items: [
      { id: "billing-plans", label: "Plan Overview" },
      { id: "billing-stripe", label: "Stripe Integration" },
      { id: "billing-razorpay", label: "Razorpay (India)" },
      { id: "billing-invoices", label: "Invoices & Tax" },
    ],
  },
  {
    section: "Troubleshooting",
    icon: AlertCircle,
    items: [
      { id: "ts-widget", label: "Widget Not Loading" },
      { id: "ts-voice", label: "Voice AI Issues" },
      { id: "ts-calendar", label: "Calendar Sync Issues" },
      { id: "ts-billing", label: "Billing & Payments" },
    ],
  },
];

const DOC_CONTENT: Record<string, { title: string; content: string; code?: string }> = {
  quickstart: {
    title: "Quick Start Guide",
    content: `Welcome to Operator Receptionist. You can have your AI receptionist live in under 30 minutes. Here's everything you need to get started.

**Step 1: Create your account**
Sign up at app.nexx.ai and verify your email address. Choose your industry during onboarding.

**Step 2: Enter your business details**
Add your business name, contact information, services, pricing, and hours. The AI uses this to answer customer questions accurately.

**Step 3: Train your AI**
Upload FAQs, service menus, or documents. The AI learns from your content and can answer questions immediately.

**Step 4: Connect your calendar**
Link Google Calendar, Outlook, or Calendly. The AI will check real availability before booking.

**Step 5: Deploy the widget**
Copy your embed code and paste it before the closing </body> tag on your website.

**Step 6: Set up your phone number**
Purchase a virtual phone number or forward your existing number to receive AI-answered calls.

That's it. Your AI receptionist is live.`,
    code: `<!-- Add this before </body> on your website -->
<script
  src="https://cdn.nexx.ai/widget.js"
  data-business-id="YOUR_BUSINESS_ID"
  data-theme="dark"
  async
></script>`,
  },
  "widget-install": {
    title: "Widget Installation",
    content: `The Operator website widget is a lightweight JavaScript embed that works on any website — WordPress, Shopify, Wix, Webflow, or custom-built sites.

**Requirements:**
- Any website where you can add custom HTML or JavaScript
- A Operator account with a configured business profile

**Basic Installation:**
Copy the code snippet below and paste it into your website's HTML, just before the closing </body> tag.

**WordPress:**
Go to Appearance → Theme Editor → footer.php, and paste the code before </body>.

**Shopify:**
Go to Online Store → Themes → Edit Code → theme.liquid, paste before </body>.

**Webflow:**
Go to Site Settings → Custom Code → Footer Code, paste the snippet.

**Testing:**
After installation, visit your website and look for the chat bubble in the bottom-right corner. If it doesn't appear, check the browser console for errors.`,
    code: `<!-- Basic Widget Install -->
<script
  src="https://cdn.nexx.ai/widget.js"
  data-business-id="biz_your_id_here"
  data-theme="dark"
  data-position="bottom-right"
  data-primary-color="#6366f1"
  async
></script>

<!-- Advanced Config -->
<script>
  window.NexxAI = {
    businessId: "biz_your_id_here",
    theme: "dark",
    position: "bottom-right",
    primaryColor: "#6366f1",
    greeting: "Hi! How can I help you today?",
    avatar: "https://yoursite.com/bot-avatar.png",
    onLeadCapture: function(lead) {
      console.log("New lead:", lead);
      // Send to your CRM, analytics, etc.
    }
  };
</script>
<script src="https://cdn.nexx.ai/widget.js" async></script>`,
  },
  "api-auth": {
    title: "API Authentication",
    content: `The Operator API uses bearer token authentication. All requests must include a valid API key in the Authorization header.

**Getting your API key:**
1. Go to Settings → API Keys in your dashboard
2. Click "Generate New Key"
3. Copy and store the key securely — it won't be shown again

**Request format:**
Include your API key as a Bearer token in every request header.

**Rate Limits:**
- Starter: 100 requests/minute
- Professional: 500 requests/minute  
- Business: 2,000 requests/minute
- Agency: 10,000 requests/minute

**Errors:**
401 Unauthorized — Invalid or missing API key
403 Forbidden — Valid key but insufficient permissions
429 Too Many Requests — Rate limit exceeded`,
    code: `// Authentication example
const response = await fetch("https://api.nexx.ai/v1/conversations", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
    "X-Organization-ID": "org_your_org_id",
  },
});

const data = await response.json();

// Example: Create a conversation
const newConversation = await fetch("https://api.nexx.ai/v1/conversations", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    channel: "web",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    initialMessage: "I'd like to book an appointment",
  }),
});`,
  },
};

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState("quickstart");
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState<string[]>(["Getting Started"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const currentDoc = DOC_CONTENT[activeDoc] ?? {
    title: SIDEBAR.flatMap((s) => s.items).find((i) => i.id === activeDoc)?.label ?? "Documentation",
    content: "This section is being written. Check back soon or contact our support team for help with this topic.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <MarketingNav />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[hsl(var(--foreground)/0.06)] bg-background p-space-4 sticky top-space-14 h-[calc(100vh-56px)] overflow-y-auto">
          <div className="relative mb-space-4">
            <Search className="absolute left-space-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full radius-lg border border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.03)] pl-space-8 pr-space-3 py-space-2 text-caption text-foreground placeholder:text-muted-foreground/50 focus:border-[hsl(var(--primary)/0.4)] focus:outline-none"
              placeholder="Search docs..."
            />
          </div>
          <div className="space-y-space-1">
            {SIDEBAR.filter((s) =>
              !search || s.items.some((i) => i.label.toLowerCase().includes(search.toLowerCase()))
            ).map((section) => (
              <div key={section.section}>
                <Button
                  onClick={() => toggleSection(section.section)}
                  className="w-full flex items-center justify-between px-space-2 py-space-2 text-caption  uppercase tracking-widest text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                >
                  <div className="flex items-center gap-space-2">
                    <section.icon className="h-3 w-3" />
                    {section.section}
                  </div>
                  <ChevronRight className={`h-3 w-3 transition-transform ${openSections.includes(section.section) ? "rotate-90" : ""}`} />
                </Button>
                {openSections.includes(section.section) && (
                  <div className="ml-space-2 border-l border-[hsl(var(--foreground)/0.06)] pl-space-3 mb-space-1 space-y-space-1">
                    {section.items.filter((i) =>
                      !search || i.label.toLowerCase().includes(search.toLowerCase())
                    ).map((item) => (
                      <Button
                        key={item.id}
                        onClick={() => setActiveDoc(item.id)}
                        className={`w-full flex items-center justify-between px-space-2 py-space-2 radius-md text-caption transition-all duration-150 text-left ${activeDoc === item.id
                          ? "bg-[hsl(var(--primary)/0.08)] text-primary "
                          : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--foreground)/0.04)]"
                          }`}
                      >
                        <span>{item.label}</span>
                        {(item as any).badge && (
                          <span className="text-caption  bg-[hsl(142_71%_45%/0.08)] text-[hsl(142_71%_45%)] border border-[hsl(142_71%_45%/0.15)] px-space-2 py-space-1 rounded">{(item as any).badge}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-space-8 lg:p-space-12 max-w-4xl">
          <div className="mb-space-8">
            <div className="flex items-center gap-space-2 text-caption text-muted-foreground/60 mb-space-5">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-muted-foreground">{currentDoc.title}</span>
            </div>
            <h1 className="text-heading-lg  tracking-tight-xs text-foreground mb-space-3">{currentDoc.title}</h1>
          </div>

          <div className="prose max-w-none">
            {currentDoc.content.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="text-body-md  text-foreground mt-space-6 mb-space-2 tracking-tight-lg">{para.slice(2, -2)}</h3>;
              }
              const processed = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
              return <p key={i} className="text-body-sm text-muted-foreground leading-relaxed mb-space-4" dangerouslySetInnerHTML={{ __html: processed }} />;
            })}
          </div>

          {currentDoc.code && (
            <div className="mt-space-6 radius-lg border border-[hsl(var(--foreground)/0.08)] bg-[hsl(var(--foreground)/0.03)] overflow-hidden">
              <div className="flex items-center justify-between px-space-4 py-space-2 border-b border-[hsl(var(--foreground)/0.06)] bg-[hsl(var(--foreground)/0.02)]">
                <span className="text-caption  text-muted-foreground">JavaScript</span>
                <span className="text-caption text-muted-foreground/50 font-mono">code example</span>
              </div>
              <pre className="p-space-5 text-caption text-[hsl(142_71%_55%)] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {currentDoc.code}
              </pre>
            </div>
          )}

          <div className="mt-space-12 flex items-center justify-between pt-space-8 border-t border-[hsl(var(--foreground)/0.06)]">
            <Button className="flex items-center gap-space-2 text-caption text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="h-3.5 w-3.5 rotate-180" /> Previous
            </Button>
            <Link href="/contact" className="text-caption text-primary hover:text-primary/80 transition-colors flex items-center gap-space-1">
              Was this helpful? Feedback <ArrowRight className="h-3 w-3" />
            </Link>
            <Button className="flex items-center gap-space-2 text-caption text-muted-foreground hover:text-foreground transition-colors">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </main>
      </div>

      <MarketingFooter />
    </div>
  );
}
