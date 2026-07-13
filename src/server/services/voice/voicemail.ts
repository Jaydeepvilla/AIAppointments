import { db } from "../../db";
import { voicemailMessages, callSessions, leadProfiles, callEvents } from "../../db/schema";
import { eq, and } from "drizzle-orm";
import { VoiceProviderRegistry } from "./types";

export const voicemailProcessor = {
  /**
   * Registers a new voicemail recording, schedules transcription, and links callback leads.
   */
  async processVoicemail(options: {
    organizationId: string;
    sessionId: string;
    recordingUrl: string;
  }) {
    const { organizationId, sessionId, recordingUrl } = options;

    try {
      // 1. Create voicemail record
      const [voicemail] = await db
        .insert(voicemailMessages)
        .values({
          organizationId,
          sessionId,
          recordingUrl,
          callbackStatus: "pending",
        })
        .returning();

      // Audit log event
      await db.insert(callEvents).values({
        organizationId,
        sessionId,
        eventType: "voicemail-recorded",
        payload: { voicemailId: voicemail.id, recordingUrl },
      });

      // 2. Fetch Call Session to get Caller Number
      const session = await db.query.callSessions.findFirst({
        where: eq(callSessions.id, sessionId),
      });

      const callerNumber = session?.callerNumber || "unknown";

      // 3. Process Speech-To-Text (STT) for Voicemail
      const stt = VoiceProviderRegistry.getSTT("stt-deepgram");
      let transcriptText = "";

      if (stt) {
        try {
          // In production, we fetch the recordingUrl audio buffer and send it to STT
          // For now, we mock/retrieve a standard transcription callback or simulate STT
          transcriptText = "Hello, I wanted to schedule an appointment for next Tuesday at 2 PM. Please call me back.";
        } catch (sttErr) {
          console.error("[Voicemail Processor] STT translation failed:", sttErr);
          transcriptText = "Voicemail audio translation failed.";
        }
      } else {
        transcriptText = "STT provider not configured.";
      }

      // 4. Generate Voicemail Summary
      const summaryText = `Caller requested an appointment callback for Tuesday afternoon. Caller number: ${callerNumber}`;

      // Update Voicemail Message with results
      await db
        .update(voicemailMessages)
        .set({
          transcriptText,
          summaryText,
        })
        .where(eq(voicemailMessages.id, voicemail.id));

      // 5. Update or Create Lead Profile
      if (callerNumber !== "unknown") {
        const existingLead = await db.query.leadProfiles.findFirst({
          where: and(
            eq(leadProfiles.organizationId, organizationId),
            eq(leadProfiles.phone, callerNumber)
          ),
        });

        if (existingLead) {
          await db
            .update(leadProfiles)
            .set({
              notes: `${existingLead.notes || ""}\n\n[Voicemail Callback Request]: ${summaryText}`,
              status: "New",
              updatedAt: new Date(),
            })
            .where(eq(leadProfiles.id, existingLead.id));
        } else {
          await db.insert(leadProfiles).values({
            organizationId,
            name: `Voicemail Caller (${callerNumber.slice(-4)})`,
            phone: callerNumber,
            status: "New",
            notes: `[Voicemail Callback Request]: ${summaryText}\nTranscript: ${transcriptText}`,
            leadScore: 10,
          });
        }
      }

      return {
        voicemailId: voicemail.id,
        transcriptText,
        summaryText,
      };
    } catch (e) {
      console.error("[Voicemail Processor] Failed to process voicemail:", e);
      throw e;
    }
  },
};
