import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { services, businessSettings } from "../db/schema";
import { staffRepository } from "../repositories/staff";
import { appointmentsRepository } from "../repositories/appointments";
import { calendarRepository } from "../repositories/calendar";
import { rulesRepository } from "../repositories/rules";
import { providerRegistry } from "./calendar-provider";

export interface TimeSlot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  staffId: string;
  staffName: string;
}

export const availabilityService = {
  async getAvailableSlots(
    organizationId: string,
    serviceId: string,
    dateStr: string, // YYYY-MM-DD
    staffMemberId?: string
  ): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = [];

    // 1. Fetch Service details
    const [service] = await db
      .select()
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.organizationId, organizationId)));
    if (!service || !service.isActive) return [];

    const duration = service.duration; // in minutes

    // 2. Fetch Booking Rules (min lead time, buffers)
    const rules = await rulesRepository.getByOrganization(organizationId);
    const minLeadTime = rules?.minLeadTime ?? 2; // hours
    const bufferBefore = rules?.defaultBufferBefore ?? 0;
    const bufferAfter = rules?.defaultBufferAfter ?? 0;

    // 3. Resolve eligible staff members
    let eligibleStaff: any[] = [];
    if (staffMemberId) {
      const staff = await staffRepository.findById(staffMemberId);
      if (staff && staff.isActive) eligibleStaff = [staff];
    } else {
      const assignments = await staffRepository.listStaffForService(serviceId);
      eligibleStaff = assignments.map((a) => a.staffMember);
    }

    if (eligibleStaff.length === 0) return [];

    // Parse target date context
    const [year, month, day] = dateStr.split("-").map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeek = targetDate.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Check rules: min lead time
    const now = new Date();
    const minAllowedTime = new Date(now.getTime() + minLeadTime * 60 * 60 * 1000);

    // Fetch existing appointments for the day
    const dayStart = new Date(year, month - 1, day, 0, 0, 0);
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59);
    const dayAppointments = await appointmentsRepository.list(organizationId, {
      startDate: dayStart,
      endDate: dayEnd,
    });

    for (const staff of eligibleStaff) {
      // 4. Resolve shifts for the target date
      let shifts: Array<{ start: string; end: string }> = [];

      // Check availability overrides exceptions
      const exceptions = await staffRepository.getAvailabilityExceptions(staff.id);
      const dayException = exceptions.find((e) => e.exceptionDate === dateStr);

      if (dayException) {
        if (!dayException.isAvailable) {
          // Closed/Holiday on exception
          continue;
        }
        shifts = (dayException.shifts as Array<{ start: string; end: string }>) || [];
      } else {
        // Fallback to weekly schedule shifts
        const schedules = await staffRepository.getSchedules(staff.id);
        const daySchedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);
        if (daySchedule) {
          shifts = (daySchedule.shifts as Array<{ start: string; end: string }>) || [];
        }
      }

      if (shifts.length === 0) continue;

      // 5. Gather busy blocks from external calendars (OAuth integration)
      const connections = await calendarRepository.listConnections(organizationId);
      const staffConn = connections.find((c) => c.staffMemberId === staff.id && c.syncStatus === "active");
      
      let externalBusyPeriods: Array<{ start: Date; end: Date }> = [];
      if (staffConn) {
        try {
          const provider = providerRegistry.getProvider(staffConn.provider);
          externalBusyPeriods = await provider.getBusyPeriods(
            staffConn.accessToken,
            staffConn.refreshToken,
            staffConn.expiresAt,
            staffConn.externalCalendarId,
            dayStart,
            dayEnd
          );
        } catch (err) {
          console.error(`[AvailabilityService] Failed fetching calendar connections availability for staff: ${staff.id}`, err);
        }
      }

      // Filter appointments belonging to this staff member
      const staffAppointments = dayAppointments.filter(
        (a) => a.appointment.staffMemberId === staff.id && 
               a.appointment.status !== "cancelled" && 
               a.appointment.status !== "no_show"
      );

      // 6. Generate slots inside shifts
      for (const shift of shifts) {
        const [shiftStartH, shiftStartM] = shift.start.split(":").map(Number);
        const [shiftEndH, shiftEndM] = shift.end.split(":").map(Number);

        const shiftStartMin = shiftStartH * 60 + shiftStartM;
        const shiftEndMin = shiftEndH * 60 + shiftEndM;

        // Loop in 15 minute slot increments
        for (let timeMin = shiftStartMin; timeMin + duration <= shiftEndMin; timeMin += 15) {
          const slotStartH = Math.floor(timeMin / 60);
          const slotStartM = timeMin % 60;
          const slotEndH = Math.floor((timeMin + duration) / 60);
          const slotEndM = (timeMin + duration) % 60;

          const startTimeStr = `${slotStartH.toString().padStart(2, "0")}:${slotStartM.toString().padStart(2, "0")}`;
          const endTimeStr = `${slotEndH.toString().padStart(2, "0")}:${slotEndM.toString().padStart(2, "0")}`;

          const slotStart = new Date(year, month - 1, day, slotStartH, slotStartM, 0);
          const slotEnd = new Date(year, month - 1, day, slotEndH, slotEndM, 0);

          // Check lead time rules
          if (slotStart < minAllowedTime) continue;

          // 7. Conflict detection logic
          let hasConflict = false;

          // Check DB appointments overlap + buffer blocks
          for (const apt of staffAppointments) {
            const aptStart = new Date(apt.appointment.startTime);
            const aptEnd = new Date(apt.appointment.endTime);

            // Overlap boundary checks:
            // candidateStart - bufferAfter < aptEnd AND candidateEnd + bufferBefore > aptStart
            const totalBufferBefore = bufferBefore * 60 * 1000;
            const totalBufferAfter = bufferAfter * 60 * 1000;

            const blockStart = new Date(slotStart.getTime() - totalBufferBefore);
            const blockEnd = new Date(slotEnd.getTime() + totalBufferAfter);

            if (blockStart < aptEnd && blockEnd > aptStart) {
              hasConflict = true;
              break;
            }
          }

          if (hasConflict) continue;

          // Check connected third-party calendar busy periods
          for (const busy of externalBusyPeriods) {
            if (slotStart < busy.end && slotEnd > busy.start) {
              hasConflict = true;
              break;
            }
          }

          if (hasConflict) continue;

          // Safe, conflict-free slot found!
          slots.push({
            startTime: startTimeStr,
            endTime: endTimeStr,
            staffId: staff.id,
            staffName: staff.name,
          });
        }
      }
    }

    return slots;
  },
};
