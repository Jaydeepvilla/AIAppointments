"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { settingsRepository } from "../repositories/settings";
import { membershipRepository } from "../repositories/membership";
import { DEFAULT_BUSINESS_HOURS } from "@/lib/constants/templates";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getBusinessSettingsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    let settings = await settingsRepository.getByOrg(orgId);
    if (!settings) {
      // Seed default empty settings
      settings = await settingsRepository.create({
        organizationId: orgId,
        businessHours: DEFAULT_BUSINESS_HOURS,
        holidays: [],
        languages: ["en"],
        bookingPreferences: { slotIntervalMinutes: 30, bufferMinutes: 10, autoApprove: false },
        notificationPreferences: { channels: ["email"], emailAddresses: [] },
        leadAssignmentRules: { type: "round_robin" },
      });
    }

    return { success: true, settings };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load business settings" };
  }
}

export async function saveBusinessHoursAction(
  businessHours: Record<string, { open: string; close: string; closed: boolean }>,
  holidays: string[]
) {
  try {
    const orgId = await getVerifiedOrgId();
    await settingsRepository.update(orgId, { businessHours, holidays });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save business hours" };
  }
}

export async function saveGeneralSettingsAction(data: {
  languages: string[];
  bookingPreferences: Record<string, any>;
  notificationPreferences: Record<string, any>;
  leadAssignmentRules: Record<string, any>;
}) {
  try {
    const orgId = await getVerifiedOrgId();
    await settingsRepository.update(orgId, data);
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save settings" };
  }
}

export async function triggerWebsiteImportAction(url: string) {
  try {
    const orgId = await getVerifiedOrgId();

    // Store URL and set status to importing/imported as a placeholder
    await settingsRepository.update(orgId, {
      websiteImportUrl: url,
      websiteImportStatus: "imported", // Simulated import status success
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to import website" };
  }
}
