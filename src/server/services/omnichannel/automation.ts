import { db } from "../../db";
import { 
  appointments, 
  leadProfiles, 
  messageTemplates, 
  communicationChannels, 
  inboxThreads,
  services,
  staffMembers
} from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { templateEngine } from "./template-engine";
import { omnichannelRouter } from "./router";

export const omnichannelAutomation = {
  /**
   * 1. Triggered when a new lead is qualified/created
   */
  async handleNewLead(organizationId: string, leadId: string): Promise<void> {
    try {
      console.log(`[Omnichannel Automation] Processing New Lead trigger for ${leadId}`);

      const lead = await db.query.leadProfiles.findFirst({
        where: and(
          eq(leadProfiles.organizationId, organizationId),
          eq(leadProfiles.id, leadId)
        )
      });

      if (!lead || !lead.phone && !lead.email) return;

      // Find 'welcome' template
      const template = await db.query.messageTemplates.findFirst({
        where: and(
          eq(messageTemplates.organizationId, organizationId),
          eq(messageTemplates.category, "welcome")
        )
      });

      if (!template) return;

      // Resolve recipient contact handles
      const recipientHandle = lead.phone || lead.email || "";
      const channelType = lead.phone ? "sms" : "email";

      // Resolve channel details
      const channel = await db.query.communicationChannels.findFirst({
        where: and(
          eq(communicationChannels.organizationId, organizationId),
          eq(communicationChannels.type, channelType),
          eq(communicationChannels.status, "active")
        )
      });

      if (!channel) return;

      // Build context
      const variables = templateEngine.buildVariablesContext({
        customerName: lead.name
      });
      const body = templateEngine.render(template.body, variables);

      // Find open or new conversation
      let thread = await db.query.inboxThreads.findFirst({
        where: and(
          eq(inboxThreads.organizationId, organizationId),
          eq(inboxThreads.channelId, channel.id)
        )
      });

      if (thread) {
        await omnichannelRouter.sendOutgoingMessage({
          organizationId,
          channelId: channel.id,
          conversationId: thread.conversationId,
          recipientId: recipientHandle,
          content: body,
          isAiGenerated: false
        });
      }

    } catch (e) {
      console.error("[Omnichannel Automation] Error triggered in handleNewLead:", e);
    }
  },

  /**
   * 2. Triggered on missed appointments
   */
  async handleMissedAppointment(organizationId: string, appointmentId: string): Promise<void> {
    try {
      console.log(`[Omnichannel Automation] Processing Missed Appointment trigger for ${appointmentId}`);

      const appt = await db.query.appointments.findFirst({
        where: and(
          eq(appointments.organizationId, organizationId),
          eq(appointments.id, appointmentId)
        )
      });

      if (!appt) return;

      // Fetch details
      const lead = appt.customerPhone || appt.customerEmail
        ? { name: appt.customerName, phone: appt.customerPhone, email: appt.customerEmail }
        : null;

      if (!lead || !lead.phone && !lead.email) return;

      const template = await db.query.messageTemplates.findFirst({
        where: and(
          eq(messageTemplates.organizationId, organizationId),
          eq(messageTemplates.category, "follow_up")
        )
      });

      if (!template) return;

      const recipientHandle = lead.phone || lead.email || "";
      const channelType = lead.phone ? "sms" : "email";

      const channel = await db.query.communicationChannels.findFirst({
        where: and(
          eq(communicationChannels.organizationId, organizationId),
          eq(communicationChannels.type, channelType),
          eq(communicationChannels.status, "active")
        )
      });

      if (!channel) return;

      const variables = templateEngine.buildVariablesContext({
        customerName: lead.name,
        appointmentTime: new Date(appt.startTime).toLocaleString()
      });
      const body = templateEngine.render(template.body, variables);

      // Find thread
      let thread = await db.query.inboxThreads.findFirst({
        where: and(
          eq(inboxThreads.organizationId, organizationId),
          eq(inboxThreads.channelId, channel.id)
        )
      });

      if (thread) {
        await omnichannelRouter.sendOutgoingMessage({
          organizationId,
          channelId: channel.id,
          conversationId: thread.conversationId,
          recipientId: recipientHandle,
          content: body,
          isAiGenerated: false
        });
      }
    } catch (e) {
      console.error("[Omnichannel Automation] Error triggered in handleMissedAppointment:", e);
    }
  },

  /**
   * 3. Triggered on completed appointments to fetch customer reviews
   */
  async handleReviewRequest(organizationId: string, appointmentId: string): Promise<void> {
    try {
      console.log(`[Omnichannel Automation] Processing Review Request trigger for ${appointmentId}`);

      const appt = await db.query.appointments.findFirst({
        where: and(
          eq(appointments.organizationId, organizationId),
          eq(appointments.id, appointmentId)
        )
      });

      if (!appt) return;

      const recipientHandle = appt.customerPhone || appt.customerEmail || "";
      if (!recipientHandle) return;
      const channelType = appt.customerPhone ? "sms" : "email";

      const template = await db.query.messageTemplates.findFirst({
        where: and(
          eq(messageTemplates.organizationId, organizationId),
          eq(messageTemplates.category, "review_request")
        )
      });

      if (!template) return;

      const channel = await db.query.communicationChannels.findFirst({
        where: and(
          eq(communicationChannels.organizationId, organizationId),
          eq(communicationChannels.type, channelType),
          eq(communicationChannels.status, "active")
        )
      });

      if (!channel) return;

      const variables = templateEngine.buildVariablesContext({
        customerName: appt.customerName,
        appointmentTime: new Date(appt.startTime).toLocaleString()
      });
      const body = templateEngine.render(template.body, variables);

      let thread = await db.query.inboxThreads.findFirst({
        where: and(
          eq(inboxThreads.organizationId, organizationId),
          eq(inboxThreads.channelId, channel.id)
        )
      });

      if (thread) {
        await omnichannelRouter.sendOutgoingMessage({
          organizationId,
          channelId: channel.id,
          conversationId: thread.conversationId,
          recipientId: recipientHandle,
          content: body,
          isAiGenerated: false
        });
      }
    } catch (e) {
      console.error("[Omnichannel Automation] Error triggered in handleReviewRequest:", e);
    }
  }
};
