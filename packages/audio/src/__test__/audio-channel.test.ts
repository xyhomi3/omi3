import { AudioChannel, AudioError, EventHandler, Music } from '../../dist';

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  }),
) as jest.Mock;

const mockAudioContext = {
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: { setValueAtTime: jest.fn(), setTargetAtTime: jest.fn() },
  })),
  createAnalyser: jest.fn(() => ({
    connect: jest.fn(),
    fftSize: 0,
    smoothingTimeConstant: 0,
  })),
  createBufferSource: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  decodeAudioData: jest.fn().mockResolvedValue({ duration: 100 } as AudioBuffer),
  destination: { connect: jest.fn() },
  currentTime: 0,
  resume: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
};

// Modify window configuration
global.AudioContext = jest.fn(() => mockAudioContext) as any;
global.window = { AudioContext: global.AudioContext } as any;

// Mock AudioNode and AudioParam
global.AudioNode = jest.fn() as any;
global.AudioParam = jest.fn() as any;

global.AudioContext = jest.fn().mockImplementation(() => ({
  createGain: jest.fn().mockReturnValue({
    connect: jest.fn(),
    gain: { setValueAtTime: jest.fn() },
  }),
  createAnalyser: jest.fn().mockReturnValue({
    connect: jest.fn(),
    fftSize: 0,
    smoothingTimeConstant: 0,
  }),
  createBufferSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  }),
  decodeAudioData: jest.fn(),
  destination: {},
  currentTime: 0,
}));

