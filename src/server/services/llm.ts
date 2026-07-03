export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionResult {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  generateCompletion(
    messages: ChatMessage[],
    options?: { temperature?: number; jsonMode?: boolean }
  ): Promise<LLMCompletionResult>;
}

export class OpenAIProvider implements LLMProvider {
  constructor(private apiKey?: string) { }

  async generateCompletion(
    messages: ChatMessage[],
    options?: { temperature?: number; jsonMode?: boolean }
  ): Promise<LLMCompletionResult> {
    if (!this.apiKey) {
      throw new Error("OpenAI API Key is missing");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: options?.temperature ?? 0.7,
          response_format: options?.jsonMode ? { type: "json_object" } : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content || "",
        provider: "openai",
        model: data.model || "gpt-4o-mini",
        usage: {
          promptTokens: data.usage?.prompt_tokens ?? 0,
          completionTokens: data.usage?.completion_tokens ?? 0,
          totalTokens: data.usage?.total_tokens ?? 0,
        },
      };
    } catch (error: any) {
      console.error("[OpenAIProvider] Error generating completion:", error);
      throw error;
    }
  }
}

export class AnthropicProvider implements LLMProvider {
  constructor(private apiKey?: string) { }

  async generateCompletion(
    messages: ChatMessage[],
    options?: { temperature?: number; jsonMode?: boolean }
  ): Promise<LLMCompletionResult> {
    if (!this.apiKey) {
      throw new Error("Anthropic API Key is missing");
    }

    try {
      const systemMsg = messages.find((m) => m.role === "system")?.content || "";
      const remainingMsgs = messages.filter((m) => m.role !== "system");

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-latest",
          system: systemMsg,
          messages: remainingMsgs,
          max_tokens: 1024,
          temperature: options?.temperature ?? 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content[0]?.text || "",
        provider: "anthropic",
        model: "claude-3-5-haiku-latest",
        usage: {
          promptTokens: data.usage?.input_tokens ?? 0,
          completionTokens: data.usage?.output_tokens ?? 0,
          totalTokens: (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
        },
      };
    } catch (error: any) {
      console.error("[AnthropicProvider] Error generating completion:", error);
      throw error;
    }
  }
}

export class GeminiProvider implements LLMProvider {
  constructor(private apiKey?: string) { }

  async generateCompletion(
    messages: ChatMessage[],
    options?: { temperature?: number; jsonMode?: boolean }
  ): Promise<LLMCompletionResult> {
    if (!this.apiKey) {
      throw new Error("Gemini API Key is missing");
    }

    try {
      // Map OpenAI messages role to Gemini
      const systemPrompt = messages.find((m) => m.role === "system")?.content;
      const contents = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
          generationConfig: {
            temperature: options?.temperature ?? 0.7,
            responseMimeType: options?.jsonMode ? "application/json" : "text/plain",
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        provider: "gemini",
        model: "gemini-2.5-flash",
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: data.usageMetadata?.totalTokenCount ?? 0,
        },
      };
    } catch (error: any) {
      console.error("[GeminiProvider] Error generating completion:", error);
      throw error;
    }
  }
}

