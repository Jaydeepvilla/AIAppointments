import { leadsRepository } from "../repositories/leads";
import { messagesRepository } from "../repositories/messages";

export const scoringService = {
  async calculateScore(
    organizationId: string,
    leadProfileId: string,
    conversationId?: string
  ): Promise<{ score: number; breakdown: Record<string, number> }> {
    let score = 0;
    const breakdown: Record<string, number> = {
      contactDetails: 0,
      answerCompleteness: 0,
      urgency: 0,
      highValueInterest: 0,
    };

    // 1. Fetch lead profile
    const profile = await leadsRepository.findProfileById(leadProfileId);
    if (!profile) {
      return { score: 0, breakdown };
    }

    // Contact details score (max 50 points)
    if (profile.name) {
      breakdown.contactDetails += 10;
    }
    if (profile.email) {
      breakdown.contactDetails += 20;
    }
    if (profile.phone) {
      breakdown.contactDetails += 20;
    }
    score += breakdown.contactDetails;

    // 2. Answers completeness score (max 30 points)
    const answers = await leadsRepository.listAnswers(leadProfileId);
    const answersCount = answers.length;
    breakdown.answerCompleteness = Math.min(answersCount * 10, 30);
    score += breakdown.answerCompleteness;

    // 3. Urgency score (max 10 points)
    // Scan answers or messages for urgency indicators
    let hasUrgency = false;
    const urgencyKeywords = ["urgent", "emergency", "pain", "now", "asap", "today", "tomorrow", "soon", "hurt"];

    // Scan answers values
    for (const ans of answers) {
      const lowerVal = ans.answerValue.toLowerCase();
      if (urgencyKeywords.some((word) => lowerVal.includes(word))) {
        hasUrgency = true;
        break;
      }
    }

    // Scan conversation messages if provided
    if (!hasUrgency && conversationId) {
      const messages = await messagesRepository.listByConversation(conversationId);
      for (const msg of messages) {
        if (msg.sender === "user") {
          const lowerVal = msg.content.toLowerCase();
          if (urgencyKeywords.some((word) => lowerVal.includes(word))) {
            hasUrgency = true;
            break;
          }
        }
      }
    }

    if (hasUrgency) {
      breakdown.urgency = 10;
      score += 10;
    }

    // 4. High Value Service Interest (max 10 points)
    let hasHighValue = false;
    const highValueKeywords = [
      "crown",
      "implant",
      "surgery",
      "root canal",
      "veneer",
      "color",
      "balayage",
      "highlights",
      "massage",
      "facials",
      "retainer",
      "litigation",
      "incorporate",
      "consulting",
      "commercial",
      "gym membership",
    ];

    for (const ans of answers) {
      const lowerVal = ans.answerValue.toLowerCase();
      if (highValueKeywords.some((word) => lowerVal.includes(word))) {
        hasHighValue = true;
        break;
      }
    }

    if (!hasHighValue && conversationId) {
      const messages = await messagesRepository.listByConversation(conversationId);
      for (const msg of messages) {
        if (msg.sender === "user") {
          const lowerVal = msg.content.toLowerCase();
          if (highValueKeywords.some((word) => lowerVal.includes(word))) {
            hasHighValue = true;
            break;
          }
        }
      }
    }

    if (hasHighValue) {
      breakdown.highValueInterest = 10;
      score += 10;
    }

    // Ensure total is capped at 100
    const finalScore = Math.min(score, 100);

    // Save score to DB
    await leadsRepository.createScore({
      organizationId,
      leadProfileId,
      score: finalScore,
      breakdown,
    });

    return { score: finalScore, breakdown };
  },
};
