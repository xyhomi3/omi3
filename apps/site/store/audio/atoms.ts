import { AudioChannel, EventHandler } from '@omi3/audio';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const audioChannelAtom = atom<AudioChannel | null>(null);
export const isPlayingAtom = atom(false);
export const analyserAtom = atom<AnalyserNode | null>(null);
export const currentTimeAtom = atom(0);
export const durationAtom = atom(0);
export const volumeAtom = atom(1);
export const localVolumeAtom = atomWithStorage('omi3__local__volume', 100);

export const audioStateAtom = atom((get) => ({
  isPlaying: get(isPlayingAtom),
  currentTime: get(currentTimeAtom),
  duration: get(durationAtom),
  localVolume: get(localVolumeAtom),
  isInitialized: get(audioChannelAtom) !== null,
}));

export const eventHandlersAtom = atom<Partial<EventHandler>>({});

export const volumeInitializerAtom = atom(null, (get) => {
  const audioChannel = get(audioChannelAtom);
  const localVolume = get(localVolumeAtom);
  if (audioChannel) {
    audioChannel.setVolume(localVolume / 100);
  }
});
