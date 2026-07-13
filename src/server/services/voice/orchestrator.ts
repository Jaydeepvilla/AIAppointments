import { db } from "../../db";
import { 
  callSessions, 
  callEvents, 
  callTranscripts, 
  callSummaries,
  conversations, 
  conversationMessages 
} from "../../db/schema";
import { eq, and, asc } from "drizzle-orm";
import { orchestratorService } from "../orchestrator";
import { VoiceProviderRegistry } from "./types";

// Auto imports for self-registration of registry hooks
import "./twilio";
import "./deepgram";
import "./elevenlabs";
import "./vapi";

export const voiceOrchestrator = {
  /**
   * 1. Initialize call session in DB when an inbound call starts
   */
  async handleInboundCall(options: {
    organizationId: string;
    phoneNumberId: string;
    externalSessionId: string; // Twilio Call SID
    callerNumber: string;
    recipientNumber: string;
  }) {
    try {
      // Create central conversation
      const [conv] = await db
        .insert(conversations)
        .values({
          organizationId: options.organizationId,
          status: "active",
          metadata: { channel: "voice", callSid: options.externalSessionId }
        })
        .returning();

      // Create Call Session
      const [session] = await db
        .insert(callSessions)
        .values({
          organizationId: options.organizationId,
          phoneNumberId: options.phoneNumberId,
          direction: "inbound",
          externalSessionId: options.externalSessionId,
          callerNumber: options.callerNumber,
          recipientNumber: options.recipientNumber,
          status: "in-progress"
        })
        .returning();

      // Event audit log
      await db.insert(callEvents).values({
        organizationId: options.organizationId,
        sessionId: session.id,
        eventType: "ringing"
      });

      return { sessionId: session.id, conversationId: conv.id };
    } catch (e) {
      console.error("[Voice Orchestrator] handleInboundCall failed:", e);
      throw e;
    }
  },

  /**
   * 2. Process recognized speech segment (from deepgram/whisper)
   */
  async processStreamingSpeech(options: {
    organizationId: string;
    sessionId: string;
    conversationId: string;
    speaker: "caller" | "agent";
    content: string;
  }): Promise<{ audioBuffer?: Buffer; textResponse: string }> {
    const { organizationId, sessionId, conversationId, speaker, content } = options;

    try {
      // Save transcript line
      await db.insert(callTranscripts).values({
        organizationId,
        sessionId,
        speaker,
        content,
        confidence: "1.0",
        relativeStartTime: 0,
        relativeEndTime: 0
      });

      // Save to standard conversation messages
      await db.insert(conversationMessages).values({
        organizationId,
        conversationId,
        sender: speaker === "caller" ? "user" : "assistant",
        content,
        confidenceScore: "1.0"
      });

      // Event log
      await db.insert(callEvents).values({
        organizationId,
        sessionId,
        eventType: "speech-to-text",
        payload: { speaker, content }
      });

      if (speaker === "agent") {
        return { textResponse: content };
      }

      // If user speech, trigger central AI Receptionist orchestrator to get reply
      const aiResponse = await orchestratorService.processMessage({
        organizationId,
        conversationId,
        userMessage: content,
        metadata: { callSessionId: sessionId }
      });

      // Synthesize audio reply via TextToSpeech Provider
      const tts = VoiceProviderRegistry.getTTS("tts-elevenlabs");
      let audioBuffer: Buffer | undefined = undefined;

      if (tts) {
        const synth = await tts.synthesizeText(aiResponse.assistantMessage);
        audioBuffer = synth.audioBuffer;
      }

      // Save agent's reply transcript and conversation logs
      await db.insert(callTranscripts).values({
        organizationId,
        sessionId,
        speaker: "agent",
        content: aiResponse.assistantMessage,
        confidence: "1.0",
        relativeStartTime: 0,
        relativeEndTime: 0
      });

      await db.insert(conversationMessages).values({
        organizationId,
        conversationId,
        sender: "assistant",
        content: aiResponse.assistantMessage,
        confidenceScore: "1.0"
      });

      await db.insert(callEvents).values({
        organizationId,
        sessionId,
        eventType: "text-to-speech",
        payload: { response: aiResponse.assistantMessage }
      });

      return {
        audioBuffer,
        textResponse: aiResponse.assistantMessage
      };

    } catch (e) {
      console.error("[Voice Orchestrator] processStreamingSpeech failed:", e);
      throw e;
    }
  },

  /**
   * 3. End Call session, generate summary and finalize metrics
   */
  async endCallSession(options: {
    organizationId: string;
    sessionId: string;
    durationSeconds: number;
    endedReason: string;
  }) {
    const { organizationId, sessionId, durationSeconds, endedReason } = options;

    try {
      // Update Call Session status
      await db
        .update(callSessions)
        .set({
          status: "completed",
          durationSeconds,
          endedReason,
          updatedAt: new Date()
        })
        .where(eq(callSessions.id, sessionId));

      await db.insert(callEvents).values({
        organizationId,
        sessionId,
        eventType: "completed"
      });

      // Fetch transcripts to construct final summary
      const transcripts = await db.query.callTranscripts.findMany({
        where: eq(callTranscripts.sessionId, sessionId),
        orderBy: [asc(callTranscripts.createdAt)]
      });

      const transcriptStr = transcripts
        .map((t) => `${t.speaker.toUpperCase()}: ${t.content}`)
        .join("\n");

      // Generate mock summary and outcome logs
      // In production, this runs a post-call LLM summarizer prompt
      const summaryText = transcriptStr.trim() 
        ? `The caller discussed pricing structures and requested services overview.` 
        : `Empty call session. Call hung up immediately.`;

      await db
        .insert(callSummaries)
        .values({
          organizationId,
          sessionId,
          summary: summaryText,
          actionItems: ["Review appointment preferences"],
          outcome: transcripts.length > 5 ? "general-info" : "abandoned",
          bookingStatus: "none",
          escalationStatus: "none"
        });

    } catch (e) {
      console.error("[Voice Orchestrator] endCallSession failed:", e);
    }
  }
};
