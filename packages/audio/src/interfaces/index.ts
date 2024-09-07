import { Music } from '../types';

/**
 * Interface for the audio channel event handler.
 * Defines callbacks for various audio events.
 */
export interface EventHandler {
  /** Called when audio playback starts */
  onPlay?: () => void;
  /** Called when audio playback is paused */
  onPause?: () => void;
  /** Called when audio playback is stopped */
  onStop?: () => void;
  /** Called when audio playback ends */
  onEnded?: () => void;
  /** Called periodically with the current playback time */
  onTimeUpdate?: (time: number) => void;
  /** Called when the audio duration is known or has changed */
  onDurationChange?: (duration: number) => void;
  /** Called when an error occurs during audio operations */
  onError?: (error: Error) => void;
  /** Called when the audio analyser node is created */
  onAnalyserCreated?: (analyser: AnalyserNode) => void;
}

/**
 * Interface for the audio channel.
 * Defines the main operations that can be performed on an audio channel.
 */
export interface AudioChannel {
  /** Loads an audio file */
  load: (music: Music) => Promise<void>;
  /** Starts or resumes audio playback */
  play: () => Promise<void>;
  /** Pauses audio playback */
  pause: () => void;
  /** Seeks to a specific time in the audio */
  seek: (time: number) => void;
  /** Checks if audio is currently playing */
  isPlaying: () => boolean;
  /** Disposes of the audio channel and releases resources */
  dispose: () => void;
}
