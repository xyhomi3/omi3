# `@omi3/audio`

![Version](https://img.shields.io/github/package-json/v/xyhomi3/omi3?filename=packages%2Faudio%2Fpackage.json)

A flexible audio management library for web applications.

## Features

- Simple API for audio playback control
- Support for loading and playing audio files
- Volume control and seeking functionality
- Event-driven architecture for easy integration
- Built-in audio analysis capabilities

## Installation

Install the package using npm or yarn:

```bash
npm install @omi3/audio
```

or

```bash
pnpm add @omi3/audio
```

## Usage

Here's a basic example of how to use the library:

```ts
import { AudioChannel, EventHandler, Music } from '@omi3/audio';

const eventHandler: EventHandler = {
onPlay: () => console.log('Audio started playing'),
onPause: () => console.log('Audio paused'),
onEnded: () => console.log('Audio playback ended'),
onTimeUpdate: (time) => console.log(Current time: ${time}),
onError: (error) => console.error('Audio error:', error),
};
const audioChannel = new AudioChannel(eventHandler);
const music: Music = {
id: '1',
name: 'My Audio',
url: 'https://example.com/audio.mp3',
};
async function playAudio() {
await audioChannel.initialize();
await audioChannel.load(music);
await audioChannel.play();
}
playAudio();
```

## API Reference

### AudioChannel

The main class for managing audio playback.

#### Constructor

```typescript
constructor(eventHandler: EventHandler, audioContextFactory?: () => AudioContext)
```

- `eventHandler`: An object implementing the `EventHandler` interface.
- `audioContextFactory`: (Optional) A function that returns an `AudioContext` instance.

#### Methods

- `initialize(): Promise<void>`: Initializes the audio context and sets up audio processing.
- `load(music: Music): Promise<void>`: Loads an audio file and prepares it for playback.
- `play(): Promise<void>`: Starts or resumes audio playback.
- `pause(): void`: Pauses audio playback.
- `seek(time: number): void`: Seeks to a specific time in the audio.
- `setVolume(volume: number): void`: Sets the volume of the audio (0 to 1).
- `isPlaying(): boolean`: Checks if audio is currently playing.
- `dispose(): void`: Disposes of the audio channel and releases resources.

### EventHandler

An interface for handling audio events.

```typescript
interface EventHandler {
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
  onError?: (error: Error) => void;
  onAnalyserCreated?: (analyser: AnalyserNode) => void;
}
```

### Music

A simple interface for representing music data.

```typescript
interface Music {
  id: string;
  name: string;
  url: string;
}
```

## Advanced Usage

### Audio Analysis

The `AudioChannel` class provides access to an `AnalyserNode` for audio visualization or analysis:

```typescript
const eventHandler: EventHandler = {
  onAnalyserCreated: (analyser: AnalyserNode) => {
    // Use the analyser node for visualizations or further audio processing
    console.log('Analyser created:', analyser);
  },
};
const audioChannel = new AudioChannel(eventHandler);
```

### Custom Audio Context

You can provide a custom audio context factory to the `AudioChannel` constructor:

```typescript
const customAudioContextFactory = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)({
    latencyHint: 'interactive',
    sampleRate: 44100,
  });
};
const audioChannel = new AudioChannel(eventHandler, customAudioContextFactory);
```

## Browser Compatibility

This library uses the Web Audio API, which is supported in all modern browsers. For older browsers, consider using a polyfill or fallback solution.

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

This project is licensed under Apache-2.0 - see the [LICENSE](LICENSE) file for details.
