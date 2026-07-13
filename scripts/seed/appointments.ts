import { db } from "../../src/server/db";
import { appointments, appointmentStatusHistory } from "../../src/server/db/schema";
import { ORG_ID } from "./business";
import { SeededStaff } from "./staff";
import { SeededService } from "./services";
import { SeededContact } from "./contacts";

export async function seedAppointments(
  contacts: SeededContact[],
  servicesList: SeededService[],
  staff: SeededStaff[]
): Promise<void> {
  console.log("📅 Seeding past, today, and upcoming appointments...");

  const now = new Date();
  
  // Define relative offsets in days
  // We'll generate a list of dates to make it super simple and deterministic
  const appointmentTimes = [
    // Past (completed / cancelled)
    { offsetDays: -28, hour: 10, status: "completed" },
    { offsetDays: -25, hour: 11, status: "completed" },
    { offsetDays: -20, hour: 14, status: "completed" },
    { offsetDays: -18, hour: 9, status: "cancelled" },
    { offsetDays: -15, hour: 15, status: "completed" },
    { offsetDays: -14, hour: 13, status: "completed" },
    { offsetDays: -10, hour: 16, status: "completed" },
    { offsetDays: -8, hour: 10, status: "completed" },
    { offsetDays: -5, hour: 12, status: "completed" },
    { offsetDays: -3, hour: 14, status: "completed" },
    { offsetDays: -2, hour: 11, status: "completed" },
    { offsetDays: -1, hour: 15, status: "completed" },

    // Today (current day)
    { offsetDays: 0, hour: 9, status: "completed" },     // completed early morning
    { offsetDays: 0, hour: 11, status: "completed" },    // completed midday
    { offsetDays: 0, hour: 13, status: "confirmed" },    // confirmed afternoon
    { offsetDays: 0, hour: 15, status: "confirmed" },    // confirmed late afternoon
    { offsetDays: 0, hour: 17, status: "pending" },      // pending evening

    // Upcoming (future)
    { offsetDays: 1, hour: 10, status: "confirmed" },
    { offsetDays: 1, hour: 14, status: "pending" },
    { offsetDays: 2, hour: 11, status: "confirmed" },
    { offsetDays: 3, hour: 9, status: "rescheduled" },
    { offsetDays: 4, hour: 15, status: "confirmed" },
    { offsetDays: 7, hour: 13, status: "confirmed" },
    { offsetDays: 10, hour: 16, status: "confirmed" },
    { offsetDays: 12, hour: 10, status: "confirmed" },
    { offsetDays: 15, hour: 14, status: "confirmed" },
    { offsetDays: 18, hour: 11, status: "confirmed" },
    { offsetDays: 20, hour: 15, status: "confirmed" },
    { offsetDays: 25, hour: 13, status: "confirmed" },
    { offsetDays: 28, hour: 10, status: "confirmed" }
  ];

  // We loop over the times list and assign contacts, services, and staff round-robin
  for (let i = 0; i < appointmentTimes.length; i++) {
    const timeDef = appointmentTimes[i];
    const contact = contacts[i % contacts.length];
    const service = servicesList[i % servicesList.length];
    const staffMember = staff[i % staff.length];

    // Compute exact start and end times
    const startTime = new Date(now);
    startTime.setDate(now.getDate() + timeDef.offsetDays);
    startTime.setHours(timeDef.hour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + service.duration);

    // Static UUID for idempotency
    const appointmentId = `99999999-9999-4999-9999-${(100000000000 + i).toString()}`;

    await db.insert(appointments).values({
      id: appointmentId,
      organizationId: ORG_ID,
      leadProfileId: contact.id,
      serviceId: service.id,
      staffMemberId: staffMember.id,
      status: timeDef.status,
      startTime: startTime,
      endTime: endTime,
      customerName: contact.name,
      customerEmail: contact.email,
      customerPhone: contact.phone,
      pricePaid: timeDef.status === "completed" ? service.price : null,
    }).onConflictDoNothing();

    // Seed status history for each status to represent audits
    await db.insert(appointmentStatusHistory).values({
      organizationId: ORG_ID,
      appointmentId: appointmentId,
      newStatus: timeDef.status,
      changedBy: "system",
      createdAt: new Date(startTime.getTime() - 2 * 24 * 60 * 60 * 1000), // changed 2 days prior to appointment
    }).onConflictDoNothing();
  }

  console.log(`✅ Seeded ${appointmentTimes.length} appointments with status histories`);
}
