'use client';

import { Button, Card, CardContent, CardHeader, CardTitle, Icons, Slider } from '@omi3/ui';
import {
  analyserAtom,
  audioStateAtom,
  handlePlayPauseAtom,
  initializeAudioChannelAtom,
  seekAudioAtom,
  setVolumeAtom,
  volumeInitializerAtom,
} from '@/store';
import { playtime, seek } from '@omi3/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

import AudioVisualizer from './visualizer';

export function AudioPlayer() {
  const audioState = useAtomValue(audioStateAtom);
  const analyser = useAtomValue(analyserAtom);
  const handlePlayPause = useSetAtom(handlePlayPauseAtom);
  const initializeAudioChannel = useSetAtom(initializeAudioChannelAtom);
  const seekAudio = useSetAtom(seekAudioAtom);
  const setVolume = useSetAtom(setVolumeAtom);
  const initializeVolume = useSetAtom(volumeInitializerAtom);

  const { isPlaying, currentTime, duration, localVolume, isInitialized } = audioState;

  const handlePlay = useCallback(() => {
    if (!isInitialized) {
      initializeAudioChannel();
    }
    initializeVolume();
    handlePlayPause();
  }, [isInitialized, initializeAudioChannel, handlePlayPause, initializeVolume]);

  const audioHandlers = useMemo(() => seek((time: number) => seekAudio(time)), [seekAudio]);

  const volumeHandlers = useMemo(() => seek((newVolume: number) => setVolume(newVolume)), [setVolume]);

  useAtomValue(initializeAudioChannelAtom);
  useAtomValue(volumeInitializerAtom);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>
          Omi<span className="text-main">3</span> Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <AudioVisualizer analyser={analyser} width={300} height={150} />
        </div>
        <Slider className="mt-4" value={[currentTime]} max={duration} step={0.1} {...audioHandlers} />
        <div className="text-text mt-2 flex w-full justify-between text-sm">
          <span>{playtime(currentTime)}</span>
          <span>{playtime(duration)}</span>
        </div>
        <div className="mt-4 flex items-center">
          <Button size="icon" onClick={handlePlay} className="mr-4">
            {isPlaying ? <Icons.Pause /> : <Icons.Play />}
          </Button>
          <Icons.Volume />
          <Slider className="w-32" value={[localVolume]} max={100} step={1} {...volumeHandlers} />
        </div>
      </CardContent>
    </Card>
  );
}
