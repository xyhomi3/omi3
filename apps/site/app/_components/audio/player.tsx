'use client';

import { AudioChannel, Visualizer } from '@omi3/audio';
import { Button, Card, CardContent, CardHeader, CardTitle, Icons, Slider } from '@omi3/ui';
import { playtime, seek } from '@omi3/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

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
        return <Icons.Pause />;
      case AudioChannel.PlaybackState.LOADING:
        return <Icons.Loader2 className="animate-spin" />;
      default:
        return <Icons.Play />;
    }
  }, [playbackState]);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>
          Omi<span className="text-main">3</span> Player
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Visualizer analyser={analyser} width={300} height={150} />
        </div>
        <Slider
          className="mt-4"
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={audioHandlers.onValueChange}
          onValueCommit={audioHandlers.onValueCommit}
        />
        <div className="text-text mt-2 flex w-full justify-between text-sm">
          <span>{playtime(currentTime)}</span>
          <span>{playtime(duration)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button size="icon" onClick={handlePlay} disabled={playbackState === AudioChannel.PlaybackState.LOADING}>
            {getPlayPauseIcon()}
          </Button>
          <div className="flex items-center gap-2">
            {getVolumeIcon()}
            <Slider className="w-32" value={[localVolume]} max={100} step={1} {...volumeHandlers} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
