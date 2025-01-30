# Speechify Player Integration

This repository provides a seamless integration of the Speechify text-to-speech (TTS) service into your web application. The integration allows you to easily initialize and use the Speechify player to convert text content into speech with various customization options.

## Installation

To get started, you need to install the Speechify Embeddable UI and Speechify API SDK packages:

```bash
npm install @speechify/embeddable-ui @speechify/api-sdk
```

or

```bash
yarn add @speechify/embeddable-ui @speechify/api-sdk
```

Please refer to the [Speechify API SDK Documentation](https://speechifyinc.github.io/speechify-api-sdks/nodejs/index.html) for more information on initializing and using the Speechify client.

## Usage

### Importing the Required Modules

First, import the necessary modules in your project:

```typescript
import { initializePlayer } from "./src/player/player.ts";
import { Speechify } from "@speechify/api-sdk";
```

### Initializing the Speechify Client

Create an instance of the Speechify client:

```typescript
const speechify = new Speechify();
```

To use the Speechify API in a browser environment, you need to handle authentication securely. The Speechify client requires a token to authenticate requests and set up a token issuance endpoint on your server. Please refer to the [Speechify API Authentication Documentation](https://docs.sws.speechify.com/docs/authentication) for more information on how to configure the token manager and set up a token issuance endpoint.

### Initializing the Player

Initialize the Speechify player with the Speechify client:

```typescript
initializePlayer(speechify);
```

### Using the Speechify Player Component

You can now use the `<speechify-player>` component in your HTML or JSX to convert text content into speech. The component accepts several attributes for customization:

- `content`: The text content you want to convert to speech.
- `voice-id`: The ID of the voice you want to use (e.g., "george"). You can obtain available `voice-id`s from the [Speechify API Playground](https://console.sws.speechify.com/voices).
- `generation-type`: The type of generation, such as "stream" for real-time streaming or "speech" for a single speech generation.

Example usage:

```html
<speechify-player
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  voice-id="george"
  generation-type="stream"
/>
```

## Configuration Options

### Speechify Player Attributes

- `content` (required): The text content to be converted to speech.
- `voice-id` (required): The ID of the voice to be used for speech generation.
- `generation-type` (optional): The type of generation, such as "stream" for real-time streaming or "speech" for a single speech generation.

## Example

Here is a complete example of how to integrate the Speechify player into your application:

```typescript
import { initializePlayer } from "./src/player/player.ts";
import { Speechify } from "@speechify/api-sdk";

// You need to handle authentication securely by setting up a token issuance endpoint on your server and setting the token manager
const speechify = new Speechify();

initializePlayer(speechify);
```

```html
<speechify-player
  content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  voice-id="george"
  generation-type="stream"
/>
```

## Generation Types

### Speech vs Stream

- **Speech**: This generation type is used for generating a single speech output. It is suitable for scenarios where you need to convert a block of text into speech once, such as for a podcast or an audiobook. The advantage is that it generates a complete audio file that can be saved and reused. The disadvantage is that it may take longer to generate the speech, especially for large texts. Please refer to the [Speechify API Speech Route Documentation](https://docs.sws.speechify.com/reference/getspeech) for more information.

- **Stream**: This generation type is used for real-time streaming of speech. It is suitable for scenarios where you need to convert text to speech on-the-fly, such as for live captions or interactive applications. The advantage is that it provides immediate feedback and can handle large texts efficiently. The disadvantage is that it requires a stable internet connection and may not be suitable for saving the speech output. Please refer to the [Speechify API Stream Route Documentation](https://docs.sws.speechify.com/reference/getstream) for more information.
