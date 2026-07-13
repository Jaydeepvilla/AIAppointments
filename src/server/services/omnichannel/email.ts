import { 
  MessagingProvider, 
  WebhookProvider, 
  SendMessageResult, 
  WebhookMessagePayload, 
  WebhookStatusPayload,
  ProviderRegistry
} from "./types";

export class EmailProvider implements MessagingProvider, WebhookProvider {
  id = "email-smtp";
  name = "SMTP / Google / Microsoft Email Core";
  channelType = "email" as const;

  // 1. Send Email
  async sendMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    content: string,
    attachments?: any[]
  ): Promise<SendMessageResult> {
    try {
      const smtpHost = connectionConfig.host || "smtp.gmail.com";
      const smtpUser = connectionConfig.user || "mock@gmail.com";
      // Perform a mock SMTP call / Microsoft Graph API request
      const mockEmailId = "mail-" + Math.random().toString(36).substring(2, 16) + "@nexx.ai";

      return {
        success: true,
        externalId: mockEmailId
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "EMAIL_SEND_FAILED",
        errorMessage: e?.message || "Email SMTP request failed"
      };
    }
  }

  // 2. Send Email template
  async sendTemplateMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<SendMessageResult> {
    return this.sendMessage(organizationId, connectionConfig, recipientId, `[Email template ${templateName} sent]`);
  }

  // 3. Process webhooks from inbound email relays (e.g. SendGrid Inbound Parse, Postmark)
  async processIncomingWebhook(
    headers: Record<string, string>,
    body: any
  ): Promise<{ messages: WebhookMessagePayload[]; statuses: WebhookStatusPayload[] }> {
    const messages: WebhookMessagePayload[] = [];
    const statuses: WebhookStatusPayload[] = [];

    try {
      const orgId = headers["x-organization-id"] || "mock-org-id";
      const channelId = headers["x-channel-id"] || "mock-channel-id";

      // SMTP parsed relays post webhook details:
      // - body.from, body.to, body.text, body.html, body.headers (In-Reply-To, References)
      
      const emailFrom = body.from || body.From;
      const emailTo = body.to || body.To;
      const emailBody = body.text || body.Text || body.html || body.Html || "";
      const emailSubject = body.subject || body.Subject || "";
      const messageIdHeader = body.headers?.["Message-ID"] || body.headers?.["message-id"] || "";
      const inReplyToHeader = body.headers?.["In-Reply-To"] || body.headers?.["in-reply-to"] || "";

      if (emailFrom && emailTo) {
        messages.push({
          organizationId: orgId,
          channelId: channelId,
          channelType: "email",
          externalMessageId: messageIdHeader || "mail-id-" + Math.random().toString(36).substring(2, 10),
          senderUserId: emailFrom, // e.g. "client@patient.com"
          recipientUserId: emailTo, // business inbox e.g. "receptionist@myclinic.com"
          content: emailBody,
          metadata: {
            subject: emailSubject,
            inReplyTo: inReplyToHeader,
            references: body.headers?.["References"] || ""
          }
        });
      }
    } catch (e) {
      console.error("[Email Provider] Error parsing inbound email webhook:", e);
    }

    return { messages, statuses };
  }
}

// Auto-register provider
const providerInstance = new EmailProvider();
ProviderRegistry.registerMessagingProvider(providerInstance);
ProviderRegistry.registerWebhookProvider(providerInstance);
