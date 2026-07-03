import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { channelConnections, channelMessages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ProviderRegistry } from "@/server/services/omnichannel/types";
import { omnichannelRouter } from "@/server/services/omnichannel/router";

// Auto import/trigger registry files to compile decorators
import "@/server/services/omnichannel/twilio";

export async function POST(req: NextRequest) {
  try {
    // Twilio sends application/x-www-form-urlencoded payloads
    const formData = await req.formData();
    const body: Record<string, string> = {};
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });

    console.log("[Twilio Webhook] Inbound request parsed:", JSON.stringify(body));

    // To verify which connection and organization this Twilio payload belongs to,
    // match the recipient phone number (body.To) or Twilio Sid
    const recipientNumber = body.To || "";
    if (!recipientNumber) {
      return NextResponse.json({ error: "Missing recipient metadata (To)" }, { status: 400 });
    }

    // Match connection
    const connection = await db.query.channelConnections.findFirst({
      where: eq(channelConnections.externalId, recipientNumber),
      with: {
        channel: true
      }
    });

    if (!connection) {
      console.warn(`[Twilio Webhook] No active Twilio connection matches recipient number: ${recipientNumber}`);
      return NextResponse.json({ error: "Unregistered phone number destination" }, { status: 404 });
    }

    const provider = ProviderRegistry.getWebhookProvider("sms-twilio");
    if (!provider) {
      return NextResponse.json({ error: "Twilio webhook provider not registered" }, { status: 500 });
    }

    // Mapped headers context
    const headers: Record<string, string> = {
      "x-organization-id": connection.organizationId,
      "x-channel-id": connection.channelId
    };

    const result = await provider.processIncomingWebhook(headers, body);

    // Route messages into the system
    for (const msg of result.messages) {
      await omnichannelRouter.routeIncomingMessage(msg);
    }

    // Route delivery receipt status
    for (const stat of result.statuses) {
      await db
        .update(channelMessages)
        .set({ 
          status: stat.status, 
          updatedAt: stat.updatedAt 
        })
        .where(eq(channelMessages.externalId, stat.externalMessageId));
    }

    // Twilio expects a valid TwiML XML response.
    // Return empty TwiML <Response/> to signify message has been consumed.
    return new NextResponse("<Response></Response>", {
      status: 200,
      headers: { "Content-Type": "text/xml" }
    });
  } catch (error: any) {
    console.error("[Twilio Webhook] Failed to process incoming request:", error);
    return NextResponse.json({ error: error?.message || "Internal processing error" }, { status: 500 });
  }
}
