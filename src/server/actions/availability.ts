"use server";

import { auth } from "@clerk/nextjs/server";
import { membershipRepository } from "../repositories/membership";
import { availabilityService } from "../services/availability";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getAvailableSlotsAction(data: {
  serviceId: string;
  dateStr: string; // YYYY-MM-DD
  staffMemberId?: string;
}) {
  try {
    const orgId = await getVerifiedOrgId();
    
    if (!data.serviceId || !data.dateStr) {
      throw new Error("Service ID and target date are required.");
    }

    const slots = await availabilityService.getAvailableSlots(
      orgId,
      data.serviceId,
      data.dateStr,
      data.staffMemberId
    );

    return {
      success: true,
      slots,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to calculate slot openings",
    };
  }
}
