import { SpeechToTextProvider, VoiceProviderRegistry } from "./types";

export class DeepgramSttProvider implements SpeechToTextProvider {
  id = "stt-deepgram";
  name = "Deepgram Streaming STT";

  async processAudioStream(
    audioChunk: Buffer
  ): Promise<{ text: string; isFinal: boolean; confidence: number }> {
    try {
      // In production, this relays the raw audio bytes (usually u-law or pcm) over a persistent WebSocket connection to Deepgram's streaming API.
      // Deepgram returns partial and final transcripts.
      
      // Stub returning empty mock triggers
      return {
        text: "",
        isFinal: false,
        confidence: 1.0
      };
    } catch (e) {
      console.error("[Deepgram STT] Stream processing failed:", e);
      return { text: "", isFinal: false, confidence: 0.0 };
    }
  }
}

// Auto-register provider
VoiceProviderRegistry.registerSTT(new DeepgramSttProvider());
