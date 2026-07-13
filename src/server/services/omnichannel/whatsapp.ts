import { 
  MessagingProvider, 
  WebhookProvider, 
  SendMessageResult, 
  WebhookMessagePayload, 
  WebhookStatusPayload,
  ProviderRegistry
} from "./types";

export class WhatsAppProvider implements MessagingProvider, WebhookProvider {
  id = "whatsapp-meta";
  name = "Meta WhatsApp Business API";
  channelType = "whatsapp" as const;

  // 1. Send text or media message
  async sendMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    content: string,
    attachments?: any[]
  ): Promise<SendMessageResult> {
    try {
      const accessToken = connectionConfig.accessToken || "mock-access-token";
      const phoneId = connectionConfig.phoneId || "mock-phone-id";
      // Perform a mock Meta API request
      // In production, this would make an HTTPS call to https://graph.facebook.com/v18.0/${phoneId}/messages
      const mockMetaId = "wa-msg-" + Math.random().toString(36).substring(2, 12);
      
      return {
        success: true,
        externalId: mockMetaId
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "WHATSAPP_SEND_FAILED",
        errorMessage: e?.message || "Meta API request failed"
      };
    }
  }

  // 2. Send approved Business Template message
  async sendTemplateMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<SendMessageResult> {
    try {
      const phoneId = connectionConfig.phoneId || "mock-phone-id";
      const mockMetaId = "wa-tpl-" + Math.random().toString(36).substring(2, 12);

      return {
        success: true,
        externalId: mockMetaId
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "WHATSAPP_TEMPLATE_FAILED",
        errorMessage: e?.message || "Meta Template API request failed"
      };
    }
  }

  // 3. Process webhooks from Meta
  async processIncomingWebhook(
    headers: Record<string, string>,
    body: any
  ): Promise<{ messages: WebhookMessagePayload[]; statuses: WebhookStatusPayload[] }> {
    const messages: WebhookMessagePayload[] = [];
    const statuses: WebhookStatusPayload[] = [];

    try {
      // Validate Meta signature if configured
      // const signature = headers["x-hub-signature-256"];
      
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const val = changes?.value;

      if (!val) {
        return { messages, statuses };
      }

      const orgId = headers["x-organization-id"] || "mock-org-id";
      const channelId = headers["x-channel-id"] || "mock-channel-id";

      // Parse status updates (sent, delivered, read, failed)
      if (val.statuses && val.statuses.length > 0) {
        for (const stat of val.statuses) {
          statuses.push({
            organizationId: orgId,
            channelId: channelId,
            externalMessageId: stat.id,
            status: stat.status, // 'sent' | 'delivered' | 'read' | 'failed'
            errorCode: stat.errors?.[0]?.code?.toString(),
            errorMessage: stat.errors?.[0]?.message,
            updatedAt: new Date(parseInt(stat.timestamp, 10) * 1000 || Date.now())
          });
        }
      }

      // Parse incoming messages
      if (val.messages && val.messages.length > 0) {
        const metadata = val.metadata; // info about recipient phone number id
        const recipientUserId = metadata?.display_phone_number || "business-whatsapp";

        for (const msg of val.messages) {
          const contact = val.contacts?.[0];
          const senderName = contact?.profile?.name || "WhatsApp User";
          
          let content = "";
          const attachments: any[] = [];

          if (msg.type === "text") {
            content = msg.text?.body || "";
          } else if (msg.type === "image") {
            content = "[Image Received]";
            attachments.push({
              url: `https://graph.facebook.com/v18.0/${msg.image.id}`,
              fileName: "whatsapp_image.jpg",
              fileSize: 1024,
              mimeType: msg.image.mime_type || "image/jpeg"
            });
          } else if (msg.type === "document") {
            content = "[Document Received]";
            attachments.push({
              url: `https://graph.facebook.com/v18.0/${msg.document.id}`,
              fileName: msg.document.filename || "document.pdf",
              fileSize: 2048,
              mimeType: msg.document.mime_type || "application/pdf"
            });
          } else if (msg.type === "button") {
            content = msg.button?.text || "";
          } else if (msg.type === "interactive") {
            content = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || "";
          }

          messages.push({
            organizationId: orgId,
            channelId: channelId,
            channelType: "whatsapp",
            externalMessageId: msg.id,
            senderUserId: msg.from, // sender's phone number e.g. '15550199'
            senderName,
            recipientUserId,
            content,
            attachments,
            metadata: {
              rawMetaMessage: msg
            }
          });
        }
      }
    } catch (e) {
      console.error("[WhatsApp Provider] Error parsing webhook payload:", e);
    }

    return { messages, statuses };
  }

  // Verify Hub Challenge for Webhook Config
  verifyWebhookChallenge(queryParams: Record<string, string>): string | null {
    const hubMode = queryParams["hub.mode"];
    const hubToken = queryParams["hub.verify_token"];
    const hubChallenge = queryParams["hub.challenge"];

    // In a live system, this would match a verification token saved in settings.
    if (hubMode === "subscribe" && hubToken) {
      return hubChallenge || "";
    }
    return null;
  }
}

// Auto-register provider
const providerInstance = new WhatsAppProvider();
ProviderRegistry.registerMessagingProvider(providerInstance);
ProviderRegistry.registerWebhookProvider(providerInstance);
