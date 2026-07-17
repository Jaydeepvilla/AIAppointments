"use server";

import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { widgetDomains } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { membershipRepository } from "../repositories/membership";
import { widgetRepository } from "../repositories/widget";
import { widgetService } from "../services/widget-service";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getWidgetSettingsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    
    const [config, theme, branding, launcher, customization, domains, installations, analytics] = await Promise.all([
      widgetRepository.getConfigs(orgId),
      widgetRepository.getTheme(orgId),
      widgetRepository.getBranding(orgId),
      widgetRepository.getLauncher(orgId),
      widgetRepository.getCustomization(orgId),
      widgetRepository.listDomains(orgId),
      widgetRepository.listInstallations(orgId),
      widgetRepository.getAnalytics(orgId)
    ]);

    return {
      success: true,
      data: {
        config,
        theme,
        branding,
        launcher,
        customization,
        domains,
        installations,
        analytics
      }
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load widget configurations" };
  }
}

export async function saveWidgetSettingsAction(data: {
  enabled?: boolean;
  theme?: any;
  branding?: any;
  launcher?: any;
  customization?: any;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    if (data.enabled !== undefined) {
      await widgetRepository.updateConfigs(orgId, data.enabled);
    }
    if (data.theme) {
      await widgetRepository.updateTheme(orgId, data.theme);
    }
    if (data.branding) {
      await widgetRepository.updateBranding(orgId, data.branding);
    }
    if (data.launcher) {
      await widgetRepository.updateLauncher(orgId, data.launcher);
    }
    if (data.customization) {
      await widgetRepository.updateCustomization(orgId, data.customization);
    }

    revalidatePath("/widget");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save widget settings" };
  }
}

export async function addDomainAction(domainName: string) {
  try {
    const orgId = await getVerifiedOrgId();
    
    if (!domainName || !domainName.trim()) {
      throw new Error("Domain name cannot be empty");
    }

    // Clean domain format
    const cleaned = domainName
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .trim();

    const verificationToken = "nexx-verification-" + Math.random().toString(36).substring(2, 10);

    const domain = await widgetRepository.createDomain({
      organizationId: orgId,
      domain: cleaned,
      verificationToken
    });

    revalidatePath("/widget");
    return { success: true, domain };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to add domain" };
  }
}

export async function deleteDomainAction(domainId: string) {
  try {
    const orgId = await getVerifiedOrgId();
    await widgetRepository.deleteDomain(orgId, domainId);
    revalidatePath("/widget");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete domain" };
  }
}

export async function verifyDomainAction(domainId: string) {
  try {
    const orgId = await getVerifiedOrgId();
    
    // Perform ownership verification check
    const result = await widgetService.verifyDomainOwnership(orgId, domainId);
    
    revalidatePath("/widget");
    return { success: true, verified: result.success, message: result.message };
  } catch (error: any) {
    return { success: false, error: error?.message || "Verification check failed" };
  }
}

export async function resetThemeToBrandAction() {
  try {
    const orgId = await getVerifiedOrgId();
    
    const brandTheme = {
      themeMode: "light",
      primaryColor: "#7a5af8",
      backgroundColor: "#ffffff",
      textColor: "#18181b",
      borderColor: "#e4e4e7",
      borderRadius: "0.75rem"
    };
    
    await widgetRepository.updateTheme(orgId, brandTheme);
    
    revalidatePath("/widget");
    return { success: true, theme: brandTheme };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to reset theme" };
  }
}
