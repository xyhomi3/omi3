'use client';

import { AudioChannel, Visualizer } from '@omi3/audio';
import { Button, Card, CardContent, Icons, Slider } from '@omi3/ui';
import { playtime, seek } from '@omi3/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

import { audio } from '@/store';
import { useTranslations } from 'next-intl';

export function AudioPlayer() {
  const t = useTranslations('Components.audio.player');
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

  const getThumbProps = useCallback(
    (value: number) => ({
      'aria-label': t('currentValue', { value }),
      title: t('currentValue', { value }),
    }),
    [t],
  );

  return (
    <Card className="w-full">
      <CardContent className="pt-5">
        <div className="w-full">
          {isInitialized ? (
            <Visualizer
              analyser={analyser}
              width={300}
              height={150}
              className="border-border dark:border-darkBorder rounded-base border-2"
              aria-label={t('visualizer')}
            />
          ) : (
            <div className="border-border dark:border-darkBorder rounded-base bg-bg dark:bg-darkBg flex h-[238px] w-full flex-col items-center justify-center border-2 p-4 text-center text-sm">
              <p>{t('pressPlayMessage')}</p>
            </div>
          )}
        </div>
        <div className="relative mt-4">
          <Slider
            className="mt-4"
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={audioHandlers.onValueChange}
            onValueCommit={audioHandlers.onValueCommit}
            aria-label={t('playbackProgress', { current: playtime(currentTime), total: playtime(duration) })}
            thumbProps={getThumbProps(currentTime)}
          />
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
            aria-label={playbackState === AudioChannel.PlaybackState.PLAYING ? t('pause') : t('play')}
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
                aria-label={t('volumeControl', { volume: localVolume })}
                thumbProps={getThumbProps(localVolume)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
