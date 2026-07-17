"use server";

import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { organizationRepository } from "../repositories/organization";
import { profileRepository } from "../repositories/profile";
import { membershipRepository } from "../repositories/membership";
import { syncService } from "../services/sync";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getBusinessProfileAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const org = await organizationRepository.getById(orgId);
    if (!org) throw new Error("Organization not found");
    const profile = await profileRepository.getByOrg(orgId);

    return {
      success: true,
      data: {
        organization: org,
        profile: profile || null,
      },
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load profile" };
  }
}

export async function updateBusinessProfileAction(data: {
  name: string;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  timezone: string;
  description?: string | null;
  googleBusinessUrl?: string | null;
  reviewUrl?: string | null;
  socialLinks?: Record<string, string> | null;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    // 1. Update Organization Table Fields
    await organizationRepository.update(orgId, {
      name: data.name,
      website: data.website,
      email: data.email,
      phone: data.phone,
      address: data.address,
      timezone: data.timezone,
    });

    // 2. Update/Create Business Profile Table Fields
    const existing = await profileRepository.getByOrg(orgId);
    if (!existing) {
      await profileRepository.create({
        organizationId: orgId,
        description: data.description,
        googleBusinessUrl: data.googleBusinessUrl,
        reviewUrl: data.reviewUrl,
        socialLinks: data.socialLinks,
      });
    } else {
      await profileRepository.update(orgId, {
        description: data.description,
        googleBusinessUrl: data.googleBusinessUrl,
        reviewUrl: data.reviewUrl,
        socialLinks: data.socialLinks,
      });
    }

    // 3. Sync profile update to Knowledge Center
    const org = await organizationRepository.getById(orgId);
    if (org) {
      await syncService.syncBusinessProfile(
        orgId,
        org.name,
        data.description || "",
        org.email,
        org.phone,
        org.website,
        org.address
      );
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update profile" };
  }
}
