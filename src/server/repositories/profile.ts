import { eq } from "drizzle-orm";
import { db } from "../db";
import { businessProfiles } from "../db/schema";

export interface NewProfile {
  organizationId: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  socialLinks?: Record<string, string> | null;
  googleBusinessUrl?: string | null;
  reviewUrl?: string | null;
}

export const profileRepository = {
  async getByOrg(organizationId: string) {
    const [profile] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.organizationId, organizationId));
    return profile || null;
  },

  async create(profile: NewProfile) {
    const [newProfile] = await db.insert(businessProfiles).values(profile).returning();
    return newProfile;
  },

  async update(organizationId: string, profile: Partial<NewProfile>) {
    const [updated] = await db
      .update(businessProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(businessProfiles.organizationId, organizationId))
      .returning();
    return updated;
  },
};
