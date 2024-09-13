import React from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  width: number;
  height: number;
  backgroundColor?: string;
  lineColor?: string;
}

class Visualizer extends React.Component<AudioVisualizerProps> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private animationFrameId: number | null = null;

  static defaultProps = {
    backgroundColor: 'rgb(0, 0, 0)',
    lineColor: '#a3e636',
  };

  constructor(props: AudioVisualizerProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.setupVisualizer();
  }

  componentDidUpdate(prevProps: AudioVisualizerProps): void {
    if (this.props.analyser !== prevProps.analyser) {
      this.stopVisualization();
      this.setupVisualizer();
    }
  }

  componentWillUnmount() {
    this.stopVisualization();
  }

  stopVisualization() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public setupVisualizer() {
    const { analyser, backgroundColor, lineColor } = this.props;
    const canvas = this.canvasRef.current;

    if (!analyser || !canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.canvasRef.current) return;
      this.animationFrameId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = backgroundColor!;
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = lineColor!;
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }

  render() {
    const { width, height } = this.props;

    const containerStyle: React.CSSProperties = {
      backgroundColor: 'transparent',
      border: '2px solid #333',
      borderRadius: '4px',
      padding: '2px',
    };

    const canvasStyle: React.CSSProperties = {
      width: '100%',
      height: 'auto',
    };

    return React.createElement(
      'div',
      { style: containerStyle },
      React.createElement('canvas', {
        ref: this.canvasRef,
        width: width,
        height: height,
        style: canvasStyle,
      })
    );
  }
}

export default Visualizer;
