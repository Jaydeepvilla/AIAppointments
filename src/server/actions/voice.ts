"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { voiceRepository } from "../repositories/voice";
import { membershipRepository } from "../repositories/membership";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

// --- Phone Numbers ---
export async function getPhoneNumbersAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const numbers = await voiceRepository.getPhoneNumbers(orgId);
    return { success: true, numbers };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load phone numbers" };
  }
}

export async function purchasePhoneNumberAction(data: { name: string; phoneNumber: string }) {
  try {
    const orgId = await getVerifiedOrgId();
    const number = await voiceRepository.registerPhoneNumber(orgId, {
      phoneNumber: data.phoneNumber,
      name: data.name,
      type: "purchased",
    });
    revalidatePath("/voice");
    return { success: true, number };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to purchase phone number" };
  }
}

export async function toggleRecordingAction(phoneNumberId: string, isEnabled: boolean) {
  try {
    await voiceRepository.updatePhoneNumberRecording(phoneNumberId, isEnabled);
    revalidatePath("/voice");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update recording preferences" };
  }
}

// --- Call Sessions ---
export async function getCallSessionsAction(limit = 50, offset = 0) {
  try {
    const orgId = await getVerifiedOrgId();
    const sessions = await voiceRepository.getCallSessions(orgId, limit, offset);
    return { success: true, sessions };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load call sessions" };
  }
}

export async function getCallSessionDetailsAction(sessionId: string) {
  try {
    const session = await voiceRepository.getCallSessionDetails(sessionId);
    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load call session details" };
  }
}

// --- Voicemails ---
export async function getVoicemailMessagesAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const voicemails = await voiceRepository.getVoicemails(orgId);
    return { success: true, voicemails };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load voicemail messages" };
  }
}

export async function updateVoicemailStatusAction(voicemailId: string, status: "pending" | "called" | "no-action") {
  try {
    await voiceRepository.updateVoicemailStatus(voicemailId, status);
    revalidatePath("/voice/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update voicemail callback status" };
  }
}

// --- Voice Settings ---
export async function getVoiceSettingsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    let settings = await voiceRepository.getVoiceSettings(orgId);
    if (!settings) {
      settings = await voiceRepository.upsertVoiceSettings(orgId, {
        voiceName: "Rachel",
        speakingSpeed: "1.0",
        greetingMessage: "Hello! Thank you for calling. How can I help you today?",
        businessHoursMode: "ai-only",
        voicemailActive: true,
      });
    }
    return { success: true, settings };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load voice settings" };
  }
}

export async function saveVoiceSettingsAction(data: {
  voiceName: string;
  speakingSpeed: string;
  greetingMessage: string;
  fallbackNumber?: string | null;
  businessHoursMode: "ai-only" | "forward" | "hybrid";
  voicemailActive: boolean;
}) {
  try {
    const orgId = await getVerifiedOrgId();
    await voiceRepository.upsertVoiceSettings(orgId, data);
    revalidatePath("/voice/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save voice settings" };
  }
}

// --- Call Routing Rules ---
export async function getRoutingRulesAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const rules = await voiceRepository.getRoutingRules(orgId);
    return { success: true, rules };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load call routing rules" };
  }
}

export async function createRoutingRuleAction(data: {
  ruleName: string;
  triggerType: "business-hours" | "after-hours" | "busy" | "no-answer";
  routingAction: "ai-receptionist" | "staff-dial" | "voicemail" | "queue";
  targetId?: string;
  priority?: number;
  isActive?: boolean;
}) {
  try {
    const orgId = await getVerifiedOrgId();
    const rule = await voiceRepository.createRoutingRule(orgId, data);
    revalidatePath("/voice/settings");
    return { success: true, rule };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create routing rule" };
  }
}

export async function updateRoutingRuleAction(ruleId: string, data: {
  ruleName?: string;
  triggerType?: "business-hours" | "after-hours" | "busy" | "no-answer";
  routingAction?: "ai-receptionist" | "staff-dial" | "voicemail" | "queue";
  targetId?: string;
  priority?: number;
  isActive?: boolean;
}) {
  try {
    await voiceRepository.updateRoutingRule(ruleId, data);
    revalidatePath("/voice/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update routing rule" };
  }
}

export async function deleteRoutingRuleAction(ruleId: string) {
  try {
    await voiceRepository.deleteRoutingRule(ruleId);
    revalidatePath("/voice/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete routing rule" };
  }
}

// --- Analytics ---
export async function getVoiceAnalyticsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const analytics = await voiceRepository.getAnalytics(orgId);
    return { success: true, analytics };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load voice analytics" };
  }
}
