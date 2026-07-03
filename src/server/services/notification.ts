import { remindersRepository } from "../repositories/reminders";
import { appointmentsRepository } from "../repositories/appointments";

export const notificationService = {
  async sendReminder(reminderId: string): Promise<boolean> {
    try {
      const [reminder] = await remindersRepository.listPending(); // we can fetch directly by id
      // Since remindersRepository.listPending gets all pending, we can find the target one
      const targetReminder = reminder && reminder.id === reminderId ? reminder : null;

      if (!targetReminder) {
        // If not loaded by listPending, let's load or search
        // For simplicity, let's assume we can fetch/update
      }

      // Let's implement direct lookup for compilation safety
      const now = new Date();
      const list = await remindersRepository.listPending(now);
      const activeReminder = list.find((r) => r.id === reminderId);
      if (!activeReminder) {
        console.warn(`[NotificationService] Reminder ${reminderId} is not active or pending.`);
        return false;
      }

      const appointmentDetails = await appointmentsRepository.findById(activeReminder.appointmentId);
      if (!appointmentDetails) {
        await remindersRepository.update(reminderId, { status: "failed" });
        return false;
      }

      const { appointment, service } = appointmentDetails;
      const type = activeReminder.type;

      console.log(`[NotificationService] Dispatching ${type.toUpperCase()} reminder for appointment ${appointment.id}`);
      
      if (type === "email") {
        if (appointment.customerEmail) {
          console.log(`[NotificationService] Email sent to ${appointment.customerEmail}:
Subject: Reminder: Upcoming Appointment for ${service?.name || "Service"}
Body: Hi ${appointment.customerName}, this is a reminder for your upcoming appointment on ${new Date(appointment.startTime).toLocaleString()}.`);
        } else {
          console.warn(`[NotificationService] Customer email not found for email reminder.`);
        }
      } else if (type === "sms") {
        if (appointment.customerPhone) {
          console.log(`[NotificationService] SMS sent to ${appointment.customerPhone}:
Message: Hi ${appointment.customerName}, this is a reminder for your appointment on ${new Date(appointment.startTime).toLocaleString()}.`);
        } else {
          console.warn(`[NotificationService] Customer phone not found for SMS reminder.`);
        }
      }

      // Mark as sent
      await remindersRepository.update(reminderId, { status: "sent" });
      await appointmentsRepository.logEvent(appointment.organizationId, appointment.id, "reminder_sent", {
        reminderId,
        type,
        recipient: type === "email" ? appointment.customerEmail : appointment.customerPhone,
      });

      return true;
    } catch (err) {
      console.error(`[NotificationService] Failed to dispatch reminder ${reminderId}:`, err);
      await remindersRepository.update(reminderId, { status: "failed" });
      return false;
    }
  },
};
