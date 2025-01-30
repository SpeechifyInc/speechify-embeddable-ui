import { initializePlayer } from "./src/player/player.ts";
import { Speechify } from "@speechify/api-sdk";

const speechify = new Speechify({
  apiKey: "",
  strict: false,
});

initializePlayer(speechify);
