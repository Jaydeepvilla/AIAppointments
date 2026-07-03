import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import {
  widgetConfigs,
  widgetThemes,
  widgetBranding,
  widgetLaunchers,
  widgetCustomizations,
  widgetDomains,
  widgetInstallations,
  widgetSessions,
  widgetEvents,
  organizations
} from "../db/schema";

export const widgetRepository = {
  // 1. Configs
  async getConfigs(organizationId: string) {
    let [config] = await db
      .select()
      .from(widgetConfigs)
      .where(eq(widgetConfigs.organizationId, organizationId));

    if (!config) {
      [config] = await db
        .insert(widgetConfigs)
        .values({ organizationId, enabled: true })
        .returning();
    }
    return config;
  },

  async updateConfigs(organizationId: string, enabled: boolean) {
    const existing = await this.getConfigs(organizationId);
    const [updated] = await db
      .update(widgetConfigs)
      .set({ enabled, updatedAt: new Date() })
      .where(eq(widgetConfigs.id, existing.id))
      .returning();
    return updated;
  },

  // 2. Themes
  async getTheme(organizationId: string) {
    let [theme] = await db
      .select()
      .from(widgetThemes)
      .where(eq(widgetThemes.organizationId, organizationId));

    if (!theme) {
      [theme] = await db
        .insert(widgetThemes)
        .values({
          organizationId,
          themeMode: "light",
          primaryColor: "#7a5af8",
          backgroundColor: "#ffffff",
          textColor: "#18181b",
          borderColor: "#e4e4e7",
          borderRadius: "0.75rem"
        })
        .returning();
    }
    return theme;
  },

  async updateTheme(organizationId: string, data: Partial<typeof widgetThemes.$inferInsert>) {
    const existing = await this.getTheme(organizationId);
    const [updated] = await db
      .update(widgetThemes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(widgetThemes.id, existing.id))
      .returning();
    return updated;
  },

  // 3. Branding
  async getBranding(organizationId: string) {
    let [branding] = await db
      .select()
      .from(widgetBranding)
      .where(eq(widgetBranding.organizationId, organizationId));

    if (!branding) {
      const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, organizationId));

      [branding] = await db
        .insert(widgetBranding)
        .values({
          organizationId,
          companyName: org?.name || "Operator",
          tagline: "AI Appointment Assistant",
          welcomeMessage: "Hello! How can I help you book or view services today?"
        })
        .returning();
    }
    return branding;
  },

  async updateBranding(organizationId: string, data: Partial<typeof widgetBranding.$inferInsert>) {
    const existing = await this.getBranding(organizationId);
    const [updated] = await db
      .update(widgetBranding)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(widgetBranding.id, existing.id))
      .returning();
    return updated;
  },

  // 4. Launcher
  async getLauncher(organizationId: string) {
    let [launcher] = await db
      .select()
      .from(widgetLaunchers)
      .where(eq(widgetLaunchers.organizationId, organizationId));

    if (!launcher) {
      [launcher] = await db
        .insert(widgetLaunchers)
        .values({
          organizationId,
          position: "bottom_right",
          icon: "message-square",
          size: "medium",
          spacingX: 20,
          spacingY: 20
        })
        .returning();
    }
    return launcher;
  },

  async updateLauncher(organizationId: string, data: Partial<typeof widgetLaunchers.$inferInsert>) {
    const existing = await this.getLauncher(organizationId);
    const [updated] = await db
      .update(widgetLaunchers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(widgetLaunchers.id, existing.id))
      .returning();
    return updated;
  },

  // 5. Customization
  async getCustomization(organizationId: string) {
    let [cust] = await db
      .select()
      .from(widgetCustomizations)
      .where(eq(widgetCustomizations.organizationId, organizationId));

    if (!cust) {
      [cust] = await db
        .insert(widgetCustomizations)
        .values({
          organizationId,
          starterQuestions: [
            "What services do you offer?",
            "What are your business hours?",
            "How do I schedule an appointment?"
          ],
          suggestedActions: [
            { type: "book", label: "Book Appointment" },
            { type: "services", label: "View Services" },
            { type: "pricing", label: "View Pricing" }
          ],
          proactiveTriggers: {
            timeOnPage: 10,
            scrollDepth: 50,
            exitIntent: false,
            active: false
          },
          widgetWidth: 380,
          widgetHeight: 600,
          shadowStyle: "lg"
        })
        .returning();
    }
    return cust;
  },

  async updateCustomization(organizationId: string, data: Partial<typeof widgetCustomizations.$inferInsert>) {
    const existing = await this.getCustomization(organizationId);
    const [updated] = await db
      .update(widgetCustomizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(widgetCustomizations.id, existing.id))
      .returning();
    return updated;
  },

  // 6. Whitelisted Domains
  async listDomains(organizationId: string) {
    return db
      .select()
      .from(widgetDomains)
      .where(eq(widgetDomains.organizationId, organizationId))
      .orderBy(desc(widgetDomains.createdAt));
  },

  async createDomain(data: { organizationId: string; domain: string; verificationToken: string }) {
    const [domain] = await db
      .insert(widgetDomains)
      .values({ ...data, isVerified: false, isActive: true })
      .returning();
    return domain;
  },

  async deleteDomain(organizationId: string, domainId: string) {
    await db
      .delete(widgetDomains)
      .where(and(eq(widgetDomains.id, domainId), eq(widgetDomains.organizationId, organizationId)));
  },

  async updateDomainVerification(domainId: string, isVerified: boolean) {
    const [updated] = await db
      .update(widgetDomains)
      .set({ isVerified, updatedAt: new Date() })
      .where(eq(widgetDomains.id, domainId))
      .returning();
    return updated;
  },

  // 7. Installations
  async listInstallations(organizationId: string) {
    return db
      .select()
      .from(widgetInstallations)
      .where(eq(widgetInstallations.organizationId, organizationId))
      .orderBy(desc(widgetInstallations.lastDetectedAt));
  },

  async logInstallation(organizationId: string, domain: string) {
    const [existing] = await db
      .select()
      .from(widgetInstallations)
      .where(and(eq(widgetInstallations.organizationId, organizationId), eq(widgetInstallations.domain, domain)));

    if (existing) {
      const [updated] = await db
        .update(widgetInstallations)
        .set({ lastDetectedAt: new Date(), status: "active" })
        .where(eq(widgetInstallations.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newInst] = await db
        .insert(widgetInstallations)
        .values({ organizationId, domain, status: "active" })
        .returning();
      return newInst;
    }
  },

  // 8. Sessions
  async createSession(data: { organizationId: string; conversationId: string; visitorType: string; deviceInfo?: any }) {
    const [session] = await db
      .insert(widgetSessions)
      .values(data)
      .returning();
    return session;
  },

  async findSession(id: string) {
    const [session] = await db
      .select()
      .from(widgetSessions)
      .where(eq(widgetSessions.id, id));
    return session || null;
  },

  async findSessionByConversation(conversationId: string) {
    const [session] = await db
      .select()
      .from(widgetSessions)
      .where(eq(widgetSessions.conversationId, conversationId));
    return session || null;
  },

  async updateSessionActivity(id: string) {
    await db
      .update(widgetSessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(widgetSessions.id, id));
  },

  // 9. Events
  async createEvent(data: { organizationId: string; sessionId?: string | null; eventType: string; eventData?: any }) {
    const [event] = await db
      .insert(widgetEvents)
      .values(data)
      .returning();
    return event;
  },

  async getAnalytics(organizationId: string) {
    // Return aggregated stats
    const eventsList = await db
      .select()
      .from(widgetEvents)
      .where(eq(widgetEvents.organizationId, organizationId));

    const opens = eventsList.filter((e) => e.eventType === "widget_open").length;
    const starts = eventsList.filter((e) => e.eventType === "convo_start").length;
    const bookings = eventsList.filter((e) => e.eventType === "booking_complete").length;
    const leads = eventsList.filter((e) => e.eventType === "lead_capture").length;

    return {
      widgetOpens: opens,
      conversationStarts: starts,
      bookingsCount: bookings,
      leadCapturesCount: leads,
      engagementRate: opens > 0 ? Math.round((starts / opens) * 100) : 0,
      conversionRate: starts > 0 ? Math.round((bookings / starts) * 100) : 0,
    };
  }
};
