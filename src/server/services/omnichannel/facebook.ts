import { 
  MessagingProvider, 
  WebhookProvider, 
  SendMessageResult, 
  WebhookMessagePayload, 
  WebhookStatusPayload,
  ProviderRegistry
} from "./types";

export class FacebookProvider implements MessagingProvider, WebhookProvider {
  id = "facebook-meta";
  name = "Facebook Page Messenger";
  channelType = "facebook" as const;

  // 1. Send Messenger Message
  async sendMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    content: string,
    attachments?: any[]
  ): Promise<SendMessageResult> {
    try {
      const pageAccessToken = connectionConfig.pageAccessToken || "mock-token";
      const pageId = connectionConfig.pageId || "mock-page-id";

      console.log(`[FB Messenger SDK] Outgoing Message to client PSID ${recipientId} from Page ID ${pageId}:`, content);

      // Perform mock Meta Graph API Messenger call
      // Endpoint: https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}
      const mockMetaId = "fb-msg-" + Math.random().toString(36).substring(2, 12);

      return {
        success: true,
        externalId: mockMetaId
      };
    } catch (e: any) {
      return {
        success: false,
        errorCode: "FACEBOOK_SEND_FAILED",
        errorMessage: e?.message || "Facebook Page Messenger API request failed"
      };
    }
  }

  // 2. Facebook templates are legacy structured messages (buttons, generic templates)
  async sendTemplateMessage(
    organizationId: string,
    connectionConfig: Record<string, any>,
    recipientId: string,
    templateName: string,
    variables: Record<string, string>
  ): Promise<SendMessageResult> {
    return this.sendMessage(organizationId, connectionConfig, recipientId, `[Facebook template ${templateName} sent]`);
  }

  // 3. Process webhooks from Meta for Messenger
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
              channelType: "facebook",
              externalMessageId: message.mid,
              senderUserId: senderId, // The customer's FB page scoped user ID (PSID)
              recipientUserId: recipientId, // The business's FB Page ID
              content: message.text,
              metadata: {
                rawFacebookMessage: message
              }
            });
          }
        }
      }
    } catch (e) {
      console.error("[Facebook Provider] Error parsing Messenger webhook:", e);
    }

    return { messages, statuses };
  }
}

// Auto-register provider
const providerInstance = new FacebookProvider();
ProviderRegistry.registerMessagingProvider(providerInstance);
ProviderRegistry.registerWebhookProvider(providerInstance);
