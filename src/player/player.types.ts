export interface ISpeechifyPlayerProps {
  content: string;
  "voice-id": string;
  "generation-type": "audio" | "stream";
}

export type InitializeSpeechifyPlayerInput = Pick<
  any,
  "audioGenerate" | "audioStream"
>;
