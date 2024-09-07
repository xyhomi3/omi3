'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from '@omi3/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AudioChannel } from '@omi3/audio';
import AudioVisualizer from './visualizer';
import { playtime } from '@omi3/utils';

const sampleMusic = {
  url: 'https://cdn.pixabay.com/audio/2023/12/29/audio_a1497a53af.mp3',
};

export function AudioPlayer() {
  const [audioChannel, setAudioChannel] = useState<AudioChannel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const eventHandlers = useMemo(
    () => ({
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onEnded: () => setIsPlaying(false),
      onAnalyserCreated: (newAnalyser: AnalyserNode) => {
        newAnalyser.fftSize = 1024; // ou 2048 pour plus de détails
        newAnalyser.smoothingTimeConstant = 0.8;
        newAnalyser.minDecibels = -90;
        newAnalyser.maxDecibels = -10;
        setAnalyser(newAnalyser);
      },
      onTimeUpdate: (time: number) => setCurrentTime(time),
      onDurationChange: (newDuration: number) => setDuration(newDuration),
      onStop: () => setIsPlaying(false),
    }),
    [],
  );

  useEffect(() => {
    const channel = AudioChannel.getInstance(eventHandlers);
    setAudioChannel(channel);

    return () => {
      channel.dispose();
    };
  }, [eventHandlers]);

  const handlePlayPause = useCallback(async () => {
    if (!audioChannel) return;

    try {
      if (!isPlaying) {
        await audioChannel.initialize();
        if (!audioChannel.currentMusic) {
          await audioChannel.load(sampleMusic);
        }
        await audioChannel.play();
      } else {
        audioChannel.pause();
      }
    } catch (error) {
      console.error('Erreur lors de la lecture/pause audio:', error);
    }
  }, [audioChannel, isPlaying]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>
          Omi<span className="text-main">3</span> Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AudioVisualizer analyser={analyser} width={300} height={150} />
        <Progress value={(currentTime / duration) * 100} className="mt-4" />
        <div className="text-text mt-2 w-full text-sm">
          {playtime(currentTime)} / {playtime(duration)}
        </div>
        <Button onClick={handlePlayPause} className="mt-4 w-full">
          {isPlaying ? 'Pause' : 'Lecture'}
        </Button>
      </CardContent>
    </Card>
  );
}
