import { Music } from '../types';

/**
 * Interface for the audio channel event handler.
 * Defines callbacks for various audio events.
 */
export interface EventHandler {
  /** Invoked when audio playback starts */
  onPlay?: () => void;
  /** Invoked when audio playback is paused */
  onPause?: () => void;
  /** Invoked when audio playback is stopped */
  onStop?: () => void;
  /** Invoked when audio playback reaches the end */
  onEnded?: () => void;
  /** Invoked periodically with the current playback time (in seconds) */
  onTimeUpdate?: (time: number) => void;
  /** Invoked when the audio duration is known or has changed (in seconds) */
  onDurationChange?: (duration: number) => void;
  /** Invoked when an error occurs during audio operations */
  onError?: (error: Error) => void;
  /** Invoked when the audio analyser node is created */
  onAnalyserCreated?: (analyser: AnalyserNode) => void;
  /** Invoked when the play state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Invoked when the audio is seeked to a specific time */
  onSeek?: (time: number) => void;
  /** Invoked when the audio buffer is loaded and decoded */
  onBufferLoaded?: (buffer: AudioBuffer) => void;
}

/**
 * Interface for the audio channel.
 * Defines the main operations that can be performed on an audio channel.
 */
export interface AudioChannel {
  /** Loads an audio file and prepares it for playback */
  load: (music: Music) => Promise<void>;
  /** Starts or resumes audio playback */
  play: () => Promise<void>;
  /** Pauses audio playback */
  pause: () => void;
  /** Seeks to a specific time in the audio (in seconds) */
  seek: (time: number) => void;
  /** Checks if audio is currently playing */
  isPlaying: () => boolean;
  /** Disposes of the audio channel and releases resources */
  dispose: () => void;
  /** Sets the volume of the audio channel (0 to 1) */
  setVolume: (volume: number) => void;
  /** Gets the current playback time (in seconds) */
  getCurrentTime: () => number;
  /** Gets the total duration of the loaded audio (in seconds) */
  getDuration: () => number;
  /** Connects the audio channel to an AudioNode or AudioParam */
  connect: (destination: AudioNode | AudioParam) => void;
  /** Disconnects the audio channel from all or specific destinations */
  disconnect: (destination?: AudioNode | AudioParam) => void;
}
