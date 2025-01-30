import type { Speechify } from "@speechify/api-sdk";

export interface ISpeechifyPlayerProps {
  content: string;
  "voice-id": string;
  "generation-type": "audio" | "stream";
}

export type InitializeSpeechifyPlayerInput = Pick<
  Speechify,
  "audioGenerate" | "audioStream"
>;
