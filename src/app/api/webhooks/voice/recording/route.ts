import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { callSessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { voicemailProcessor } from "@/server/services/voice/voicemail";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("organizationId");

    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    console.log("[Voice Recording Webhook] Callback body:", JSON.stringify(body));

    const callSid = body.CallSid || "unknown";
    const recordingUrl = body.RecordingUrl;
    const durationStr = body.RecordingDuration || "0";

    if (!orgId) {
      return new NextResponse(
        `<Response><Say>Organization reference missing.</Say><Hangup/></Response>`,
        { status: 200, headers: { "Content-Type": "text/xml" } }
      );
    }

    if (!recordingUrl) {
      console.warn("[Voice Recording Webhook] Callback missed recording url.");
      return new NextResponse(
        `<Response><Say>No recording was detected. Goodbye.</Say><Hangup/></Response>`,
        { status: 200, headers: { "Content-Type": "text/xml" } }
      );
    }

    // Match Call Session by SID
    const session = await db.query.callSessions.findFirst({
      where: eq(callSessions.externalSessionId, callSid),
    });

    if (session) {
      // Process voicemail in background/helper
      await voicemailProcessor.processVoicemail({
        organizationId: orgId,
        sessionId: session.id,
        recordingUrl,
      });

      // Update call session
      await db
        .update(callSessions)
        .set({
          status: "voicemail",
          durationSeconds: parseInt(durationStr, 10) || 0,
          endedReason: "voicemail-recorded",
          updatedAt: new Date(),
        })
        .where(eq(callSessions.id, session.id));
    } else {
      console.warn(`[Voice Recording Webhook] No call session found matching external call SID: ${callSid}`);
    }

    return new NextResponse(
      `<Response><Say>Thank you. Your message has been saved. Goodbye.</Say><Hangup/></Response>`,
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  } catch (error: any) {
    console.error("[Voice Recording Webhook] Failed to save recording:", error);
    return new NextResponse(
      `<Response><Say>We encountered an error saving your recording. Goodbye.</Say><Hangup/></Response>`,
      { status: 200, headers: { "Content-Type": "text/xml" } }
    );
  }
}
