import { AudioChannel, AudioError, Music } from '../../dist';

import { EventHandler } from '../interfaces';

// Simuler requestAnimationFrame et cancelAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Simuler fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  }),
) as jest.Mock;

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

    mockGainNode = {
      connect: jest.fn(),
      gain: { setValueAtTime: jest.fn() },
    } as unknown as GainNode;

    mockAnalyserNode = {
      connect: jest.fn(),
      fftSize: 0,
      smoothingTimeConstant: 0,
    } as unknown as AnalyserNode;

    mockSourceNode = {
      buffer: null,
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      disconnect: jest.fn(),
      onended: null,
    } as unknown as AudioBufferSourceNode;

    mockAudioContext = {
      createGain: jest.fn().mockReturnValue(mockGainNode),
      createAnalyser: jest.fn().mockReturnValue(mockAnalyserNode),
      createBufferSource: jest.fn().mockReturnValue(mockSourceNode),
      decodeAudioData: jest.fn().mockResolvedValue({ duration: 100 } as AudioBuffer),
      destination: {} as AudioDestinationNode,
      resume: jest.fn().mockResolvedValue(undefined),
      currentTime: 0,
    } as unknown as AudioContext;

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

    // Réinitialiser l'instance singleton avant chaque test
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

  // Ajoutez un test pour vérifier que getInstance renvoie toujours la même instance
  test('getInstance always returns the same instance', () => {
    const instance1 = AudioChannel.getInstance(mockEventHandler);
    const instance2 = AudioChannel.getInstance(mockEventHandler);
    expect(instance1).toBe(instance2);
  });
});
