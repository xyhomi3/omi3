import { AudioError } from './AudioError';
import { EventHandler } from '../interfaces';
import { Music } from '../types';

/**
 * Manages audio playback and processing for a single audio channel.
 * Implements best practices for Web Audio API usage.
 */
export class AudioChannel {
  private static instance: AudioChannel | null = null;

  /**
   * Enum representing the different states of audio playback.
   */
  static PlaybackState = {
    IDLE: 0,
    LOADING: 1,
    READY: 2,
    PLAYING: 3,
    PAUSED: 4,
    ERROR: 5,
  } as const;

  // Public properties
  public playbackState: number = AudioChannel.PlaybackState.IDLE;
  public currentMusic: Music | null = null;

  // Private properties
  private eventHandler: EventHandler;
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startAt: number = 0;
  private pauseAt: number = 0;
  private isAudioPlaying: boolean = false;
  private animationFrame: number | null = null;
  private audioContextFactory: () => AudioContext | null;

  /**
   * Creates an instance of AudioChannel.
   * @param eventHandler - The event handler for audio events.
   * @param audioContextFactory - Optional factory function for creating AudioContext.
   */
  private constructor(eventHandler: EventHandler, audioContextFactory?: () => AudioContext | null) {
    this.eventHandler = eventHandler;
    this.audioContextFactory = audioContextFactory || this.defaultAudioContextFactory;
  }

  /**
   * Gets the singleton instance of AudioChannel.
   * @param eventHandler - The event handler for audio events.
   * @param audioContextFactory - Optional factory function for creating AudioContext.
   * @returns The AudioChannel instance.
   */
  public static getInstance(eventHandler: EventHandler, audioContextFactory?: () => AudioContext | null): AudioChannel {
    if (!AudioChannel.instance) {
      AudioChannel.instance = new AudioChannel(eventHandler, audioContextFactory);
    }
    return AudioChannel.instance;
  }

  /**
   * Initializes the audio context and sets up audio processing.
   */
  public async initialize(): Promise<void> {
    if (!this.audioContext) {
      const context = this.audioContextFactory();
      if (!context) {
        throw new AudioError('AudioContext is not supported', 'AUDIO_CONTEXT_NOT_SUPPORTED');
      }
      this.audioContext = context;
      await this.audioContext.resume();
    }
    await this.setupAudioProcessing();
    this.setVolume(1);
  }

  /**
   * Loads an audio file and prepares it for playback.
   * @param music - The music object containing the audio file URL.
   */
  public async load(music: Music): Promise<void> {
    this.playbackState = AudioChannel.PlaybackState.LOADING;

    try {
      this.audioBuffer = await this.loadAudioBuffer(music.url);
      this.currentMusic = music;
      this.playbackState = AudioChannel.PlaybackState.READY;
      this.eventHandler.onDurationChange?.(this.audioBuffer.duration);
      this.eventHandler.onBufferLoaded?.(this.audioBuffer);
    } catch (error) {
      this.playbackState = AudioChannel.PlaybackState.ERROR;
      this.eventHandler.onError?.(error as AudioError);
      throw error;
    }
  }

  /**
   * Starts or resumes audio playback.
   */
  public async play(): Promise<void> {
    if (this.audioBuffer && this.audioContext) {
      this.stop();
      this.createSourceNode();
      this.sourceNode!.start(0, this.pauseAt);
      this.startAt = this.audioContext.currentTime - this.pauseAt;
      this.isAudioPlaying = true;
      this.playbackState = AudioChannel.PlaybackState.PLAYING;
      this.eventHandler.onPlay?.();
      this.updateTime();
    }
  }

  /**
   * Pauses audio playback.
   */
  public pause(): void {
    if (this.isAudioPlaying) {
      this.pauseAt = this.getCurrentTime();
      this.stop();
      this.isAudioPlaying = false;
      this.playbackState = AudioChannel.PlaybackState.PAUSED;
      this.eventHandler.onPause?.();
    }
  }

  /**
   * Seeks to a specific time in the audio.
   * @param time - The time to seek to in seconds.
   */
  public seek(time: number): void {
    const wasPlaying = this.isAudioPlaying;
    if (wasPlaying) {
      this.pause();
    }

    this.pauseAt = Math.max(0, Math.min(time, this.getDuration()));
    if (wasPlaying) {
      this.play();
    } else {
      this.eventHandler.onTimeUpdate?.(this.pauseAt);
    }
    this.eventHandler.onPlayStateChange?.(wasPlaying);
    this.eventHandler.onSeek?.(this.pauseAt);
  }

