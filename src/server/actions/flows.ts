"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { flowsRepository } from "../repositories/flows";
import { membershipRepository } from "../repositories/membership";
import { syncService } from "../services/sync";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getFlowQuestionsAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const list = await flowsRepository.list(orgId);
    return { success: true, questions: list };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load qualification flow" };
  }
}

export async function createFlowQuestionAction(data: {
  question: string;
  answerType: "text" | "single_select" | "multi_select" | "number";
  options?: string[];
  isRequired: boolean;
}) {
  try {
    const orgId = await getVerifiedOrgId();
    const current = await flowsRepository.list(orgId);

    await flowsRepository.create({
      organizationId: orgId,
      question: data.question,
      answerType: data.answerType,
      options: data.options || [],
      isRequired: data.isRequired,
      order: current.length,
    });

    const updatedList = await flowsRepository.list(orgId);
    await syncService.syncQualificationFlows(orgId, updatedList);

    revalidatePath("/flows");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create question" };
  }
}

export async function updateFlowQuestionAction(
  id: string,
  data: {
    question: string;
    answerType: "text" | "single_select" | "multi_select" | "number";
    options?: string[];
    isRequired: boolean;
  }
) {
  try {
    const orgId = await getVerifiedOrgId();
    await flowsRepository.update(id, orgId, {
      question: data.question,
      answerType: data.answerType,
      options: data.options || [],
      isRequired: data.isRequired,
    });

    const updatedList = await flowsRepository.list(orgId);
    await syncService.syncQualificationFlows(orgId, updatedList);

    revalidatePath("/flows");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update question" };
  }
}

export async function deleteFlowQuestionAction(id: string) {
  try {
    const orgId = await getVerifiedOrgId();
    await flowsRepository.delete(id, orgId);

    // Reorder remaining questions to fill gaps
    const remaining = await flowsRepository.list(orgId);
    for (let i = 0; i < remaining.length; i++) {
      await flowsRepository.update(remaining[i].id, orgId, { order: i });
    }

    const updatedList = await flowsRepository.list(orgId);
    await syncService.syncQualificationFlows(orgId, updatedList);

    revalidatePath("/flows");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete question" };
  }
}

export async function updateFlowQuestionsOrderAction(questionsList: { id: string; order: number }[]) {
  try {
    const orgId = await getVerifiedOrgId();
    for (const q of questionsList) {
      await flowsRepository.update(q.id, orgId, { order: q.order });
    }
    const updatedList = await flowsRepository.list(orgId);
    await syncService.syncQualificationFlows(orgId, updatedList);
    revalidatePath("/flows");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update question order" };
  }
}
