"use server";

import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { faqRepository } from "../repositories/faq";
import { membershipRepository } from "../repositories/membership";
import { syncService } from "../services/sync";
import { db } from "../db";
import { faqItems } from "../db/schema";
import { eq, and, inArray } from "drizzle-orm";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

/**
 * Verifies that a FAQ item with the given `id` belongs to the caller's org.
 * Throws an error if ownership cannot be confirmed (IDOR protection).
 */
async function assertFaqOwnership(orgId: string, faqId: string) {
  const [faq] = await db
    .select({ id: faqItems.id, organizationId: faqItems.organizationId })
    .from(faqItems)
    .where(and(eq(faqItems.id, faqId), eq(faqItems.organizationId, orgId)))
    .limit(1);

  if (!faq) {
    throw new Error("FAQ not found or access denied");
  }
  return faq;
}

export async function getFaqsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const faqs = await faqRepository.list(orgId);
    return { success: true, faqs };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load FAQs" };
  }
}

export async function createFaqAction(data: {
  question: string;
  answer: string;
  category: string;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    // Sanitise input lengths
    if (!data.question?.trim() || data.question.length > 1000) {
      throw new Error("Question is required and must be under 1000 characters");
    }
    if (!data.answer?.trim() || data.answer.length > 5000) {
      throw new Error("Answer is required and must be under 5000 characters");
    }

    const faq = await faqRepository.create({
      organizationId: orgId,
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: data.category?.trim() || "General",
      isActive: true,
    });

    await syncService.syncFAQ(orgId, faq.id, faq.question, faq.answer, faq.isActive);

    revalidatePath("/faqs");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create FAQ" };
  }
}

export async function updateFaqAction(
  id: string,
  data: {
    question: string;
    answer: string;
    category: string;
    isActive: boolean;
  }
) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard: confirm this FAQ belongs to the caller's org
    await assertFaqOwnership(orgId, id);

    if (!data.question?.trim() || data.question.length > 1000) {
      throw new Error("Question is required and must be under 1000 characters");
    }
    if (!data.answer?.trim() || data.answer.length > 5000) {
      throw new Error("Answer is required and must be under 5000 characters");
    }

    const updated = await faqRepository.update(id, {
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: data.category?.trim() || "General",
      isActive: data.isActive,
    });

    if (updated) {
      await syncService.syncFAQ(orgId, updated.id, updated.question, updated.answer, updated.isActive);
    }
    revalidatePath("/faqs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update FAQ" };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    const orgId = await getVerifiedOrgId();
    // IDOR guard
    const faq = await assertFaqOwnership(orgId, id);
    await faqRepository.delete(id);
    await syncService.syncFAQ(orgId, faq.id, "", "", false, true);
    revalidatePath("/faqs");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete FAQ" };
  }
}

export async function bulkDeleteFaqsAction(ids: string[]) {
  try {
    const orgId = await getVerifiedOrgId();
    // Bulk-IDOR: only delete IDs that actually belong to this org
    const faqs = await db
      .select()
      .from(faqItems)
      .where(and(eq(faqItems.organizationId, orgId), inArray(faqItems.id, ids)));

    const safeIds = faqs.map((f) => f.id);
    if (safeIds.length === 0) return { success: true }; // Nothing owned to delete

    await faqRepository.deleteMany(safeIds, orgId);

    for (const faq of faqs) {
      await syncService.syncFAQ(orgId, faq.id, faq.question, faq.answer, faq.isActive, true);
    }

    revalidatePath("/faqs");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to bulk delete FAQs" };
  }
}

export async function bulkToggleActiveFaqsAction(ids: string[], isActive: boolean) {
  try {
    const orgId = await getVerifiedOrgId();
    // Only toggle IDs owned by this org
    await faqRepository.updateActiveMany(ids, orgId, isActive);

    const faqs = await db
      .select()
      .from(faqItems)
      .where(and(eq(faqItems.organizationId, orgId), inArray(faqItems.id, ids)));

    for (const faq of faqs) {
      await syncService.syncFAQ(orgId, faq.id, faq.question, faq.answer, faq.isActive);
    }

    revalidatePath("/faqs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to bulk toggle FAQ status" };
  }
}
