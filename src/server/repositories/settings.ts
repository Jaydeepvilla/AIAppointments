import { eq } from "drizzle-orm";
import { db } from "../db";
import { businessSettings } from "../db/schema";

export interface NewBusinessSettings {
  organizationId: string;
  businessHours: Record<string, { open: string; close: string; closed: boolean }>;
  holidays?: string[];
  languages?: string[];
  bookingPreferences?: Record<string, any>;
  notificationPreferences?: Record<string, any>;
  leadAssignmentRules?: Record<string, any>;
  recommendationPreferences?: {
    dismissed?: string[];
    snoozed?: Record<string, string>;
  };
  websiteImportUrl?: string | null;
  websiteImportStatus?: string;
  qualityScoresHistory?: any[];
  crmSegments?: any[];
}

export const settingsRepository = {
  async getByOrg(organizationId: string) {
    const [settings] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.organizationId, organizationId));
    return settings || null;
  },

  async create(settings: NewBusinessSettings) {
    const [newSettings] = await db.insert(businessSettings).values(settings).returning();
    return newSettings;
  },

  async update(organizationId: string, settings: Partial<NewBusinessSettings>) {
    const [updated] = await db
      .update(businessSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(businessSettings.organizationId, organizationId))
      .returning();
    return updated;
  },
};
