import { db } from "../../src/server/db";
import {
  organizations,
  memberships,
  businessProfiles,
  businessSettings
} from "../../src/server/db/schema";
import { faker } from "@faker-js/faker";

export const ORG_ID = "11111111-1111-1111-1111-111111111111";

export async function seedBusiness(userIds: string[]): Promise<string> {
  console.log("🏢 Seeding organization and business details...");

  // 1. Create Organization
  await db.insert(organizations).values({
    id: ORG_ID,
    name: "Glow & Grace Esthetics",
    slug: "glow-and-grace-esthetics",
    industry: "Beauty & Wellness",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    website: "https://www.glowandgraceesthetics.com",
    email: "concierge@glowandgraceesthetics.com",
    phone: "+15559876543",
    address: "742 Evergreen Terrace, Seattle, WA 98101",
    timezone: "America/Los_Angeles",
  }).onConflictDoNothing();

  // 2. Link all users to organization as owners/managers
  for (const userId of userIds) {
    await db.insert(memberships).values({
      organizationId: ORG_ID,
      userId: userId,
      role: "owner",
    }).onConflictDoNothing();
  }

  // 3. Create Business Profile
  await db.insert(businessProfiles).values({
    organizationId: ORG_ID,
    description: "Premium wellness, medical spa, and esthetics studio providing advanced facial therapies, hydrafacials, dermaplaning, massage therapy, and clean beauty consulting.",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&h=400&fit=crop",
    socialLinks: {
      facebook: "https://facebook.com/glowandgrace",
      instagram: "https://instagram.com/glowandgrace",
      yelp: "https://yelp.com/biz/glow-and-grace-seattle"
    },
    googleBusinessUrl: "https://maps.google.com/?cid=123456",
    reviewUrl: "https://g.page/r/glow-and-grace-seattle/review"
  }).onConflictDoNothing();

  // 4. Create Business Settings
  await db.insert(businessSettings).values({
    organizationId: ORG_ID,
    businessHours: {
      monday: { open: "closed", close: "closed" },
      tuesday: { open: "09:00", close: "19:00" },
      wednesday: { open: "09:00", close: "19:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "08:00", close: "17:00" },
      sunday: { open: "10:00", close: "16:00" }
    },
    holidays: ["2026-11-26", "2026-12-25", "2026-01-01"],
    languages: ["en", "es"],
    bookingPreferences: {
      minNoticeHours: 2,
      maxAdvanceDays: 60,
      requireCardForHold: true,
      depositAmount: 25.00
    },
    notificationPreferences: {
      appointmentReminders: ["sms", "email"],
      reminderHoursBefore: 24,
      marketingConsentRequired: true
    },
    leadAssignmentRules: {
      routingMode: "round_robin",
      assignToActiveOnly: true
    },
    recommendationPreferences: {
      enableUpselling: true,
      autoSuggestAddons: true
    },
    qualityScoresHistory: [
      { date: "2026-06-01", score: 92 },
      { date: "2026-06-15", score: 94 },
      { date: "2026-07-01", score: 96 }
    ],
    crmSegments: [
      { name: "VIP VIPs", criteria: "visits > 10" },
      { name: "First-timers", criteria: "visits == 1" },
      { name: "Snoozed/Inactive", criteria: "months_since_last_visit >= 3" }
    ],
    websiteImportUrl: "https://www.glowandgraceesthetics.com",
    websiteImportStatus: "imported"
  }).onConflictDoNothing();

  console.log(`✅ Seeded Business Profile & Settings for Org: ${ORG_ID}`);
  return ORG_ID;
}
