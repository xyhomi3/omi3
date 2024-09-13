import React from 'react';
import { Visualizer } from '../../dist';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  createElement: jest.fn((type, props, ...children) => ({ type, props, children })),
}));

describe('Visualizer', () => {
  let mockAnalyser: AnalyserNode;
  let mockCanvas: HTMLCanvasElement;
  let mockCanvasContext: CanvasRenderingContext2D;

  beforeEach(() => {
    jest.useFakeTimers();

    // Setup mock objects
    mockAnalyser = {
      frequencyBinCount: 1024,
      getByteTimeDomainData: jest.fn(),
    } as unknown as AnalyserNode;

    mockCanvasContext = {
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      getContext: jest.fn(() => mockCanvasContext),
      width: 300,
      height: 150,
    } as unknown as HTMLCanvasElement;

    // Mock global functions
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('initializes the visualizer correctly', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    expect(visualizer).toBeDefined();
  });

  it('starts visualization on mount', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = mockCanvas;

    visualizer.componentDidMount();
    jest.runOnlyPendingTimers();

    expect(global.requestAnimationFrame).toHaveBeenCalled();
    expect(mockCanvasContext.fillRect).toHaveBeenCalled();
    expect(mockCanvasContext.beginPath).toHaveBeenCalled();
    expect(mockCanvasContext.stroke).toHaveBeenCalled();
  });

  it('stops visualization on unmount', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = mockCanvas;

    visualizer.componentDidMount();
    jest.runOnlyPendingTimers();
    visualizer.componentWillUnmount();

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('updates visualization when analyser changes', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = mockCanvas;

    visualizer.componentDidMount();
    jest.runOnlyPendingTimers();

    const newMockAnalyser = { ...mockAnalyser };
    visualizer.componentDidUpdate({ ...visualizer.props, analyser: newMockAnalyser });

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
    expect(global.requestAnimationFrame).toHaveBeenCalledTimes(3);
  });

  it('renders the component correctly', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
      backgroundColor: 'red',
      lineColor: 'blue',
    });

    visualizer.render();

    // Check if React.createElement was called correctly
    expect(React.createElement).toHaveBeenCalledTimes(2);

    // Check the outer div call
    expect(React.createElement).toHaveBeenCalledWith(
      'div',
      expect.objectContaining({
        style: expect.objectContaining({
          backgroundColor: 'transparent',
          border: '2px solid #333',
          borderRadius: '4px',
          padding: '2px',
        }),
      }),
      expect.anything(),
    );

    // Check the canvas call
    expect(React.createElement).toHaveBeenCalledWith(
      'canvas',
      expect.objectContaining({
        width: 300,
        height: 150,
        style: expect.objectContaining({
          width: '100%',
          height: 'auto',
        }),
      }),
    );
  });

  it('does not start visualization if analyser is not available', () => {
    const visualizer = new Visualizer({
      analyser: null,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = mockCanvas;

    visualizer.componentDidMount();
    jest.runOnlyPendingTimers();

    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('does not start visualization if canvas is not available', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = null;

    visualizer.componentDidMount();
    jest.runOnlyPendingTimers();

    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('does not start visualization if canvas context is not available', () => {
    const canvasWithoutContext = {
      getContext: jest.fn(() => null),
      width: 300,
      height: 150,
    } as unknown as HTMLCanvasElement;

    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = canvasWithoutContext;

    visualizer.componentDidMount();
    jest.runOnlyPendingTimers();

    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('stops animation if canvas is removed during animation', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = mockCanvas;

    // Simulate component mount
    visualizer.componentDidMount();

    // Ensure requestAnimationFrame was called
    expect(global.requestAnimationFrame).toHaveBeenCalled();

    // Reset mocks
    jest.clearAllMocks();

    // Simulate canvas removal during animation
    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = null;

    // Manually trigger the animation frame
    const rafMock = global.requestAnimationFrame as jest.Mock;
    const lastCall = rafMock.mock.calls[rafMock.mock.calls.length - 1];
    if (lastCall && typeof lastCall[0] === 'function') {
      lastCall[0]();
    }

    // Run pending timers
    jest.runAllTimers();

    // Verify that requestAnimationFrame was not called again
    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('does not initialize visualization if this.canvasRef.current is null', () => {
    const visualizer = new Visualizer({
      analyser: mockAnalyser,
      width: 300,
      height: 150,
    });

    // @ts-ignore - Accessing private property for testing
    visualizer.canvasRef.current = null;

    // Directly call setupVisualizer to trigger the condition
    visualizer.setupVisualizer();

    // Verify that requestAnimationFrame was not called
    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
  });
});
