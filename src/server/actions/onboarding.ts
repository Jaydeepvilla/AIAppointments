"use server";

import { auth } from "@clerk/nextjs/server";
import { organizationRepository } from "../repositories/organization";
import { membershipRepository } from "../repositories/membership";
import { subscriptionRepository } from "../repositories/subscription";
import { profileRepository } from "../repositories/profile";
import { servicesRepository } from "../repositories/services";
import { faqRepository } from "../repositories/faq";
import { flowsRepository } from "../repositories/flows";
import { settingsRepository } from "../repositories/settings";
import { syncClerkUser } from "./auth";
import { onboardingSchema, OnboardingInput } from "../../lib/validators";
import { Organization } from "../../lib/types";
import { INDUSTRY_TEMPLATES, DEFAULT_BUSINESS_HOURS } from "../../lib/constants/templates";
import { syncService } from "../services/sync";

export async function checkUserOrganization() {
  const { userId } = await auth();
  if (!userId) {
    return { hasOrg: false, org: null };
  }

  // Ensure user is synced
  await syncClerkUser();

  const userMemberships = await membershipRepository.getByUser(userId);
  if (userMemberships.length > 0) {
    const org = await organizationRepository.getById(userMemberships[0].organizationId);
    return { hasOrg: !!org, org };
  }

  return { hasOrg: false, org: null };
}

export async function createOrganizationAction(input: OnboardingInput): Promise<{ success: boolean; organization?: Organization; error?: string }> {
  try {
    // 1. Validate inputs
    const parsed = onboardingSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const { name, industry, website, email, phone, address, timezone } = parsed.data;

    // 2. Authenticate & Sync User
    const user = await syncClerkUser();
    if (!user) {
      return { success: false, error: "Unauthorized user" };
    }

    // Double check if user has organization to avoid duplicate onboarding
    const existingMemberships = await membershipRepository.getByUser(user.id);
    if (existingMemberships.length > 0) {
      const org = await organizationRepository.getById(existingMemberships[0].organizationId);
      if (org) {
        return { success: true, organization: org };
      }
    }

    // 3. Generate unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!baseSlug) {
      baseSlug = "business";
    }
    const slugSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${slugSuffix}`;

    // 4. Create Organization
    const organization = await organizationRepository.create({
      name,
      slug,
      industry,
      website: website || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      timezone,
    });

    // 5. Create Membership with role 'owner'
    await membershipRepository.create({
      organizationId: organization.id,
      userId: user.id,
      role: "owner",
    });

    // 6. Ensure default Trial Subscription Plan and Subscription exist
    const defaultPlanId = "trial";
    let plan = await subscriptionRepository.getPlanById(defaultPlanId);
    if (!plan) {
      // Create seed plan
      plan = await subscriptionRepository.createPlan({
        id: defaultPlanId,
        name: "Nexx Trial",
        description: "14-day trial of Operatorfeatures",
        price: "0",
        interval: "month",
        features: ["AI Voice Receptionist", "SMS/Web Chatbot", "Dental & Salon Templates", "100 monthly minutes"],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Start 14-day trial subscription
    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setDate(periodEnd.getDate() + 14);

    await subscriptionRepository.create({
      organizationId: organization.id,
      planId: plan.id,
      status: "trialing",
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: false,
    });

    // 7. Seed Industry Template Defaults
    const template = INDUSTRY_TEMPLATES[industry];
    if (template) {
      // Seed Profile
      await profileRepository.create({
        organizationId: organization.id,
        description: template.description,
        socialLinks: {},
      });

      // Seed Settings
      await settingsRepository.create({
        organizationId: organization.id,
        businessHours: template.businessHours,
        holidays: [],
        languages: ["en"],
        bookingPreferences: { slotIntervalMinutes: 30, bufferMinutes: 10, autoApprove: false },
        notificationPreferences: { channels: ["email"] },
        leadAssignmentRules: { type: "round_robin" },
      });

      // Seed Services
      for (const service of template.services) {
        let cat = await servicesRepository.getCategoryByName(organization.id, service.category);
        if (!cat) {
          cat = await servicesRepository.createCategory({
            organizationId: organization.id,
            name: service.category,
          });
        }
        await servicesRepository.create({
          organizationId: organization.id,
          categoryId: cat.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          isActive: true,
        });
      }

      // Seed FAQs
      for (const faq of template.faqs) {
        await faqRepository.create({
          organizationId: organization.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          isActive: true,
        });
      }

      // Seed Qualification Flow
      for (const q of template.qualificationQuestions) {
        await flowsRepository.create({
          organizationId: organization.id,
          question: q.question,
          answerType: q.answerType,
          options: q.options || [],
          isRequired: q.isRequired,
        });
      }
    } else {
      // Seed generic profile and settings
      await profileRepository.create({
        organizationId: organization.id,
        description: "Standard business profile",
      });
      await settingsRepository.create({
        organizationId: organization.id,
        businessHours: DEFAULT_BUSINESS_HOURS,
        holidays: [],
        languages: ["en"],
        bookingPreferences: { slotIntervalMinutes: 30, bufferMinutes: 10, autoApprove: false },
        notificationPreferences: { channels: ["email"] },
        leadAssignmentRules: { type: "round_robin" },
      });
    }

    // 8. Sync Seeded Configurations to Knowledge Center
    try {
      const seededProfile = await profileRepository.getByOrg(organization.id);
      if (seededProfile) {
        await syncService.syncBusinessProfile(
          organization.id,
          organization.name,
          seededProfile.description || "",
          organization.email,
          organization.phone,
          organization.website,
          organization.address
        );
      }

      const seededServices = await servicesRepository.list(organization.id);
      for (const s of seededServices) {
        await syncService.syncServiceItem(
          organization.id,
          s.id,
          s.name,
          s.description || "",
          s.duration,
          s.price,
          s.isActive
        );
      }

      const seededFaqs = await faqRepository.list(organization.id);
      for (const f of seededFaqs) {
        await syncService.syncFAQ(
          organization.id,
          f.id,
          f.question,
          f.answer,
          f.isActive
        );
      }

      const seededFlows = await flowsRepository.list(organization.id);
      if (seededFlows.length > 0) {
        await syncService.syncQualificationFlows(organization.id, seededFlows);
      }
    } catch (syncErr) {
      console.error("Failed to run initial sync of seeded template configurations:", syncErr);
    }

    return { success: true, organization };
  } catch (error: any) {
    console.error("Failed to create organization during onboarding:", error);
    return { success: false, error: error?.message || "An unexpected error occurred." };
  }
}
