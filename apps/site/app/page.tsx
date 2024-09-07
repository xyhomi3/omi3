import { Metadata } from 'next';
import { AudioPlayer } from './_components/audio';

export const metadata: Metadata = {
  title: 'Player',
};

export default function Home() {
  return <AudioPlayer />;
}
