import { TelephonyProvider, CallTransferOptions, VoiceProviderRegistry } from "./types";

export class TwilioTelephonyProvider implements TelephonyProvider {
  id = "telephony-twilio";
  name = "Twilio Telephony Service";

  async initiateOutboundCall(
    organizationId: string,
    connectionConfig: Record<string, any>,
    to: string,
    from: string,
    streamUrl: string
  ): Promise<{ success: boolean; externalCallId?: string; error?: string }> {
    try {
      const accountSid = connectionConfig.accountSid || "mock-sid";
      const authToken = connectionConfig.authToken || "mock-token";
      
      console.log(`[Twilio Telephony] Triggering outbound call to ${to} from ${from} streaming to websocket: ${streamUrl}`);
      
      // In production, this imports Twilio client and triggers:
      // client.calls.create({ url: streamUrl, to, from })
      const mockCallSid = "CA" + Math.random().toString(36).substring(2, 16);

      return {
        success: true,
        externalCallId: mockCallSid
      };
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Twilio call API request failed"
      };
    }
  }

  async transferCall(
    externalCallId: string,
    options: CallTransferOptions
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const target = options.targetNumber || options.targetStaffId || "receptionist";
      console.log(`[Twilio Telephony] Executing call transfer for Call SID ${externalCallId} to target: ${target} (${options.transferType} transfer)`);
      
      // In production, this updates call TwiML scripts using Twilio Call Client:
      // client.calls(externalCallId).update({ twiml: `<Response><Dial>${target}</Dial></Response>` })

      return {
        success: true
      };
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Twilio transfer API update failed"
      };
    }
  }

  async hangUpCall(externalCallId: string): Promise<boolean> {
    try {
      console.log(`[Twilio Telephony] Hanging up Call SID: ${externalCallId}`);
      // In production: client.calls(externalCallId).update({ status: 'completed' })
      return true;
    } catch (e) {
      console.error("[Twilio Telephony] Hangup failed:", e);
      return false;
    }
  }
}

// Auto-register provider
VoiceProviderRegistry.registerTelephony(new TwilioTelephonyProvider());
