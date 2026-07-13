"use server";

import { checkUserOrganization } from "./onboarding";
import { settingsRepository } from "../repositories/settings";
import { revalidatePath } from "next/cache";

export async function skipRecommendation(recommendationId: string) {
  const { org } = await checkUserOrganization();
  if (!org) throw new Error("Unauthorized");

  const settings = await settingsRepository.getByOrg(org.id);
  if (!settings) throw new Error("Settings not found");

  const currentPrefs = settings.recommendationPreferences as { dismissed?: string[], snoozed?: Record<string, string> } || {};
  const dismissed = Array.isArray(currentPrefs.dismissed) ? currentPrefs.dismissed : [];
  
  if (!dismissed.includes(recommendationId)) {
    dismissed.push(recommendationId);
  }

  await settingsRepository.update(org.id, {
    recommendationPreferences: {
      ...currentPrefs,
      dismissed
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/health");
}

export async function snoozeRecommendation(recommendationId: string, days: number) {
  const { org } = await checkUserOrganization();
  if (!org) throw new Error("Unauthorized");

  const settings = await settingsRepository.getByOrg(org.id);
  if (!settings) throw new Error("Settings not found");

  const currentPrefs = settings.recommendationPreferences as { dismissed?: string[], snoozed?: Record<string, string> } || {};
  const snoozed = typeof currentPrefs.snoozed === "object" ? { ...currentPrefs.snoozed } : {};
  
  const snoozeUntil = new Date();
  snoozeUntil.setDate(snoozeUntil.getDate() + days);

  snoozed[recommendationId] = snoozeUntil.toISOString();

  await settingsRepository.update(org.id, {
    recommendationPreferences: {
      ...currentPrefs,
      snoozed
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/health");
}