  /**
   * Sets the volume of the audio.
   * @param volume - The volume level (0 to 1).
   */
  public setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      const safeVolume = Math.max(0, Math.min(1, volume));
      this.gainNode.gain.setTargetAtTime(safeVolume, this.audioContext.currentTime, 0.01);
    }
  }

  /**
   * Checks if audio is currently playing.
   * @returns True if audio is playing, false otherwise.
   */
  public isPlaying(): boolean {
    return this.isAudioPlaying;
  }

  /**
   * Gets the current playback time in seconds.
   * @returns The current playback time.
   */
  public getCurrentTime(): number {
    if (this.audioContext && this.startAt !== null && this.isAudioPlaying) {
      return this.audioContext.currentTime - this.startAt;
    }
    return this.pauseAt;
  }

  /**
   * Gets the total duration of the loaded audio in seconds.
   * @returns The total duration of the audio.
   */
  public getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  /**
   * Connects the audio channel to an AudioNode or AudioParam.
   * @param destination - The AudioNode or AudioParam to connect to.
   */
  public connect(destination: AudioNode | AudioParam): void {
    if (this.analyser) {
      if (destination instanceof AudioNode) {
        this.analyser.connect(destination);
      } else if (destination instanceof AudioParam) {
        this.analyser.connect(destination);
      } else {
        console.error('Invalid destination type for connection');
      }
    }
  }

  /**
   * Disconnects the audio channel from all or specific destinations.
   * @param destination - Optional AudioNode or AudioParam to disconnect from.
   */
  public disconnect(destination?: AudioNode | AudioParam): void {
    if (this.analyser) {
      if (destination === undefined) {
        this.analyser.disconnect();
      } else if (destination instanceof AudioNode) {
        this.analyser.disconnect(destination);
      } else if (destination instanceof AudioParam) {
        this.analyser.disconnect(destination);
      } else {
        console.error('Invalid destination type for disconnection');
      }
    }
  }

  /**
   * Disposes of the audio channel and releases resources.
   */
  public dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.analyser) {
      this.analyser.disconnect();
    }
    this.audioBuffer = null;
    this.currentMusic = null;
    this.playbackState = AudioChannel.PlaybackState.IDLE;
    AudioChannel.instance = null;
  }

  // Private methods

  /**
   * Default factory function for creating AudioContext.
   */
  private defaultAudioContextFactory(): AudioContext | null {
    if (typeof AudioContext !== 'undefined') {
      return new AudioContext();
    }
    return null;
  }

  /**
   * Sets up audio processing nodes.
   */
  private async setupAudioProcessing(): Promise<void> {
    if (!this.audioContext) return;

    this.gainNode = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.eventHandler.onAnalyserCreated?.(this.analyser);
  }

  /**
   * Loads an audio buffer from a URL.
   * @param url - The URL of the audio file.
   * @returns A promise that resolves to an AudioBuffer.
   */
  private async loadAudioBuffer(url: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      await this.initialize();
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext!.decodeAudioData(arrayBuffer);
    } catch (error) {
      throw new AudioError('Failed to load audio', 'LOAD_FAILURE');
    }
  }

  /**
   * Creates and configures the audio source node.
   */
  private createSourceNode(): void {
    if (!this.audioContext || !this.audioBuffer) return;

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.gainNode!);
    this.sourceNode.onended = this.handlePlaybackEnded.bind(this);
  }

  /**
   * Handles the end of audio playback.
   */
  private handlePlaybackEnded(): void {
    this.stop();
    this.pauseAt = 0;
    this.playbackState = AudioChannel.PlaybackState.IDLE;
    this.eventHandler.onEnded?.();
  }

  /**
   * Stops audio playback and cleans up resources.
   */
  private stop(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isAudioPlaying = false;
    this.eventHandler.onStop?.();
  }

  /**
   * Updates the current playback time and triggers the onTimeUpdate event.
   */
  private updateTime(): void {
    if (this.audioContext && this.startAt !== null && this.isAudioPlaying) {
      const currentTime = this.getCurrentTime();
      if (currentTime <= this.getDuration()) {
        this.eventHandler.onTimeUpdate?.(currentTime);
        this.animationFrame = requestAnimationFrame(() => this.updateTime());
      } else {
        this.handlePlaybackEnded();
      }
    }
  }
}
