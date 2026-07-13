import { 
  MessagingProvider, 
  WebhookProvider, 
  SendMessageResult, 
  WebhookMessagePayload, 
  WebhookStatusPayload,
  ProviderRegistry
} from "./types";

export class InstagramProvider implements MessagingProvider, WebhookProvider {
  id = "instagram-meta";
  name = "Instagram Business Messaging";
  channelType = "instagram" as const;

  // 1. Send Instagram DM
  async sendMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    content: string,
    attachments?: any[]
  ): Promise<SendMessageResult> {
    try {
      const pageAccessToken = connectionConfig.pageAccessToken || "mock-token";
      const igId = connectionConfig.instagramId || "mock-ig-id";
      // Perform mock Instagram Graph API message send
      // Endpoint: https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}
      const mockMetaId = "ig-msg-" + Math.random().toString(36).substring(2, 12);

      return {
        success: true,
        externalId: mockMetaId
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "INSTAGRAM_SEND_FAILED",
        errorMessage: e?.message || "Instagram DM API request failed"
      };
    }
  }

  // 2. Instagram has no template message APIs
  async sendTemplateMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<SendMessageResult> {
    return this.sendMessage(organizationId, connectionConfig, recipientId, `[Instagram template ${templateName} sent]`);
  }

  // 3. Process webhooks from Meta for Instagram
  async processIncomingWebhook(
    headers: Record<string, string>,
    body: any
  ): Promise<{ messages: WebhookMessagePayload[]; statuses: WebhookStatusPayload[] }> {
    const messages: WebhookMessagePayload[] = [];
    const statuses: WebhookStatusPayload[] = [];

    try {
      const orgId = headers["x-organization-id"] || "mock-org-id";
      const channelId = headers["x-channel-id"] || "mock-channel-id";

      const entry = body?.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (messaging) {
        const senderId = messaging.sender?.id;
        const recipientId = messaging.recipient?.id;
        const message = messaging.message;

        if (message && senderId && recipientId) {
          // Parse read/delivery status updates
          if (messaging.read) {
            statuses.push({
              organizationId: orgId,
              channelId: channelId,
              externalMessageId: messaging.read.watermark.toString(),
              status: "read",
              updatedAt: new Date(messaging.read.watermark || Date.now())
            });
          }

          if (message.text) {
            messages.push({
              organizationId: orgId,
              channelId: channelId,
              channelType: "instagram",
              externalMessageId: message.mid,
              senderUserId: senderId, // The customer's IG scoped user ID (PSID)
              recipientUserId: recipientId, // The business's IG Page ID
              content: message.text,
              metadata: {
                rawInstagramMessage: message
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("[Instagram Provider] Error parsing Instagram DM webhook:", e);
    }

    return { messages, statuses };
  }
}

// Auto-register provider
const providerInstance = new InstagramProvider();
ProviderRegistry.registerMessagingProvider(providerInstance);
ProviderRegistry.registerWebhookProvider(providerInstance);
