import { eq, and, lte } from "drizzle-orm";
import { db } from "../db";
import { appointmentReminders } from "../db/schema";

export interface NewAppointmentReminder {
  organizationId: string;
  appointmentId: string;
  type: "email" | "sms";
  sendAt: Date;
  status?: string;
}

export const remindersRepository = {
  async listPending(now: Date = new Date()) {
    return db
      .select()
      .from(appointmentReminders)
      .where(
        and(
          eq(appointmentReminders.status, "pending"),
          lte(appointmentReminders.sendAt, now)
        )
      );
  },

  async create(reminder: NewAppointmentReminder) {
    const [newReminder] = await db.insert(appointmentReminders).values(reminder).returning();
    return newReminder;
  },

  async update(id: string, updates: Partial<NewAppointmentReminder>) {
    const [updated] = await db
      .update(appointmentReminders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appointmentReminders.id, id))
      .returning();
    return updated;
  },

  async deleteByAppointment(appointmentId: string) {
    await db
      .delete(appointmentReminders)
      .where(eq(appointmentReminders.appointmentId, appointmentId));
  },
};
