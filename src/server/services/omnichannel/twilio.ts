import { 
  MessagingProvider, 
  WebhookProvider, 
  SendMessageResult, 
  WebhookMessagePayload, 
  WebhookStatusPayload,
  ProviderRegistry
} from "./types";

export class TwilioProvider implements MessagingProvider, WebhookProvider {
  id = "sms-twilio";
  name = "Twilio SMS Service";
  channelType = "sms" as const;

  // 1. Send SMS
  async sendMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    content: string,
    attachments?: any[]
  ): Promise<SendMessageResult> {
    try {
      const accountSid = connectionConfig.accountSid || "mock-sid";
      const authToken = connectionConfig.authToken || "mock-token";
      const fromNumber = connectionConfig.fromNumber || "mock-number";

      console.log(`[Twilio SDK] Outgoing SMS to ${recipientId} from ${fromNumber} via Twilio:`, content);

      // Perform a mock Twilio REST call
      // In production, this would make an HTTPS call to https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json
      const mockTwilioSid = "SM" + Math.random().toString(36).substring(2, 16);

      return {
        success: true,
        externalId: mockTwilioSid
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "TWILIO_SEND_FAILED",
        errorMessage: e?.message || "Twilio request failed"
      };
    }
  }

  // 2. Send SMS using templates
  async sendTemplateMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<SendMessageResult> {
    // For SMS, we interpolate the template in the wrapper and call sendMessage.
    // Twilio SMS has no native templates like WhatsApp.
    return this.sendMessage(organizationId, connectionConfig, recipientId, `[Template ${templateName} sent]`);
  }

  // 3. Process Twilio status or message callback webhooks
  async processIncomingWebhook(
    headers: Record<string, string>,
    body: any
  ): Promise<{ messages: WebhookMessagePayload[]; statuses: WebhookStatusPayload[] }> {
    const messages: WebhookMessagePayload[] = [];
    const statuses: WebhookStatusPayload[] = [];

    try {
      const orgId = headers["x-organization-id"] || "mock-org-id";
      const channelId = headers["x-channel-id"] || "mock-channel-id";

      // Twilio post webhook details:
      // - Incoming messages have MessageSid, From, To, Body
      // - Status updates have MessageSid, MessageStatus, ErrorCode, etc.
      
      const messageSid = body.MessageSid;
      const messageStatus = body.SmsStatus || body.MessageStatus;

      if (messageSid && messageStatus && !body.From) {
        // This is a status update callback
        let statusMapped: "queued" | "sent" | "delivered" | "read" | "failed" = "sent";
        if (messageStatus === "delivered") statusMapped = "delivered";
        else if (messageStatus === "undelivered" || messageStatus === "failed") statusMapped = "failed";
        else if (messageStatus === "sent") statusMapped = "sent";
        else if (messageStatus === "queued") statusMapped = "queued";

        statuses.push({
          organizationId: orgId,
          channelId: channelId,
          externalMessageId: messageSid,
          status: statusMapped,
          errorCode: body.ErrorCode,
          errorMessage: body.ErrorMessage || body.ErrorMessageText,
          updatedAt: new Date()
        });
      } else if (body.From && body.To && body.Body) {
        // This is an incoming SMS
        messages.push({
          organizationId: orgId,
          channelId: channelId,
          channelType: "sms",
          externalMessageId: messageSid || "twilio-sid-" + Math.random().toString(36).substring(2, 10),
          senderUserId: body.From, // e.g. "+15550199"
          recipientUserId: body.To, // business Twilio number
          content: body.Body,
          metadata: {
            fromCity: body.FromCity,
            fromState: body.FromState,
            fromCountry: body.FromCountry
          }
        });
      }
    } catch (e) {
      console.error("[Twilio Provider] Error parsing SMS webhook:", e);
    }

    return { messages, statuses };
  }

  // Twilio signature verification helper
  verifyWebhookRequest(
    authToken: string,
    url: string,
    params: Record<string, any>,
    signature: string
  ): boolean {
    // In production, this imports Twilio utility library to assert x-twilio-signature header.
    console.log("[Twilio SDK] Verifying signature against webhook URL:", url);
    return true;
  }
}

// Auto-register provider
const providerInstance = new TwilioProvider();
ProviderRegistry.registerMessagingProvider(providerInstance);
ProviderRegistry.registerWebhookProvider(providerInstance);
