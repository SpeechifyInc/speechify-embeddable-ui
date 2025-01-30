import type { InitializeSpeechifyPlayerInput } from "./player.types.ts";
import type { ISpeechifyPlayerProps } from "./player.types.ts";
import html from "./player.html?raw";
import playIcon from "./playicon.svg?raw";
import pauseIcon from "./pauseicon.svg?raw";

declare global {
  // for React
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "speechify-player": Partial<ISpeechifyPlayerProps> & {
        ref?: HTMLElement;
      };
    }
  }

  // for plain js and Angular
  interface HTMLElementTagNameMap {
    "speechify-player": HTMLElement & ISpeechifyPlayerProps;
  }

  // for Vue.js
  interface GlobalComponents {
    "speechify-player": ISpeechifyPlayerProps;
  }
}

export const initializePlayer = (speechify: InitializeSpeechifyPlayerInput) => {
  const template = document.createElement("template");
  template.innerHTML = `${html}`;

  class AudioPlayer extends HTMLElement {
    private audioDuration = 0;
    private content = ""; // Initialize with empty value
    private audioElement: HTMLAudioElement;
    private isPlaying = false;
    private isStreaming = false;

    static get observedAttributes() {
      return ["content", "generation-type", "voice-id"];
    }

    get playButton() {
      return this.getElement<HTMLButtonElement>(
        ".speechify-player-btn-inline-play"
      );
    }

    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

      this.audioElement = this.createAudioElement();
      this.addEventListeners();
      this.playButton.addEventListener(
        "click",
        this.togglePlayPause.bind(this)
      );
    }

    connectedCallback() {
      this.content = this.getAttribute("content") ?? "";
      const generationType = this.getAttribute("generation-type") as
        | "speech"
        | "stream";
      const voiceId = this.getAttribute("voice-id") ?? "";

      this.initializeAudioIfParamsExist(generationType, voiceId);
    }

    disconnectedCallback() {
      this.playButton.removeEventListener(
        "click",
        this.togglePlayPause.bind(this)
      );
    }

    attributeChangedCallback(
      name: string,
      _: string | null,
      newValue: string | null
    ) {
      if (!newValue) return;

      switch (name) {
        case "content":
          this.content = newValue;
          const generationType = this.getAttribute("generation-type") as
            | "speech"
            | "stream";
          const voiceId = this.getAttribute("voice-id") ?? "";
          this.initializeAudioIfParamsExist(generationType, voiceId);
          break;
      }
    }

    private getElement<T extends HTMLElement>(selector: string): T {
      const element = this.shadowRoot!.querySelector<T>(selector);
      if (!element) {
        throw new Error(`Element with selector "${selector}" not found.`);
      }
      return element;
    }

    private createAudioElement(): HTMLAudioElement {
      const audioElement = document.createElement("audio");
      audioElement.controls = true;
      audioElement.style.width = "100%";
      audioElement.style.display = "none";
      return audioElement;
    }

    private addEventListeners() {
      this.audioElement.addEventListener(
        "timeupdate",
        this.updateProgressBar.bind(this)
      );
      this.audioElement.addEventListener("ended", this.onAudioEnd.bind(this));

      const progressBarContainer = this.getElement<HTMLDivElement>(
        ".speechify-player-progress-bar-container"
      );
      progressBarContainer.addEventListener(
        "click",
        this.onProgressBarClick.bind(this)
      );
      progressBarContainer.addEventListener(
        "mousedown",
        this.onProgressBarMouseDown.bind(this)
      );
    }

    private initializeAudioIfParamsExist(
      generationType?: "speech" | "stream",
      voiceId?: string
    ) {
      if (!this.content || !generationType || !voiceId) return;

      this.initializeAudio(generationType, voiceId);
    }

    private initializeAudio(
      generationType: "speech" | "stream",
      voiceId: string
    ) {
      this.isStreaming = generationType === "stream";
      if (this.isStreaming) {
        this.getElement<HTMLDivElement>(
          ".speechify-player-total-duration"
        ).innerHTML = "...";
      }
      void (this.isStreaming
        ? this.generateAudioStream(voiceId)
        : this.generateAudio(voiceId));
    }

    private updateProgressBar() {
      const currentTime = this.audioElement.currentTime;
      const duration = this.audioElement.duration;
      const progressPercentage = (currentTime / duration) * 100;

      this.getElement<HTMLDivElement>(
        ".speechify-player-current-progress"
      ).innerHTML = this.formatTime(currentTime);
      this.getElement<HTMLDivElement>(
        ".speechify-player-progress-bar-fill"
      ).style.width = `${progressPercentage}%`;
      this.getElement<HTMLDivElement>(
        ".speechify-player-progress-bar-handle"
      ).style.left = `${progressPercentage}%`;
    }

    private handleProgressBarInteraction(
      clientX: number,
      container: HTMLDivElement
    ) {
      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
      this.audioElement.currentTime = percentage * this.audioDuration;
    }

    private onProgressBarClick(event: MouseEvent) {
      this.handleProgressBarInteraction(
        event.clientX,
        this.getElement<HTMLDivElement>(
          ".speechify-player-progress-bar-container"
        )
      );
    }

    private onProgressBarMouseDown(_event: MouseEvent) {
      const progressContainer = this.getElement<HTMLDivElement>(
        ".speechify-player-progress-bar-container"
      );

      const onMouseMove = (moveEvent: MouseEvent) => {
        this.handleProgressBarInteraction(moveEvent.clientX, progressContainer);
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    private onAudioEnd() {
      this.isPlaying = false;
      this.updatePlayButtonIcon();
    }

    private async generateAudio(voiceId: string) {
      const audio = await speechify.audioGenerate({
        input: this.content,
        voiceId,
      });
      const audioUrl = URL.createObjectURL(audio.audioData);
      this.audioElement.src = audioUrl;

      this.audioElement.onloadedmetadata = () => {
        this.updateDurationDisplay(this.audioElement.duration);
        this.toggleLoadingSpinner(false);
      };
    }

    private async generateAudioStream(voiceId: string) {
      const response = await speechify.audioStream({
        input: this.content,
        voiceId,
      });
      const mediaSource = new MediaSource();
      this.audioElement.src = URL.createObjectURL(mediaSource);
      this.toggleLoadingSpinner(false);

      mediaSource.addEventListener("sourceopen", async () => {
        const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
        const reader = response.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            mediaSource.endOfStream();
            this.handleAudioEnd(chunks);
            break;
          } else {
            await this.appendBuffer(sourceBuffer, value, chunks);
          }
        }
      });
    }

    private toggleLoadingSpinner(isLoading: boolean) {
      this.getElement<HTMLDivElement>(
        ".speechify-player-loading"
      ).style.display = isLoading ? "block" : "none";
      this.playButton.style.display = isLoading ? "none" : "block";
    }

    private async appendBuffer(
      sourceBuffer: SourceBuffer,
      value: Uint8Array,
      chunks: Uint8Array[]
    ) {
      await new Promise<void>((resolve) => {
        sourceBuffer.onupdateend = () => resolve();
        sourceBuffer.appendBuffer(value);
        chunks.push(value);
      });
    }

    private handleAudioEnd(chunks: Uint8Array[]) {
      const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const metaAudioElement = document.createElement("audio");
      metaAudioElement.style.display = "none";
      metaAudioElement.src = audioUrl;

      metaAudioElement.onloadedmetadata = () => {
        this.audioDuration = metaAudioElement.duration;
        this.getElement<HTMLDivElement>(
          ".speechify-player-total-duration"
        ).innerHTML = this.formatTime(metaAudioElement.duration);
      };
    }

    private updateDurationDisplay(duration: number) {
      this.audioDuration = duration;
      if (!this.isStreaming) {
        this.getElement<HTMLDivElement>(
          ".speechify-player-total-duration"
        ).innerHTML = this.formatTime(duration);
      }
    }

    private formatTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    private async togglePlayPause() {
      this.isPlaying = !this.isPlaying;
      this.updatePlayButtonIcon();
      await (this.isPlaying
        ? this.audioElement.play()
        : this.audioElement.pause());
    }

    private updatePlayButtonIcon() {
      this.playButton.innerHTML = this.isPlaying ? pauseIcon : playIcon;
    }
  }

  if (
    typeof window !== "undefined" &&
    !customElements.get("speechify-player")
  ) {
    customElements.define("speechify-player", AudioPlayer);
  }
};
