import { db } from "../../src/server/db";
import {
  communicationChannels,
  conversations,
  conversationMessages,
  inboxThreads,
  channelMessages
} from "../../src/server/db/schema";
import { ORG_ID } from "./business";
import { SeededContact } from "./contacts";

export async function seedConversations(contacts: SeededContact[]): Promise<void> {
  console.log("💬 Seeding communication channels, threads, and inbox dialogs...");

  // 1. Seed communication channels
  const chanSmsId = "dddddddd-1111-1111-1111-111111111111";
  const chanWhatsAppId = "dddddddd-2222-2222-2222-222222222222";
  const chanEmailId = "dddddddd-3333-3333-3333-333333333333";

  await db.insert(communicationChannels).values([
    { id: chanSmsId, organizationId: ORG_ID, type: "sms", name: "Main Line SMS (+15559876543)", status: "active", config: {} },
    { id: chanWhatsAppId, organizationId: ORG_ID, type: "whatsapp", name: "WhatsApp Business API", status: "active", config: {} },
    { id: chanEmailId, organizationId: ORG_ID, type: "email", name: "Glow & Grace Concierge Email", status: "active", config: {} }
  ]).onConflictDoNothing();

  // We will seed 5 threads with distinct statuses & channels:
  // - Thread 1: WhatsApp - Unread / Active (new booking request)
  // - Thread 2: SMS - Escalated (customer complaining about parking)
  // - Thread 3: Email - Resolved / Closed (billing receipt sent)
  // - Thread 4: SMS - Open / Active (general question about peels)
  // - Thread 5: WhatsApp - Closed (cancellation requested and handled)

  const dialogs = [
    {
      conversationId: "eeeeeeee-1001-1111-1111-111111111111",
      threadId: "ffffffff-1001-1111-1111-111111111111",
      channelId: chanWhatsAppId,
      contact: contacts[0],
      convStatus: "active",
      threadStatus: "open",
      unreadCount: 1,
      messages: [
        { sender: "user", content: "Hi! I wanted to check if you have any opening for a HydraFacial this Saturday afternoon?" },
        { sender: "assistant", content: "Hello! Yes, we have two spots open for a HydraFacial this Saturday: 2:00 PM with Sophia Martinez or 4:30 PM with Elena Rostova. Would you like me to book one of these for you?" },
        { sender: "user", content: "Oh, 2:00 PM with Sophia works perfectly for me! What do I need to confirm?" }
      ]
    },
    {
      conversationId: "eeeeeeee-1002-1111-1111-111111111111",
      threadId: "ffffffff-1002-1111-1111-111111111111",
      channelId: chanSmsId,
      contact: contacts[1],
      convStatus: "escalated",
      threadStatus: "open",
      unreadCount: 0,
      messages: [
        { sender: "user", content: "Help! I am in the parking garage and the validator machine is saying my validation card is invalid." },
        { sender: "assistant", content: "I am sorry for the trouble! Please let the parking attendant know you are visiting Glow & Grace, or you can bring the card back up and we will validate it again at the front desk." },
        { sender: "user", content: "There is no attendant here. I'm stuck at the gate. Can someone call the building manager?" }
      ]
    },
    {
      conversationId: "eeeeeeee-1003-1111-1111-111111111111",
      threadId: "ffffffff-1003-1111-1111-111111111111",
      channelId: chanEmailId,
      contact: contacts[2],
      convStatus: "closed",
      threadStatus: "closed",
      unreadCount: 0,
      messages: [
        { sender: "user", content: "Hello, could you please send me a detailed PDF copy of my billing receipt for the Microneedling session on June 15th? I need to submit it to my HSA provider." },
        { sender: "assistant", content: "Certainly! I have generated your itemized HSA invoice receipt. A copy has been sent to your email on file. Let me know if you need anything else." },
        { sender: "user", content: "Got it, thank you so much for the prompt help!" }
      ]
    },
    {
      conversationId: "eeeeeeee-1004-1111-1111-111111111111",
      threadId: "ffffffff-1004-1111-1111-111111111111",
      channelId: chanSmsId,
      contact: contacts[3],
      convStatus: "active",
      threadStatus: "open",
      unreadCount: 0,
      messages: [
        { sender: "user", content: "Is it okay to wear makeup right after getting the Signature Glow Facial?" },
        { sender: "assistant", content: "We recommend waiting at least 4 to 6 hours before applying makeup after a facial. This gives your pores time to breathe and absorb the hydrating botanical serums completely." },
        { sender: "user", content: "Okay, perfect, I will bring a wide-brim hat instead." }
      ]
    },
    {
      conversationId: "eeeeeeee-1005-1111-1111-111111111111",
      threadId: "ffffffff-1005-1111-1111-111111111111",
      channelId: chanWhatsAppId,
      contact: contacts[4],
      convStatus: "closed",
      threadStatus: "closed",
      unreadCount: 0,
      messages: [
        { sender: "user", content: "I need to cancel my brow wax for tomorrow morning. Something came up." },
        { sender: "assistant", content: "I understand! I can cancel that for you. Please note that cancellations made less than 24 hours prior to booking incur a 50% cancellation charge. Would you like to reschedule instead to avoid this?" },
        { sender: "user", content: "Ah, let's reschedule to next week Thursday at 3:00 PM if available." },
        { sender: "assistant", content: "Rescheduled! Your Brow Waxing is now set for next Thursday at 3:00 PM. The cancellation charge has been waived. You will receive an SMS confirmation shortly." }
      ]
    }
  ];

  for (const d of dialogs) {
    // A. Insert Conversation
    await db.insert(conversations).values({
      id: d.conversationId,
      organizationId: ORG_ID,
      leadProfileId: d.contact.id,
      status: d.convStatus as any,
    }).onConflictDoNothing();

    // B. Insert Messages
    let lastMsgId: string | null = null;
    for (let msgIdx = 0; msgIdx < d.messages.length; msgIdx++) {
      const msg = d.messages[msgIdx];
      const messageId = `11000000-1100-4100-1100-${(100000000000 + seededMessagesCount).toString()}`;
      seededMessagesCount++;
      lastMsgId = messageId;

      await db.insert(conversationMessages).values({
        id: messageId,
        organizationId: ORG_ID,
        conversationId: d.conversationId,
        sender: msg.sender,
        content: msg.content,
        intentDetected: msg.sender === "user" ? "inquiry" : null,
        confidenceScore: "0.95"
      }).onConflictDoNothing();

      await db.insert(channelMessages).values({
        id: messageId,
        organizationId: ORG_ID,
        channelId: d.channelId,
        conversationId: d.conversationId,
        direction: msg.sender === "user" ? "incoming" : "outgoing",
        senderId: msg.sender === "user" ? d.contact.phone : "assistant",
        recipientId: msg.sender === "user" ? "assistant" : d.contact.phone,
        content: msg.content,
        status: "read",
      }).onConflictDoNothing();
    }

    // C. Insert Inbox Thread
    await db.insert(inboxThreads).values({
      id: d.threadId,
      organizationId: ORG_ID,
      conversationId: d.conversationId,
      channelId: d.channelId,
      lastMessageId: lastMsgId,
      unreadCount: d.unreadCount,
      status: d.threadStatus as any,
      updatedAt: new Date(),
    }).onConflictDoNothing();
  }

  console.log(`✅ Seeded ${dialogs.length} active threads and conversations`);
}

let seededMessagesCount = 0;
