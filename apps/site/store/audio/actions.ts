import {
  analyserAtom,
  audioChannelAtom,
  currentTimeAtom,
  durationAtom,
  eventHandlersAtom,
  isPlayingAtom,
  localVolumeAtom,
  volumeInitializerAtom,
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
      analyser.maxDecibels = -90;
      set(analyserAtom, analyser);
    },
    onTimeUpdate: (time: number) => set(currentTimeAtom, time),
    onDurationChange: (duration: number) => set(durationAtom, duration),
    onEnded: () => set(isPlayingAtom, false),
    onStop: () => set(isPlayingAtom, false),
    onPlayStateChange: (isPlaying: boolean) => set(isPlayingAtom, isPlaying),
  };
  const audioChannel = AudioChannel.getInstance(eventHandlers);
  set(audioChannelAtom, audioChannel);
  set(volumeInitializerAtom);
});

export const handlePlayPauseAtom = atom(null, async (get, set) => {
  const audioChannel = get(audioChannelAtom);
  const isPlaying = get(isPlayingAtom);
  const localVolume = get(localVolumeAtom);

  if (!audioChannel) return;

  try {
    if (!isPlaying) {
      await audioChannel.initialize();
      if (!audioChannel.currentMusic) {
        await audioChannel.initialize();
        await audioChannel.load(sampleMusic);
      }
      audioChannel.setVolume(localVolume / 100);
      await audioChannel.play();
    } else {
      audioChannel.pause();
    }
    set(isPlayingAtom, !isPlaying);
  } catch (error) {
    console.error('Erreur lors de la lecture/pause audio:', error);
  }
});

export const seekAudioAtom = atom(null, (get, set, time: number) => {
  const audioChannel = get(audioChannelAtom);
  if (audioChannel) {
    audioChannel.seek(time);
  }
});

export const setVolumeAtom = atom(null, (get, set, newLocalVolume: number) => {
  const audioChannel = get(audioChannelAtom);
  if (audioChannel) {
    audioChannel.setVolume(newLocalVolume / 100);
    set(localVolumeAtom, newLocalVolume);
  }
});
