import { AudioChannel, AudioError, Music } from '../../dist';

import { EventHandler } from '../interfaces';

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  }),
) as jest.Mock;

// Mock window and AudioContext
const mockCreateGain = jest.fn(() => ({
  connect: jest.fn(),
  gain: { setValueAtTime: jest.fn() },
}));

const mockCreateAnalyser = jest.fn(() => ({
  connect: jest.fn(),
  fftSize: 0,
  smoothingTimeConstant: 0,
}));

const mockAudioContext = jest.fn(() => ({
  createGain: mockCreateGain,
  createAnalyser: mockCreateAnalyser,
  currentTime: 0,
  destination: { connect: jest.fn() },
  resume: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
}));

// Modify window configuration
(global as any).window = {
  AudioContext: jest.fn().mockImplementation(mockAudioContext),
};

describe('AudioChannel', () => {
  let audioChannel: AudioChannel;
  let mockEventHandler: EventHandler;
  let mockAudioContext: AudioContext;
  let mockGainNode: GainNode;
  let mockAnalyserNode: AnalyserNode;
  let mockSourceNode: AudioBufferSourceNode;
  let mockMusic: Music;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock GainNode
    mockGainNode = {
      connect: jest.fn(),
      gain: { setValueAtTime: jest.fn() },
      disconnect: jest.fn(),
    } as unknown as GainNode;
    // Mock AnalyserNode
    mockAnalyserNode = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      fftSize: 0,
      smoothingTimeConstant: 0,
    } as unknown as AnalyserNode;
    // Mock AudioBufferSourceNode
    mockSourceNode = {
      buffer: null,
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      disconnect: jest.fn(),
      onended: null,
    } as unknown as AudioBufferSourceNode;

    // Mock AudioContext
    mockAudioContext = {
      createGain: jest.fn().mockReturnValue(mockGainNode),
      createAnalyser: jest.fn().mockReturnValue(mockAnalyserNode),
      createBufferSource: jest.fn().mockReturnValue(mockSourceNode),
      decodeAudioData: jest.fn().mockResolvedValue({ duration: 100 } as AudioBuffer),
      destination: {} as AudioDestinationNode,
      resume: jest.fn().mockResolvedValue(undefined),
      currentTime: 0,
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as AudioContext;

    // Mock EventHandler
    mockEventHandler = {
      onAnalyserCreated: jest.fn(),
      onPlay: jest.fn(),
      onPause: jest.fn(),
      onEnded: jest.fn(),
      onTimeUpdate: jest.fn(),
      onDurationChange: jest.fn(),
      onError: jest.fn(),
      onStop: jest.fn(), // Ajoutez cette ligne
    };

    // Reset the singleton instance before each test
    (AudioChannel as any).instance = null;
    audioChannel = AudioChannel.getInstance(mockEventHandler, () => mockAudioContext);
    mockMusic = { id: '1', name: 'Test Music', url: 'https://cdn.pixabay.com/audio/2023/12/29/audio_a1497a53af.mp3' };
  });

  const initializeAndLoadMusic = async () => {
    await audioChannel.initialize();
    await audioChannel.load(mockMusic);
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('initialize sets up audio context and processing', async () => {
    await audioChannel.initialize();

    expect(mockAudioContext.createGain).toHaveBeenCalled();
    expect(mockAudioContext.createAnalyser).toHaveBeenCalled();
    expect(mockAudioContext.resume).toHaveBeenCalled();
    expect(mockEventHandler.onAnalyserCreated).toHaveBeenCalled();
  });

  test('load sets currentMusic and updates state', async () => {
    await initializeAndLoadMusic();

    expect(audioChannel.currentMusic).toBe(mockMusic);
    expect(mockEventHandler.onDurationChange).toHaveBeenCalledWith(100);
  });

  test('play starts playback', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();

    expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
    expect(mockSourceNode.start).toHaveBeenCalled();
    expect(mockEventHandler.onPlay).toHaveBeenCalled();
  });

  test('pause stops playback', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();
    audioChannel.pause();

    expect(mockSourceNode.stop).toHaveBeenCalled();
    expect(mockEventHandler.onPause).toHaveBeenCalled();
  });

  test('setVolume changes gain value', async () => {
    await audioChannel.initialize();
    audioChannel.setVolume(0.5);

    expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
  });

  test('seek sets current time', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();
    audioChannel.seek(10);

    expect(mockSourceNode.stop).toHaveBeenCalled();
    expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(2);
    expect(mockSourceNode.start).toHaveBeenCalledWith(0, 10);
  });

  test('isPlaying returns correct state', async () => {
    await initializeAndLoadMusic();

    expect(audioChannel.isPlaying()).toBe(false);
    await audioChannel.play();
    expect(audioChannel.isPlaying()).toBe(true);
    audioChannel.pause();
    expect(audioChannel.isPlaying()).toBe(false);
  });

  test('load handles error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(audioChannel.load(mockMusic)).rejects.toThrow(AudioError);
    expect(mockEventHandler.onError).toHaveBeenCalled();
  });

  test('getInstance always returns the same instance', () => {
    const instance1 = AudioChannel.getInstance(mockEventHandler);
    const instance2 = AudioChannel.getInstance(mockEventHandler);
    expect(instance1).toBe(instance2);
  });

  test('initialize throws error when audioContextFactory returns null', async () => {
    (AudioChannel as any).instance = null;
    const nullAudioContextFactory = () => null;
    const audioChannel = AudioChannel.getInstance(mockEventHandler, nullAudioContextFactory);

    await expect(audioChannel.initialize()).rejects.toThrow(AudioError);
    expect(audioChannel['audioContext']).toBeNull();
  });

  test('initialize creates audioContext when no factory is provided', async () => {
    (AudioChannel as any).instance = null;
    const audioChannel = AudioChannel.getInstance(mockEventHandler);

    await audioChannel.initialize();
    expect(window.AudioContext).toHaveBeenCalled();
    expect(mockCreateGain).toHaveBeenCalled();
    expect(mockCreateAnalyser).toHaveBeenCalled();
    expect(audioChannel['audioContext']).not.toBeNull();
  });

  test('initialize throws error when AudioContext is not supported', async () => {
    (global as any).window = {};
    (AudioChannel as any).instance = null;
    const audioChannel = AudioChannel.getInstance(mockEventHandler);
    await expect(audioChannel.initialize()).rejects.toThrow(AudioError);
  });

  test('dispose cleans up resources', async () => {
    await audioChannel.initialize();
    audioChannel.dispose();
    expect(mockAudioContext.close).toHaveBeenCalled();
    expect(mockGainNode.disconnect).toHaveBeenCalled();
    expect(mockAnalyserNode.disconnect).toHaveBeenCalled();
    expect(audioChannel['audioBuffer']).toBeNull();
    expect(audioChannel.currentMusic).toBeNull();
    expect(audioChannel.playbackState).toBe(AudioChannel.PlaybackState.IDLE);
  });

  test('createSourceNode does nothing when audioContext or audioBuffer is null', () => {
    audioChannel['audioContext'] = null;
    audioChannel['createSourceNode']();
    expect(audioChannel['sourceNode']).toBeNull();

    audioChannel['audioContext'] = mockAudioContext;
    audioChannel['audioBuffer'] = null;
    audioChannel['createSourceNode']();
    expect(audioChannel['sourceNode']).toBeNull();
  });

  test('updateTime handles end of playback', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();
    // Spy on handlePlaybackEnded
    const handlePlaybackEndedSpy = jest.spyOn(audioChannel as any, 'handlePlaybackEnded');

    // Simulate the end of playback
    (audioChannel as any).audioContext.currentTime = 101; // Exceeds the duration of 100
    (audioChannel as any).updateTime();

    expect(handlePlaybackEndedSpy).toHaveBeenCalled();
    expect(audioChannel.playbackState).toBe(AudioChannel.PlaybackState.IDLE);
    expect(mockEventHandler.onEnded).toHaveBeenCalled();

    // Restore the spy
    handlePlaybackEndedSpy.mockRestore();
  });

  test('requestAnimationFrame is called during playback', async () => {
    const mockRequestAnimationFrame = jest.fn();
    (global as any).requestAnimationFrame = mockRequestAnimationFrame;

    await initializeAndLoadMusic();
    await audioChannel.play();

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  test('updateTime does nothing when audio is not playing', async () => {
    await initializeAndLoadMusic();

    // Make sure isAudioPlaying is false
    (audioChannel as any).isAudioPlaying = false;

    const requestAnimationFrameSpy = jest.spyOn(audioChannel as any, 'requestAnimationFrame');

    (audioChannel as any).updateTime();

    expect(mockEventHandler.onTimeUpdate).not.toHaveBeenCalled();
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();

    requestAnimationFrameSpy.mockRestore();
  });

  test('initializeVolume sets the correct volume', async () => {
    await audioChannel.initialize();
    const setVolumeSpy = jest.spyOn(audioChannel, 'setVolume');

    audioChannel.initializeVolume(50);

    expect(setVolumeSpy).toHaveBeenCalledWith(0.5);

    setVolumeSpy.mockRestore();
  });

  test('updateTime does nothing when audioContext is null', async () => {
    await initializeAndLoadMusic();
    (audioChannel as any).audioContext = null;
    (audioChannel as any).updateTime();
    expect(mockEventHandler.onTimeUpdate).not.toHaveBeenCalled();
  });

  test('updateTime handles case when audioBuffer is null', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();
    (audioChannel as any).audioBuffer = null;
    (audioChannel as any).updateTime();
    expect(mockEventHandler.onTimeUpdate).toHaveBeenCalled();
  });


  test('seek handles various edge cases', async () => {
    await initializeAndLoadMusic();


    audioChannel.seek(-1);
    expect(mockEventHandler.onTimeUpdate).toHaveBeenCalledWith(0);


    (audioChannel as any).audioBuffer = { duration: 100 };
    audioChannel.seek(150);
    expect(mockEventHandler.onTimeUpdate).toHaveBeenCalledWith(100);

    // Case where the audio is playing, seeking to a new position
    await audioChannel.play();
    const playSpy = jest.spyOn(audioChannel, 'play');
    audioChannel.seek(50);
    expect(playSpy).toHaveBeenCalled();

    playSpy.mockRestore();
  });

  test('createSourceNode does nothing when audioContext is null', async () => {
    await initializeAndLoadMusic();
    (audioChannel as any).audioContext = null;
    (audioChannel as any).createSourceNode();
    expect(audioChannel['sourceNode']).toBeNull();
  });
});