global.AudioBuffer = jest.fn() as any;

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
      gain: { setValueAtTime: jest.fn(), setTargetAtTime: jest.fn(), value: 1 },
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
      onStop: jest.fn(),
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

    expect(mockGainNode.gain.setTargetAtTime).toHaveBeenCalledWith(0.5, 0, 0.01);
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

  test('load handles errors', async () => {
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

    // Save the original AudioContext
    const originalAudioContext = global.AudioContext;

    const mockCreateGain = jest.fn().mockReturnValue({
      connect: jest.fn(),
      gain: { setValueAtTime: jest.fn(), setTargetAtTime: jest.fn() },
    });
    const mockCreateAnalyser = jest.fn().mockReturnValue({
      connect: jest.fn(),
      fftSize: 0,
      smoothingTimeConstant: 0,
    });
    const mockAudioContextInstance = {
      createGain: mockCreateGain,
      createAnalyser: mockCreateAnalyser,
      destination: {},
      resume: jest.fn().mockResolvedValue(undefined),
    };
    const mockAudioContext = jest.fn(() => mockAudioContextInstance);

    global.AudioContext = mockAudioContext as any;
    global.window = { AudioContext: mockAudioContext as any } as any;

    try {
      const audioChannel = AudioChannel.getInstance(mockEventHandler);
      await audioChannel.initialize();

      expect(mockAudioContext).toHaveBeenCalledTimes(1);
      expect(audioChannel['audioContext']).toBeTruthy();
      expect(mockCreateGain).toHaveBeenCalledTimes(1);
      expect(mockCreateAnalyser).toHaveBeenCalledTimes(1);
    } finally {
      global.AudioContext = originalAudioContext;
      delete (global as any).window;
    }
  });

  test('initialize throws error when AudioContext is not supported', async () => {
    (global as any).window = {};
    (AudioChannel as any).instance = null;
    const nullAudioContextFactory = jest.fn().mockReturnValue(null);
    const audioChannel = AudioChannel.getInstance(mockEventHandler, nullAudioContextFactory);

    await expect(audioChannel.initialize()).rejects.toThrow(AudioError);
    expect(nullAudioContextFactory).toHaveBeenCalled();
    expect(audioChannel['audioContext']).toBeNull();
  });

  test('dispose releases resources and resets singleton', async () => {
    const audioChannel = AudioChannel.getInstance(mockEventHandler);
    await audioChannel.initialize();

    const mockClose = jest.fn();
    const mockDisconnect = jest.fn();

    audioChannel['audioContext'] = { close: mockClose } as any;
    audioChannel['gainNode'] = { disconnect: mockDisconnect } as any;
    audioChannel['analyser'] = { disconnect: mockDisconnect } as any;

    audioChannel.dispose();

    expect(mockClose).toHaveBeenCalled();
    expect(mockDisconnect).toHaveBeenCalledTimes(2);
    expect(audioChannel['audioBuffer']).toBeNull();
    expect(audioChannel['currentMusic']).toBeNull();
    expect(audioChannel['playbackState']).toBe(AudioChannel.PlaybackState.IDLE);
    expect(AudioChannel['instance']).toBeNull();
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
    (audioChannel as any).audioContext.currentTime = 101;
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

    const globalRequestAnimationFrame = jest.spyOn(global, 'requestAnimationFrame');

    (audioChannel as any).updateTime();

    expect(globalRequestAnimationFrame).not.toHaveBeenCalled();
  });

  test('setVolume sets the correct volume', async () => {
    await audioChannel.initialize();
    const setVolumeSpy = jest.spyOn(audioChannel, 'setVolume');

    audioChannel.setVolume(0.5);

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

  test('updateTime does nothing when audio is not playing', async () => {
    await initializeAndLoadMusic();

    // Make sure isAudioPlaying is false
    (audioChannel as any).isAudioPlaying = false;

    const globalRequestAnimationFrame = jest.spyOn(global, 'requestAnimationFrame');

    (audioChannel as any).updateTime();

    expect(globalRequestAnimationFrame).not.toHaveBeenCalled();
  });

  test('connect and disconnect work correctly', async () => {
    await audioChannel.initialize();
    const mockDestination = new (global.AudioNode as any)();

    audioChannel.connect(mockDestination);
    expect(mockAnalyserNode.connect).toHaveBeenCalledWith(mockDestination);

    audioChannel.disconnect(mockDestination);
    expect(mockAnalyserNode.disconnect).toHaveBeenCalledWith(mockDestination);

    audioChannel.disconnect();
    expect(mockAnalyserNode.disconnect).toHaveBeenCalledWith();
  });

  test('getCurrentTime returns the correct value', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();

    (audioChannel as any).audioContext.currentTime = 10;
    (audioChannel as any).startAt = 5;

    expect(audioChannel.getCurrentTime()).toBe(5);
  });

  test('getDuration returns the correct value', async () => {
    await initializeAndLoadMusic();
    (audioChannel as any).audioBuffer = { duration: 120 };

    expect(audioChannel.getDuration()).toBe(120);
  });

  test('connect handles AudioParam destination', async () => {
    await audioChannel.initialize();
    const mockAudioParam = new (global.AudioParam as any)();

    audioChannel.connect(mockAudioParam);
    expect(mockAnalyserNode.connect).toHaveBeenCalledWith(mockAudioParam);
  });

  test('connect handles invalid destination type', async () => {
    await audioChannel.initialize();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    audioChannel.connect({} as any);
    expect(consoleSpy).toHaveBeenCalledWith('Invalid destination type for connection');

    consoleSpy.mockRestore();
  });

  test('disconnect handles AudioParam destination', async () => {
    await audioChannel.initialize();
    const mockAudioParam = new (global.AudioParam as any)();

    audioChannel.disconnect(mockAudioParam);
    expect(mockAnalyserNode.disconnect).toHaveBeenCalledWith(mockAudioParam);
  });

  test('disconnect handles invalid destination type', async () => {
    await audioChannel.initialize();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    audioChannel.disconnect({} as any);
    expect(consoleSpy).toHaveBeenCalledWith('Invalid destination type for disconnection');

    consoleSpy.mockRestore();
  });

  test('getCurrentTime returns pauseAt when audio is paused', async () => {
    await initializeAndLoadMusic();
    await audioChannel.play();
    audioChannel.pause();
    (audioChannel as any).pauseAt = 10;

    expect(audioChannel.getCurrentTime()).toBe(10);
  });

  test('onBufferLoaded is called when buffer is loaded', async () => {
    const mockOnBufferLoaded = jest.fn();
    mockEventHandler.onBufferLoaded = mockOnBufferLoaded;
    await initializeAndLoadMusic();
    expect(mockOnBufferLoaded).toHaveBeenCalledWith(expect.objectContaining({
      duration: expect.any(Number)
    }));
  });

  test('onPlayStateChange and onSeek are called when seeking while paused', async () => {
    const mockOnPlayStateChange = jest.fn();
    const mockOnSeek = jest.fn();
    mockEventHandler.onPlayStateChange = mockOnPlayStateChange;
    mockEventHandler.onSeek = mockOnSeek;

    await initializeAndLoadMusic();
    audioChannel.seek(10);

    expect(mockOnPlayStateChange).toHaveBeenCalledWith(false);
    expect(mockOnSeek).toHaveBeenCalledWith(10);
  });

  test('defaultAudioContextFactory uses AudioContext when available', () => {
    const originalAudioContext = global.AudioContext;
    const originalWindow = global.window;

    // Mock AudioContext
    const mockAudioContext = jest.fn();
    (global as any).AudioContext = mockAudioContext;
    (global as any).window = { AudioContext: mockAudioContext };

    const audioChannel = AudioChannel.getInstance(mockEventHandler);
    const result = (audioChannel as any).defaultAudioContextFactory();

    expect(mockAudioContext).toHaveBeenCalled();
    expect(result).toBeInstanceOf(mockAudioContext);

    // Restore original values
    global.AudioContext = originalAudioContext;
    global.window = originalWindow;
  });

  test('defaultAudioContextFactory returns null when AudioContext is not available', () => {
    const originalAudioContext = global.AudioContext;
    const originalWindow = global.window;

    // Remove AudioContext
    delete (global as any).AudioContext;
    delete (global as any).window.AudioContext;

    const audioChannel = AudioChannel.getInstance(mockEventHandler);
    const result = (audioChannel as any).defaultAudioContextFactory();

    expect(result).toBeNull();

    // Restore original values
    global.AudioContext = originalAudioContext;
    global.window = originalWindow;
  });

  test('loadAudioBuffer throws AudioError on HTTP error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(initializeAndLoadMusic()).rejects.toThrow(AudioError);
    expect(mockEventHandler.onError).toHaveBeenCalledWith(expect.any(AudioError));
  });
});
