import React from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  width: number;
  height: number;
}

class AudioVisualizer extends React.Component<AudioVisualizerProps> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private animationFrameId: number | null = null;
  constructor(props: AudioVisualizerProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.setupVisualizer();
  }

  componentDidUpdate(prevProps: AudioVisualizerProps) {
    if (this.props.analyser !== prevProps.analyser) {
      this.setupVisualizer();
    }
  }

  componentWillUnmount() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  setupVisualizer() {
    const { analyser } = this.props;
    const canvas = this.canvasRef.current;

    if (!analyser || !canvas) return;

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = ' rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#a3e636';
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

    return (
      <div className="bg-bg dark:bg-darkBg dark:border-darkBorder rounded-base border-2 p-0.5">
        <canvas ref={this.canvasRef} width={width} height={height} className="h-auto w-full" />
      </div>
    );
  }
}

export default AudioVisualizer;
