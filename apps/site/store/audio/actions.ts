import {
  analyserAtom,
  audioChannelAtom,
  currentTimeAtom,
  durationAtom,
  eventHandlersAtom,
  localVolumeAtom,
  playbackStateAtom,
} from './atoms';

import { AudioChannel } from '@omi3/audio';
import { atom } from 'jotai';

const sampleMusic = {
  url: 'https://cdn.pixabay.com/audio/2023/12/29/audio_a1497a53af.mp3',
};

export const initializeAudioChannelAtom = atom(null, (get, set) => {
  const eventHandlers = {
    ...get(eventHandlersAtom),
    onAnalyserCreated: (analyser: AnalyserNode) => {
      set(analyserAtom, analyser);
    },
    onTimeUpdate: (time: number) => set(currentTimeAtom, time),
    onDurationChange: (duration: number) => set(durationAtom, duration),
    onEnded: () => set(playbackStateAtom, AudioChannel.PlaybackState.IDLE),
    onStop: () => set(playbackStateAtom, AudioChannel.PlaybackState.IDLE),
    onPlay: () => set(playbackStateAtom, AudioChannel.PlaybackState.PLAYING),
    onPause: () => set(playbackStateAtom, AudioChannel.PlaybackState.PAUSED),
    onSeek: (time: number) => {
      set(currentTimeAtom, time);
    },
    onPlayStateChange: (isPlaying: boolean) => {
      set(playbackStateAtom, isPlaying ? AudioChannel.PlaybackState.PLAYING : AudioChannel.PlaybackState.PAUSED);
    },
  };
  const audioChannel = AudioChannel.getInstance(eventHandlers);
  set(audioChannelAtom, audioChannel);
});

export const togglePlayPauseAtom = atom(null, async (get, set) => {
  const audioChannel = get(audioChannelAtom);
  const playbackState = get(playbackStateAtom);
  const localVolume = get(localVolumeAtom);
  const currentTime = get(currentTimeAtom);

  if (!audioChannel) return;

  try {
    if (playbackState !== AudioChannel.PlaybackState.PLAYING) {
      await audioChannel.initialize();
      if (!audioChannel.currentMusic) {
        set(playbackStateAtom, AudioChannel.PlaybackState.LOADING);
        await audioChannel.load(sampleMusic);
      }
      audioChannel.setVolume(localVolume / 100);
      if (currentTime > 0) {
        audioChannel.seek(currentTime);
      }
      await audioChannel.play();
    } else {
      audioChannel.pause();
    }
  } catch (error) {
    set(playbackStateAtom, AudioChannel.PlaybackState.ERROR);
  }
});

export const seekAtom = atom(null, (get, set, time: number) => {
  const audioChannel = get(audioChannelAtom);
  if (audioChannel) {
    audioChannel.seek(time);
    set(currentTimeAtom, time);
  }
});

export const setVolumeAtom = atom(null, (get, set, newLocalVolume: number) => {
  const audioChannel = get(audioChannelAtom);
  if (audioChannel) {
    audioChannel.setVolume(newLocalVolume / 100);
    set(localVolumeAtom, newLocalVolume);
  }
});
