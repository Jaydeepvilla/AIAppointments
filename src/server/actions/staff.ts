"use server";

import { auth } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { staffMembers, serviceAssignments, staffSchedules, staffAvailability } from "../db/schema";
import { membershipRepository } from "../repositories/membership";
import { staffRepository } from "../repositories/staff";

async function getVerifiedOrgId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const memberships = await membershipRepository.getByUser(userId);
  if (memberships.length === 0) throw new Error("No organization found");
  return memberships[0].organizationId;
}

export async function getStaffListAction() {
  try {
    const orgId = await getVerifiedOrgId();
    const list = await staffRepository.list(orgId);
    
    // Enrich with schedules & assignments summary
    const enrichedList = await Promise.all(
      list.map(async (staff) => {
        const schedules = await staffRepository.getSchedules(staff.id);
        const assignments = await staffRepository.listAssignments(staff.id);
        return {
          ...staff,
          schedules,
          assignments,
        };
      })
    );

    return { success: true, staff: enrichedList };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load staff list" };
  }
}

export async function getStaffDetailsAction(staffId: string) {
  try {
    const orgId = await getVerifiedOrgId();
    
    const [staff] = await db
      .select()
      .from(staffMembers)
      .where(and(eq(staffMembers.id, staffId), eq(staffMembers.organizationId, orgId)));
      
    if (!staff) throw new Error("Staff member not found");

    const schedules = await staffRepository.getSchedules(staffId);
    const exceptions = await staffRepository.getAvailabilityExceptions(staffId);
    const assignments = await staffRepository.listAssignments(staffId);

    return {
      success: true,
      staff,
      schedules,
      exceptions,
      assignments,
    };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to load staff details" };
  }
}

export async function createStaffAction(data: {
  name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
  bufferTime?: number;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    const staff = await staffRepository.create({
      organizationId: orgId,
      name: data.name,
      role: data.role,
      email: data.email,
      phone: data.phone,
      bufferTime: data.bufferTime ?? 0,
      isActive: true,
    });

    // Seed empty default schedules (Monday-Friday 9am-5pm)
    for (let day = 1; day <= 5; day++) {
      await staffRepository.saveSchedule({
        organizationId: orgId,
        staffMemberId: staff.id,
        dayOfWeek: day,
        shifts: [{ start: "09:00", end: "17:00" }],
      });
    }

    revalidatePath("/staff");
    return { success: true, staff };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to create staff member" };
  }
}

export async function updateStaffAction(
  id: string,
  updates: {
    name: string;
    role: string;
    email?: string | null;
    phone?: string | null;
    bufferTime?: number;
    isActive?: boolean;
  }
) {
  try {
    const orgId = await getVerifiedOrgId();

    const [existing] = await db
      .select()
      .from(staffMembers)
      .where(and(eq(staffMembers.id, id), eq(staffMembers.organizationId, orgId)));
    if (!existing) throw new Error("Staff member not found");

    const updated = await staffRepository.update(id, updates);

    revalidatePath("/staff");
    return { success: true, staff: updated };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update staff member" };
  }
}

export async function deleteStaffAction(id: string) {
  try {
    const orgId = await getVerifiedOrgId();

    const [existing] = await db
      .select()
      .from(staffMembers)
      .where(and(eq(staffMembers.id, id), eq(staffMembers.organizationId, orgId)));
    if (!existing) throw new Error("Staff member not found");

    await staffRepository.delete(id);

    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete staff member" };
  }
}

export async function saveStaffScheduleAction(
  staffId: string,
  schedule: { dayOfWeek: number; shifts: Array<{ start: string; end: string }> }
) {
  try {
    const orgId = await getVerifiedOrgId();

    const [staff] = await db
      .select()
      .from(staffMembers)
      .where(and(eq(staffMembers.id, staffId), eq(staffMembers.organizationId, orgId)));
    if (!staff) throw new Error("Staff member not found");

    await staffRepository.saveSchedule({
      organizationId: orgId,
      staffMemberId: staffId,
      dayOfWeek: schedule.dayOfWeek,
      shifts: schedule.shifts,
    });

    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save schedule" };
  }
}

export async function saveAvailabilityExceptionAction(data: {
  staffMemberId: string;
  exceptionDate: string;
  isAvailable: boolean;
  shifts?: Array<{ start: string; end: string }> | null;
  reason?: string | null;
}) {
  try {
    const orgId = await getVerifiedOrgId();

    const [staff] = await db
      .select()
      .from(staffMembers)
      .where(and(eq(staffMembers.id, data.staffMemberId), eq(staffMembers.organizationId, orgId)));
    if (!staff) throw new Error("Staff member not found");

    await staffRepository.saveAvailabilityException({
      organizationId: orgId,
      staffMemberId: data.staffMemberId,
      exceptionDate: data.exceptionDate,
      isAvailable: data.isAvailable,
      shifts: data.shifts,
      reason: data.reason,
    });

    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to save holiday override exception" };
  }
}

export async function deleteAvailabilityExceptionAction(id: string) {
  try {
    const orgId = await getVerifiedOrgId();

    const [existing] = await db
      .select()
      .from(staffAvailability)
      .where(and(eq(staffAvailability.id, id), eq(staffAvailability.organizationId, orgId)));
    if (!existing) throw new Error("Holiday exception override not found");

    await staffRepository.deleteAvailabilityException(id);

    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to delete exception override" };
  }
}

export async function updateStaffAssignmentsAction(staffId: string, serviceIds: string[]) {
  try {
    const orgId = await getVerifiedOrgId();

    const [staff] = await db
      .select()
      .from(staffMembers)
      .where(and(eq(staffMembers.id, staffId), eq(staffMembers.organizationId, orgId)));
    if (!staff) throw new Error("Staff member not found");

    // Clean existing service assignments
    await db
      .delete(serviceAssignments)
      .where(eq(serviceAssignments.staffMemberId, staffId));

    // Create new ones
    for (const serviceId of serviceIds) {
      await staffRepository.assignService(orgId, staffId, serviceId);
    }

    revalidatePath("/staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update assignments" };
  }
}
