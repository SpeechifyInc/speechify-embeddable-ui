# Speechify Player Integration

This repository provides a seamless integration of the Speechify text-to-speech (TTS) service into your web application. The integration allows you to easily initialize and use the Speechify player to convert text content into speech with various customization options.

## Installation

To get started, you need to install the Speechify Embeddable UI package:

```bash
npm install @speechify/embeddable-ui
```

or

```bash
yarn add @speechify/embeddable-ui
```

You also need to install the Speechify API SDK, please refer to the [Speechify API SDK DOCUMENTATION](https://speechifyinc.github.io/speechify-api-sdks/nodejs/index.html) for more information on initializing and using the Speechify client.

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

### Initializing the Player

Initialize the Speechify player with the Speechify client:

```typescript
initializePlayer(speechify);
```

### Using the Speechify Player Component

You can now use the `<speechify-player>` component in your HTML or JSX to convert text content into speech. The component accepts several attributes for customization:

- `content`: The text content you want to convert to speech.
- `voice-id`: The ID of the voice you want to use (e.g., "george").
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
