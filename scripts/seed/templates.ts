import { db } from "../../src/server/db";
import { messageTemplates } from "../../src/server/db/schema";
import { ORG_ID } from "./business";

export async function seedTemplates(): Promise<void> {
  console.log("📝 Seeding message templates...");

  await db.insert(messageTemplates).values([
    {
      organizationId: ORG_ID,
      channelType: "whatsapp",
      name: "Spa Booking Confirmation",
      category: "appointment_confirmation",
      variables: ["customer_name", "service_name", "date_time", "staff_name"],
      body: "Hi {{customer_name}}, your booking for {{service_name}} at Glow & Grace is confirmed on {{date_time}} with {{staff_name}}. We look forward to seeing you!",
      status: "approved",
      approvedAt: new Date()
    },
    {
      organizationId: ORG_ID,
      channelType: "sms",
      name: "Quick 24h Appointment Reminder",
      category: "appointment_reminder",
      variables: ["customer_name", "time"],
      body: "Friendly reminder: {{customer_name}}, you have a session tomorrow at {{time}}. To cancel or reschedule, please reply at least 24 hours prior.",
      status: "approved",
      approvedAt: new Date()
    },
    {
      organizationId: ORG_ID,
      channelType: "email",
      name: "Post-Treatment Feedback and Review",
      category: "review_request",
      variables: ["customer_name", "review_url"],
      subject: "We value your glow — leave us a review!",
      body: "Hi {{customer_name}}, thank you for choosing Glow & Grace Esthetics! We hope you loved your treatment. Please take 1 minute to leave us feedback here: {{review_url}}",
      status: "approved",
      approvedAt: new Date()
    }
  ]).onConflictDoNothing();

  console.log("✅ Seeded message templates");
}
