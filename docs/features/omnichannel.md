# Omnichannel Router

Operator is designed to handle conversations seamlessly across multiple platforms (WhatsApp, SMS, Instagram, Facebook Messenger, Email, Web Chat) from a single unified inbox.

The Omnichannel Router (`src/server/services/omnichannel/router.ts`) is the central nervous system for this capability.

---

## The Request Lifecycle

When a message arrives from any platform, it hits a platform-specific webhook (e.g., `/api/webhooks/meta` for WhatsApp/Instagram). The webhook normalizes the payload into a standard `WebhookMessagePayload` and passes it to the `omnichannelRouter`.

### 1. Identity Resolution
The router attempts to match the incoming `senderUserId` (e.g., a phone number for SMS, or an IG scoped ID for Instagram) against the `contactChannels` table. 
- **Match found:** The message is linked to the existing `leadProfileId`.
- **No match:** A new Lead Profile is created and a new contact channel mapping is saved.

### 2. Thread Resolution
The router looks for an open `inboxThreads` record for this organization and channel.
- **Match found:** The message is appended to the existing thread and underlying `conversations` record.
- **No match:** A new `conversations` record is created, and a new `inboxThreads` record is created in the "open" status.

### 3. Message Persistence
The message is saved in two places:
1. `channelMessages`: Raw audit trail of everything sent/received on the specific channel.
2. `conversationMessages`: Normalized view used by the AI context window.

### 4. AI Orchestration
The router checks the `channelSettings` to see if AI responses are enabled for this specific channel connection, and checks if the thread is currently escalated to a human agent.

If AI is enabled and the thread is NOT escalated:
1. The message is passed to `orchestratorService.processMessage()`.
2. The AI generates a reply.
3. The reply is routed back through `sendOutgoingMessage()`.

---

## Outgoing Messages

The `sendOutgoingMessage()` function acts as a reverse proxy. It looks up the `channelConnections` record to find the provider API credentials, and dynamically invokes the correct provider (e.g., WhatsApp, Instagram, Twilio) to deliver the message.

---

## Supported Channels

### WhatsApp Business (Meta API)
- Uses the official WhatsApp Cloud API.
- Webhook: `/api/webhooks/meta`
- Service: `src/server/services/omnichannel/whatsapp.ts`

### Instagram Direct (Meta API)
- Uses the Instagram Graph API.
- Webhook: `/api/webhooks/meta`
- Service: `src/server/services/omnichannel/instagram.ts`

### Facebook Messenger (Meta API)
- Uses the Messenger Graph API.
- Webhook: `/api/webhooks/meta`
- Service: `src/server/services/omnichannel/facebook.ts`

### SMS (Twilio)
- Uses Twilio Programmable Messaging.
- Webhook: `/api/webhooks/twilio`
- Service: `src/server/services/voice/twilio.ts` (Shared with voice)

### Web Chat Widget
- The native Operator chat widget embedded on client websites.
- Webhook: `/api/widget/*`

### Email
- Uses SMTP/IMAP or SendGrid/Postmark webhooks.
- Service: `src/server/services/omnichannel/email.ts`

---

## Escalation Handling

When a conversation is escalated (either requested by the customer or triggered by AI intent), the `inboxThreads` record is updated with an `assignedStaffId` (or left null for a general queue, but status changes).

Once a thread is escalated, the Omnichannel Router suppresses the AI trigger (Step 4 above). Incoming messages continue to append to the thread, but the AI will no longer automatically reply. Human agents must reply via the unified inbox UI.
