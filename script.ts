import { initializePlayer } from "./src/player/player.ts";

initializePlayer({
  audioGenerate: (...args) => {
    console.log(args);
  },
  audioStream: (...args) => {
    console.log(args);
  },
});
