import { llmRegistry } from "./llm";

export type IntentType = "booking" | "pricing" | "emergency" | "human_request" | "location" | "general" | "reschedule" | "cancel";

export interface IntentResult {
  intent: IntentType;
  confidence: number;
}

export const intentService = {
  detectWithRules(message: string): IntentResult | null {
    const lowercase = message.toLowerCase();

    // 1. Human requests
    const humanKeywords = [
      "human",
      "speak to a person",
      "speak to a human",
      "talk to a real",
      "representative",
      "operator",
      "real agent",
      "talk to a person",
      "support team",
      "customer support",
      "agent",
      "contact support"
    ];
    if (humanKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "human_request", confidence: 0.98 };
    }

    // 2. Emergency triggers
    const emergencyKeywords = [
      "emergency",
      "pain",
      "bleeding",
      "hurt",
      "broken tooth",
      "injured",
      "swelling",
      "accident",
      "severe",
      "hospital",
      "urgent care"
    ];
    if (emergencyKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "emergency", confidence: 0.95 };
    }

    // 3. Reschedule triggers (checked before booking to prevent overlaps)
    const rescheduleKeywords = [
      "reschedule",
      "change appointment",
      "move appointment",
      "change time",
      "change slot",
      "postpone",
      "different time",
      "different slot"
    ];
    if (rescheduleKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "reschedule", confidence: 0.95 };
    }

    // 4. Cancel triggers
    const cancelKeywords = [
      "cancel",
      "cancellation",
      "delete booking",
      "cancel my appointment",
      "cancel appointment"
    ];
    if (cancelKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "cancel", confidence: 0.95 };
    }

    // 5. Appointment / booking triggers
    const bookingKeywords = [
      "book",
      "appoint",
      "schedule",
      "reserve",
      "slot",
      "calendar",
      "visit",
      "clean my teeth",
      "haircut",
      "session",
      "consultation slot",
      "book online",
      "make an appointment",
      "book a call"
    ];
    if (bookingKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "booking", confidence: 0.92 };
    }

    // 6. Pricing / Cost queries
    const pricingKeywords = [
      "price",
      "cost",
      "rate",
      "how much",
      "fee",
      "payment",
      "charge",
      "pricing sheet",
      "expensive",
      "cheap"
    ];
    if (pricingKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "pricing", confidence: 0.92 };
    }

    // 7. Location / Address queries
    const locationKeywords = [
      "where",
      "location",
      "address",
      "directions",
      "office",
      "clinic",
      "salon",
      "map",
      "locate",
      "city",
      "street"
    ];
    if (locationKeywords.some((keyword) => lowercase.includes(keyword))) {
      return { intent: "location", confidence: 0.9 };
    }

    return null;
  },

  async detectIntent(message: string): Promise<IntentResult> {
    // Try rule-based matching first (fast, reliable)
    const ruleMatch = this.detectWithRules(message);
    if (ruleMatch) {
      return ruleMatch;
    }

    // LLM classifier fallback
    try {
      const provider = llmRegistry.getProvider();
      const prompt = `Classify the intent of the following user message into exactly one of: "booking", "pricing", "emergency", "human_request", "location", "reschedule", "cancel", or "general".
Return a JSON object only in the format: { "intent": "...", "confidence": 0.xx }

User Message: "${message}"`;

      const result = await provider.generateCompletion(
        [
          { role: "system", content: "You are an intent classification assistant. Respond only in valid JSON format." },
          { role: "user", content: prompt },
        ],
        { temperature: 0.1, jsonMode: true }
      );

      const parsed = JSON.parse(result.content.trim());
      if (
        parsed.intent &&
        ["booking", "pricing", "emergency", "human_request", "location", "reschedule", "cancel", "general"].includes(parsed.intent)
      ) {
        return {
          intent: parsed.intent as IntentType,
          confidence: parsed.confidence ?? 0.8,
        };
      }
    } catch (error) {
      console.warn("[IntentService] LLM fallback failed, defaulting to general:", error);
    }

    return { intent: "general", confidence: 0.5 };
  },
};
