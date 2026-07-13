import { escalationsRepository } from "../repositories/escalations";
import { conversationsRepository } from "../repositories/conversations";
import { leadsRepository } from "../repositories/leads";
import { db } from "../db";
import { conversationEvents } from "../db/schema";

export const escalationService = {
  async triggerEscalation(
    organizationId: string,
    conversationId: string,
    reason: "user_request" | "complaint" | "emergency" | "unknown_info" | "repeated_failure",
    notes?: string
  ) {
    // 1. Check if there's already a pending escalation for this conversation to prevent duplicates
    const existing = await escalationsRepository.findPendingByConversation(conversationId);
    if (existing) {
      return existing;
    }

    // 2. Create Escalation request
    const escalation = await escalationsRepository.create({
      organizationId,
      conversationId,
      reason,
      status: "pending",
      notes: notes || `Auto-escalation triggered due to: ${reason}`,
    });

    // 3. Update Conversation status
    const conv = await conversationsRepository.findById(conversationId);
    if (conv) {
      await conversationsRepository.update(conversationId, { status: "escalated" });
      
      // 4. Update Lead Profile status if connected
      if (conv.leadProfileId) {
        await leadsRepository.updateProfile(conv.leadProfileId, { status: "Escalated" });
      }
    }

    // 5. Create System Event
    await db.insert(conversationEvents).values({
      organizationId,
      conversationId,
      eventType: "escalated",
      payload: {
        escalationId: escalation.id,
        reason,
        notes: escalation.notes,
      },
    });
    return escalation;
  },

  async resolveEscalation(escalationId: string, notes?: string) {
    const updated = await escalationsRepository.update(escalationId, {
      status: "resolved",
      notes: notes || "Resolved by administrator.",
    });

    if (updated) {
      const conv = await conversationsRepository.findById(updated.conversationId);
      if (conv) {
        await conversationsRepository.update(updated.conversationId, { status: "active" });
        if (conv.leadProfileId) {
          await leadsRepository.updateProfile(conv.leadProfileId, { status: "Qualified" });
        }
      }
    }

    return updated;
  },
};