export class MockLLMProvider implements LLMProvider {
  async generateCompletion(
    messages: ChatMessage[],
    options?: { temperature?: number; jsonMode?: boolean }
  ): Promise<LLMCompletionResult> {
    const userMsg = messages[messages.length - 1]?.content || "";
    const systemPrompt = messages.find((m) => m.role === "system")?.content || "";

    // Determine intent or context from messages
    let content = "Hello! How can I assist you with Operatortoday?";

    const lowercaseMsg = userMsg.toLowerCase();

    // Context analysis
    const isDental = systemPrompt.toLowerCase().includes("dental") || systemPrompt.toLowerCase().includes("dentist");
    const isSalon = systemPrompt.toLowerCase().includes("salon") || systemPrompt.toLowerCase().includes("hair") || systemPrompt.toLowerCase().includes("stylist");
    const isLaw = systemPrompt.toLowerCase().includes("law") || systemPrompt.toLowerCase().includes("attorney") || systemPrompt.toLowerCase().includes("legal");
    const isSpa = systemPrompt.toLowerCase().includes("spa") || systemPrompt.toLowerCase().includes("massage");
    const isGym = systemPrompt.toLowerCase().includes("gym") || systemPrompt.toLowerCase().includes("fitness") || systemPrompt.toLowerCase().includes("workout");
    const isRealEstate = systemPrompt.toLowerCase().includes("real estate") || systemPrompt.toLowerCase().includes("property") || systemPrompt.toLowerCase().includes("agent");
    const isConsultant = systemPrompt.toLowerCase().includes("consultant") || systemPrompt.toLowerCase().includes("coaching") || systemPrompt.toLowerCase().includes("strategy");
    const isMedical = systemPrompt.toLowerCase().includes("medical") || systemPrompt.toLowerCase().includes("doctor") || systemPrompt.toLowerCase().includes("clinic");

    // Dynamic response generation
    if (options?.jsonMode) {
      // If we are evaluating intent, classification, lead scores or summaries
      if (lowercaseMsg.includes("intent") || lowercaseMsg.includes("classify")) {
        let intent = "general";
        if (lowercaseMsg.includes("book") || lowercaseMsg.includes("appoint") || lowercaseMsg.includes("schedule") || lowercaseMsg.includes("visit")) {
          intent = "booking";
        } else if (lowercaseMsg.includes("price") || lowercaseMsg.includes("cost") || lowercaseMsg.includes("rate") || lowercaseMsg.includes("fee")) {
          intent = "pricing";
        } else if (lowercaseMsg.includes("emergency") || lowercaseMsg.includes("pain") || lowercaseMsg.includes("hurt") || lowercaseMsg.includes("bleeding")) {
          intent = "emergency";
        } else if (lowercaseMsg.includes("human") || lowercaseMsg.includes("agent") || lowercaseMsg.includes("speak to") || lowercaseMsg.includes("person") || lowercaseMsg.includes("talk to a real")) {
          intent = "human_request";
        } else if (lowercaseMsg.includes("where") || lowercaseMsg.includes("location") || lowercaseMsg.includes("address") || lowercaseMsg.includes("map")) {
          intent = "location";
        }
        content = JSON.stringify({ intent, confidence: 0.95 });
      } else if (lowercaseMsg.includes("score") || lowercaseMsg.includes("evaluate")) {
        content = JSON.stringify({
          score: lowercaseMsg.includes("urg") || lowercaseMsg.includes("now") || lowercaseMsg.includes("emergency") ? 75 : 45,
          breakdown: {
            serviceInterest: lowercaseMsg.includes("dental") || lowercaseMsg.includes("cleaning") || lowercaseMsg.includes("cut") ? 20 : 10,
            urgency: lowercaseMsg.includes("now") || lowercaseMsg.includes("emergency") || lowercaseMsg.includes("soon") ? 25 : 10,
            answerCompleteness: lowercaseMsg.includes("email") || lowercaseMsg.includes("@") || lowercaseMsg.includes("phone") ? 30 : 15,
          },
        });
      } else if (lowercaseMsg.includes("summary") || lowercaseMsg.includes("summarize")) {
        content = JSON.stringify({
          summaryText: "Customer inquired about scheduling a new appointment and asked about service pricing.",
          actionItems: ["Contact client to confirm a scheduled slot once integrations are live", "Follow up on pricing sheet questions"],
          intentsList: ["booking", "pricing"],
        });
      } else {
        content = JSON.stringify({ message: "Success", details: "Mock JSON Response" });
      }
    } else {
      // Normal chat completion
      if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi ") || lowercaseMsg.includes("hey")) {
        if (isDental) {
          content = "Hello! Welcome to our Dental Clinic. I can help answer questions about our treatments, check pricing, or guide you through scheduling a dental visit. How can I help you today?";
        } else if (isSalon) {
          content = "Hi there! Welcome to our Salon. Looking for a new haircut, color, or styling service? I can answer questions about our services or help you get scheduled. What can I do for you today?";
        } else if (isLaw) {
          content = "Welcome to our Law Firm. If you need legal assistance, I can answer common queries or capture your details for a consultation with one of our attorneys. What legal matter can we assist you with?";
        } else {
          content = "Hello! Thanks for reaching out. How can I assist you with our services or help you schedule an appointment today?";
        }
      } else if (lowercaseMsg.includes("price") || lowercaseMsg.includes("cost") || lowercaseMsg.includes("how much")) {
        if (isDental) {
          content = "Our standard teeth cleaning starts at $99. Fillings range from $150 to $300, and consultations are $75. Would you like to schedule an appointment for any of these?";
        } else if (isSalon) {
          content = "Our haircuts start at $45, coloring starts at $90, and a blow dry is $35. Which service were you interested in checking out today?";
        } else if (isLaw) {
          content = "Initial consultations start at $150. Hourly rates vary depending on the attorney and complexity of the case. I'd be glad to collect your contact information so our team can follow up with a detailed quote. Would you like that?";
        } else {
          content = "Our pricing is very competitive and depends on the specific service. Let me know which service you are interested in, and I'll give you details, or I can help you schedule an appointment.";
        }
      } else if (lowercaseMsg.includes("book") || lowercaseMsg.includes("appoint") || lowercaseMsg.includes("schedule") || lowercaseMsg.includes("visit")) {
        content = "I would be happy to help you book that. First, could you please provide your full name?";
      } else if (lowercaseMsg.includes("emergency") || lowercaseMsg.includes("pain") || lowercaseMsg.includes("hurt") || lowercaseMsg.includes("bleeding")) {
        content = "I understand this is an emergency. If you are experiencing severe pain or bleeding, please call us directly or visit the nearest urgent care immediately. Let me get a human agent to review this conversation right away.";
      } else if (lowercaseMsg.includes("human") || lowercaseMsg.includes("speak to") || lowercaseMsg.includes("talk to a person")) {
        content = "I've flagged this conversation for a human team member. They will look over the chat history and reach out to you shortly. Is there anything else I can capture for them in the meantime?";
      } else if (lowercaseMsg.includes("where") || lowercaseMsg.includes("location") || lowercaseMsg.includes("address")) {
        content = "We are located at 100 Main Street, Suite 500. We have convenient parking out front. You can also view directions on our website. Hope to see you soon!";
      } else {
        // General conversational response using matching industry words
        if (isDental) {
          content = "We offer a wide range of dental care, from routine cleanings to cosmetic dentistry and root canals. What treatment or concern can I address for you?";
        } else if (isSalon) {
          content = "Our specialists are trained in the latest styling trends and color techniques. Let me know if you would like to book a specific stylist or inquire about standard services!";
        } else if (isLaw) {
          content = "We specialize in corporate law, family law, and estate planning. I can register your inquiry for a callback. Would you like to leave your name and contact details?";
        } else {
          content = "I have recorded that. I can provide details about our services or help you schedule a callback. What would you prefer?";
        }
      }
    }

    return {
      content,
      provider: "mock",
      model: "mock-llm-1.0",
      usage: {
        promptTokens: Math.ceil(systemPrompt.length / 4) + Math.ceil(userMsg.length / 4),
        completionTokens: Math.ceil(content.length / 4),
        totalTokens: Math.ceil((systemPrompt.length + userMsg.length + content.length) / 4),
      },
    };
  }
}

export const llmRegistry = {
  getProvider(): LLMProvider {
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openaiKey) return new OpenAIProvider(openaiKey);
    if (anthropicKey) return new AnthropicProvider(anthropicKey);
    if (geminiKey) return new GeminiProvider(geminiKey);

    return new MockLLMProvider();
  },
};
