import { AudioChannel, EventHandler } from '@omi3/audio';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const audioChannelAtom = atom<AudioChannel | null>(null);
export const PlaybackState = AudioChannel.PlaybackState;
export const playbackStateAtom = atom<number>(AudioChannel.PlaybackState.IDLE);
export const analyserAtom = atom<AnalyserNode | null>(null);
export const currentTimeAtom = atom(0);
export const durationAtom = atom(0);
export const localVolumeAtom = atomWithStorage('omi3__local__volume', 100);

export const stateAtom = atom((get) => ({
  playbackState: get(playbackStateAtom),
  currentTime: get(currentTimeAtom),
  duration: get(durationAtom),
  localVolume: get(localVolumeAtom),
  isInitialized: get(audioChannelAtom) !== null,
}));

export const eventHandlersAtom = atom<Partial<EventHandler>>({
  onAnalyserCreated: (analyser: AnalyserNode) => {
    analyser.maxDecibels = -90;
  },
});
