'use client';

import { AudioChannel, Visualizer } from '@omi3/audio';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons, Slider } from '@omi3/ui';
import { playtime, seek } from '@omi3/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

import { ThemeWidget } from '../theme';
import { audio } from '@/store';

export function AudioPlayer() {
  const audioState = useAtomValue(audio.stateAtom);
  const analyser = useAtomValue(audio.analyserAtom);
  const togglePlayPause = useSetAtom(audio.togglePlayPauseAtom);
  const initializeAudioChannel = useSetAtom(audio.initializeAudioChannelAtom);
  const seekAudio = useSetAtom(audio.seekAtom);
  const setVolume = useSetAtom(audio.setVolumeAtom);

  const { playbackState, currentTime, duration, localVolume, isInitialized } = audioState;

  const handlePlay = useCallback(() => {
    if (!isInitialized) {
      initializeAudioChannel();
    }
    togglePlayPause();
  }, [isInitialized, initializeAudioChannel, togglePlayPause]);

  const audioHandlers = useMemo(
    () => ({
      onValueChange: (values: number[]) => {
        seekAudio(values[0]);
      },
      onValueCommit: (values: number[]) => {
        if (values.length > 0) {
          seekAudio(values[0]);
        }
      },
    }),
    [seekAudio],
  );

  const volumeHandlers = useMemo(() => seek((newVolume: number) => setVolume(newVolume)), [setVolume]);

  useAtomValue(audio.initializeAudioChannelAtom);

  const getVolumeIcon = useCallback(() => {
    if (localVolume === 0) return <Icons.VolumeX />;
    if (localVolume < 50) return <Icons.Volume1 />;
    return <Icons.Volume2 />;
  }, [localVolume]);

  const getPlayPauseIcon = useCallback(() => {
    switch (playbackState) {
      case AudioChannel.PlaybackState.PLAYING:
        return <Icons.Pause className="fill-text" />;
      case AudioChannel.PlaybackState.LOADING:
        return <Icons.Loader2 className="animate-spin" />;
      default:
        return <Icons.Play className="fill-text" />;
    }
  }, [playbackState]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Omi<span className="text-[#ff6b6b]">3</span> Player
        </CardTitle>
        <ThemeWidget />
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Visualizer
            analyser={analyser}
            width={300}
            height={150}
            className="border-border dark:border-darkBorder rounded-base border-2"
            aria-label="Visualiseur audio"
          />
        </div>
        <div className="relative mt-4">
          <Slider
            className="mt-4"
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={audioHandlers.onValueChange}
            onValueCommit={audioHandlers.onValueCommit}
          />
          <span className="sr-only">Progression de la lecture : {playtime(currentTime)} sur {playtime(duration)}</span>
        </div>
        <div className="mt-2 flex w-full justify-between text-sm">
          <span>{playtime(currentTime)}</span>
          <span>{playtime(duration)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button
            size="icon"
            onClick={handlePlay}
            disabled={playbackState === AudioChannel.PlaybackState.LOADING}
            aria-label={playbackState === AudioChannel.PlaybackState.PLAYING ? 'Pause' : 'Lecture'}
          >
            {getPlayPauseIcon()}
          </Button>
          <div className="flex items-center gap-2">
            <span aria-hidden="true">{getVolumeIcon()}</span>
            <div className="relative w-32">
              <Slider
                value={[localVolume]}
                max={100}
                step={1}
                {...volumeHandlers}
              />
              <span className="sr-only">Contrôle du volume : {localVolume}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
