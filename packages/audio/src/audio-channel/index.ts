import { AudioError } from './AudioError';
import { EventHandler } from '../interfaces';
import { Music } from '../types';

/**
 * Manages audio playback and processing for a single audio channel.
 */
export class AudioChannel {
  private static instance: AudioChannel | null = null;

  static PlaybackState = {
    IDLE: 0,
    LOADING: 1,
    READY: 2,
    PLAYING: 3,
    PAUSED: 4,
    ERROR: 5,
  } as const;

  private eventHandler: EventHandler;
  private playbackState: number = AudioChannel.PlaybackState.IDLE;
  public currentMusic: Music | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private isAudioPlaying: boolean = false;
  private animationFrame: number | null = null;
  private audioContextFactory: () => AudioContext;

  /**
   * Creates an instance of AudioChannel.
   * @param eventHandler - The event handler for audio events.
   * @param audioContextFactory - Optional factory function for creating AudioContext.
   */
  private constructor(eventHandler: EventHandler, audioContextFactory?: () => AudioContext) {
    this.eventHandler = eventHandler;
    this.audioContextFactory =
      audioContextFactory || (() => new (window.AudioContext || (window as any).webkitAudioContext)());
  }

  public static getInstance(eventHandler: EventHandler, audioContextFactory?: () => AudioContext): AudioChannel {
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
      this.audioContext = this.audioContextFactory();
      await this.setupAudioProcessing();
    }
    await this.audioContext.resume();
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
    if (this.isAudioPlaying) {
      this.stop();
    }

    if (this.audioBuffer && this.audioContext) {
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.gainNode!);
      this.sourceNode.start(0, this.pauseTime);
      this.startTime = this.audioContext.currentTime - this.pauseTime;
      this.isAudioPlaying = true;
      this.eventHandler.onPlay?.();
      this.updateTime();
    }
  }

  /**
   * Pauses audio playback.
   */
  public pause(): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.isAudioPlaying = false;
      if (this.animationFrame !== null) {
        this.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      this.pauseTime = this.audioContext!.currentTime - this.startTime;
      this.eventHandler.onPause?.();
    }
  }

  /**
   * Seeks to a specific time in the audio.
   * @param time - The time to seek to in seconds.
   */
  public seek(time: number): void {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.createSourceNode();
      this.sourceNode.start(0, time);
      this.startTime = this.audioContext!.currentTime - time;
    }
  }

  /**
   * Sets the volume of the audio.
   * @param volume - The volume level (0 to 1).
   */
  public setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
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
   * Disposes of the audio channel and releases resources.
   */
  public dispose(): void {
    this.stop();
    this.audioContext?.close();
    this.gainNode?.disconnect();
    this.analyser?.disconnect();
    this.audioBuffer = null;
    this.currentMusic = null;
    this.playbackState = AudioChannel.PlaybackState.IDLE;
  }

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

  private createSourceNode(): void {
    if (!this.audioContext || !this.audioBuffer) return;

    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.gainNode!);
    this.sourceNode.onended = this.handlePlaybackEnded.bind(this);
  }

  private handlePlaybackEnded(): void {
    if (this.playbackState === AudioChannel.PlaybackState.PLAYING) {
      this.eventHandler.onEnded?.();
      this.playbackState = AudioChannel.PlaybackState.IDLE;
      this.isAudioPlaying = false;
      this.pauseTime = 0;
    }
  }

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
    this.pauseTime = 0;
    this.eventHandler.onStop?.();
  }

  private updateTime(): void {
    if (this.audioContext && this.startTime !== null && this.isAudioPlaying) {
      const currentTime = this.audioContext.currentTime - this.startTime;
      this.eventHandler.onTimeUpdate?.(currentTime);

      this.animationFrame = this.requestAnimationFrame(() => this.updateTime());
    }
  }

  private requestAnimationFrame(callback: FrameRequestCallback): number {
    return requestAnimationFrame(callback);
  }

  private cancelAnimationFrame(id: number): void {
    cancelAnimationFrame(id);
  }
}
