import { TelephonyProvider, CallTransferOptions, VoiceProviderRegistry } from "./types";

export class GenericTelephonyProvider implements TelephonyProvider {
  id = "telephony-generic";
  name = "Voice Telephony Service";

  async initiateOutboundCall(
    organizationId: string,
    connectionConfig: Record<string, any>,
    to: string,
    from: string,
    streamUrl: string
  ): Promise<{ success: boolean; externalCallId?: string; error?: string }> {
    try {
      const mockCallSid = "CA" + Math.random().toString(36).substring(2, 16);
      return {
        success: true,
        externalCallId: mockCallSid
      };
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Telephony request failed"
      };
    }
  }

  async transferCall(
    externalCallId: string,
    options: CallTransferOptions
  ): Promise<{ success: boolean; error?: string }> {
    try {
      return {
        success: true
      };
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || "Telephony transfer failed"
      };
    }
  }

  async hangUpCall(externalCallId: string): Promise<boolean> {
    return true;
  }
}

// Auto-register provider
VoiceProviderRegistry.registerTelephony(new GenericTelephonyProvider());
