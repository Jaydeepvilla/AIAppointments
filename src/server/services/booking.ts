import { appointmentsRepository } from "../repositories/appointments";
import { remindersRepository } from "../repositories/reminders";
import { calendarRepository } from "../repositories/calendar";
import { rulesRepository } from "../repositories/rules";
import { staffRepository } from "../repositories/staff";
import { providerRegistry } from "./calendar-provider";
import { availabilityService } from "./availability";
import { db } from "../db";
import { services, appointmentEvents, organizations } from "../db/schema";
import { eq, and } from "drizzle-orm";

export interface CreateBookingInput {
  organizationId: string;
  leadProfileId?: string | null;
  serviceId: string;
  staffMemberId: string;
  startTime: Date;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
}

export const bookingService = {
  async createAppointment(input: CreateBookingInput) {
    const { organizationId, serviceId, staffMemberId, startTime } = input;

    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, organizationId));
    if (!org) throw new Error("Organization not found");
    const timezone = org.timezone || "UTC";

    // 1. Fetch Service duration
    const [service] = await db
      .select()
      .from(services)
      .where(and(eq(services.id, serviceId), eq(services.organizationId, organizationId)));
    if (!service) throw new Error("Service not found");

    const endTime = new Date(startTime.getTime() + service.duration * 60 * 1000);

    // 2. Validate availability (Conflict check)
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(startTime);
    const p = parts.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {} as Record<string, string>);

    const dateStr = `${p.year}-${p.month}-${p.day}`;
    let hour = p.hour;
    if (hour === "24") hour = "00";
    const slotTimeStr = `${hour}:${p.minute}`;

    const availableSlots = await availabilityService.getAvailableSlots(
      organizationId,
      serviceId,
      dateStr,
      staffMemberId
    );
    const isSlotAvailable = availableSlots.some(
      (s) => s.startTime === slotTimeStr && s.staffId === staffMemberId
    );

    if (!isSlotAvailable) {
      throw new Error(`Requested time slot ${slotTimeStr} is no longer available for booking.`);
    }

    // 3. Insert Appointment in DB
    const appointment = await appointmentsRepository.create({
      organizationId,
      leadProfileId: input.leadProfileId,
      serviceId,
      staffMemberId,
      status: "confirmed",
      startTime,
      endTime,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
    });

    // 4. Sync event to connected third-party calendar
    const connections = await calendarRepository.listConnections(organizationId);
    const staffConn = connections.find((c) => c.staffMemberId === staffMemberId && c.syncStatus === "active");

    if (staffConn) {
      try {
        const provider = providerRegistry.getProvider(staffConn.provider);
        const extEvent = await provider.createEvent(
          staffConn.accessToken,
          staffConn.refreshToken,
          staffConn.expiresAt,
          staffConn.externalCalendarId,
          {
            title: `${service.name} - ${input.customerName}`,
            start: startTime,
            end: endTime,
            description: `AI booked appointment for ${input.customerName}. Email: ${input.customerEmail || "N/A"}. Phone: ${input.customerPhone || "N/A"}.`,
          }
        );

        // Update external ID in metadata / status
        await appointmentsRepository.logEvent(organizationId, appointment.id, "calendar_synced", {
          provider: staffConn.provider,
          externalId: extEvent.externalId,
        });
      } catch (err) {
        console.error("[BookingService] Failed to sync created event to external calendar:", err);
      }
    }

    // 5. Queue notification reminders
    // We queue reminders for 24h, 12h, and 1h before appointment
    const reminderTimings = [
      { type: "email" as const, leadTimeMs: 24 * 60 * 60 * 1000 },
      { type: "sms" as const, leadTimeMs: 12 * 60 * 60 * 1000 },
      { type: "email" as const, leadTimeMs: 1 * 60 * 60 * 1000 },
    ];

    for (const tim of reminderTimings) {
      const sendAt = new Date(startTime.getTime() - tim.leadTimeMs);
      if (sendAt > new Date()) {
        await remindersRepository.create({
          organizationId,
          appointmentId: appointment.id,
          type: tim.type,
          sendAt,
          status: "pending",
        });
      }
    }

    return appointment;
  },

  async rescheduleAppointment(
    appointmentId: string,
    newStartTime: Date,
    reason: string = "Requested by customer",
    requestedBy: "user" | "staff" = "user"
  ) {
    const aptDetails = await appointmentsRepository.findById(appointmentId);
    if (!aptDetails) throw new Error("Appointment not found");

    const { appointment, service } = aptDetails;
    if (!service) throw new Error("Mapped service details not found");

    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, appointment.organizationId));
    const timezone = org?.timezone || "UTC";

    // Check rules
    const rules = await rulesRepository.getByOrganization(appointment.organizationId);
    if (rules && !rules.allowRescheduling) {
      throw new Error("Rescheduling is disabled for this organization.");
    }

    const duration = service.duration;
    const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000);

    // Verify slot availability
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parts = formatter.formatToParts(newStartTime);
    const p = parts.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {} as Record<string, string>);

    const dateStr = `${p.year}-${p.month}-${p.day}`;
    let hour = p.hour;
    if (hour === "24") hour = "00";
    const slotTimeStr = `${hour}:${p.minute}`;

    const availableSlots = await availabilityService.getAvailableSlots(
      appointment.organizationId,
      appointment.serviceId!,
      dateStr,
      appointment.staffMemberId!
    );
    const isSlotAvailable = availableSlots.some(
      (s) => s.startTime === slotTimeStr && s.staffId === appointment.staffMemberId
    );

    if (!isSlotAvailable) {
      throw new Error(`Requested reschedule slot ${slotTimeStr} is no longer available.`);
    }

    // Apply reschedule updates
    const updated = await appointmentsRepository.update(
      appointmentId,
      {
        startTime: newStartTime,
        endTime: newEndTime,
        status: "rescheduled",
      },
      requestedBy,
      reason
    );

    // Log reschedule request details
    await appointmentsRepository.requestReschedule({
      organizationId: appointment.organizationId,
      appointmentId,
      requestedBy,
      originalStartTime: new Date(appointment.startTime),
      requestedStartTime: newStartTime,
      reason,
      status: "applied",
    });

    // Update Connected Calendar Event
    const connections = await calendarRepository.listConnections(appointment.organizationId);
    const staffConn = connections.find((c) => c.staffMemberId === appointment.staffMemberId && c.syncStatus === "active");

    if (staffConn) {
      // Find sync log to fetch original event external ID
      const events = await db
        .select()
        .from(appointmentEvents)
        .where(
          and(
            eq(appointmentEvents.appointmentId, appointmentId),
            eq(appointmentEvents.eventType, "calendar_synced")
          )
        );

      const externalId = (events[0]?.payload as any)?.externalId;
      if (externalId) {
        try {
          const provider = providerRegistry.getProvider(staffConn.provider);
          await provider.updateEvent(
            staffConn.accessToken,
            staffConn.refreshToken,
            staffConn.expiresAt,
            staffConn.externalCalendarId,
            externalId,
            {
              title: `${service.name} - ${appointment.customerName}`,
              start: newStartTime,
              end: newEndTime,
              description: `AI Rescheduled appointment for ${appointment.customerName}. Reason: ${reason}`,
            }
          );
        } catch (err) {
          console.error("[BookingService] Failed to update rescheduled event in calendar provider:", err);
        }
      }
    }

    // Clear old reminders and reschedule new ones
    await remindersRepository.deleteByAppointment(appointmentId);
    const reminderTimings = [
      { type: "email" as const, leadTimeMs: 24 * 60 * 60 * 1000 },
      { type: "sms" as const, leadTimeMs: 12 * 60 * 60 * 1000 },
      { type: "email" as const, leadTimeMs: 1 * 60 * 60 * 1000 },
    ];

    for (const tim of reminderTimings) {
      const sendAt = new Date(newStartTime.getTime() - tim.leadTimeMs);
      if (sendAt > new Date()) {
        await remindersRepository.create({
          organizationId: appointment.organizationId,
          appointmentId,
          type: tim.type,
          sendAt,
          status: "pending",
        });
      }
    }

    return updated;
  },

  async cancelAppointment(
    appointmentId: string,
    reason: string = "Cancelled by client",
    cancelledBy: "user" | "staff" = "user"
  ) {
    const aptDetails = await appointmentsRepository.findById(appointmentId);
    if (!aptDetails) throw new Error("Appointment not found");

    const { appointment, service } = aptDetails;

    // Check rules
    const rules = await rulesRepository.getByOrganization(appointment.organizationId);
    if (rules && !rules.allowCancellation) {
      throw new Error("Cancellation is disabled for this organization.");
    }

    // Cancel appointment
    const updated = await appointmentsRepository.update(
      appointmentId,
      { status: "cancelled" },
      cancelledBy,
      reason
    );

    // Log details
    await appointmentsRepository.logCancellation(appointment.organizationId, appointmentId, cancelledBy, reason);

    // Delete connected calendar event
    const connections = await calendarRepository.listConnections(appointment.organizationId);
    const staffConn = connections.find((c) => c.staffMemberId === appointment.staffMemberId && c.syncStatus === "active");

    if (staffConn) {
      const events = await db
        .select()
        .from(appointmentEvents)
        .where(
          and(
            eq(appointmentEvents.appointmentId, appointmentId),
            eq(appointmentEvents.eventType, "calendar_synced")
          )
        );

      const externalId = (events[0]?.payload as any)?.externalId;
      if (externalId) {
        try {
          const provider = providerRegistry.getProvider(staffConn.provider);
          await provider.deleteEvent(
            staffConn.accessToken,
            staffConn.refreshToken,
            staffConn.expiresAt,
            staffConn.externalCalendarId,
            externalId
          );
        } catch (err) {
          console.error("[BookingService] Failed to delete event from calendar provider:", err);
        }
      }
    }

    // Clear reminders queue
    await remindersRepository.deleteByAppointment(appointmentId);

    return updated;
  },
};
