import { TextToSpeechProvider, VoiceProviderRegistry } from "./types";

export class ElevenLabsTtsProvider implements TextToSpeechProvider {
  id = "tts-elevenlabs";
  name = "ElevenLabs Voice Synthesis";

  async synthesizeText(
    text: string,
    voiceName?: string,
    speed?: string
  ): Promise<{ audioBuffer: Buffer; mimeType: string }> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.warn("[ElevenLabs TTS] ELEVENLABS_API_KEY is not configured. Returning mock audio buffer.");
      return {
        audioBuffer: Buffer.from("mock-mpeg-audio-bytes"),
        mimeType: "audio/mpeg",
      };
    }

    try {
      // Mapping voice names to common ElevenLabs voice IDs
      const voiceId = voiceName === "Rachel" ? "21m00Tcm4TlvDq8ikWAM" : "21m00Tcm4TlvDq8ikWAM"; 

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`ElevenLabs API returned HTTP ${response.status}: ${errText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(arrayBuffer);

      return {
        audioBuffer,
        mimeType: "audio/mpeg",
      };
    } catch (e: any) {
      console.error("[ElevenLabs TTS] Synthesis request failed:", e);
      throw e;
    }
  }
}

// Auto-register provider
VoiceProviderRegistry.registerTTS(new ElevenLabsTtsProvider());
