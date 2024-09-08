import { AudioPlayer } from './_components/audio';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player',
};

export default function Home() {
  return (
    <div className="w-full max-w-md">
      <AudioPlayer />
    </div>
  );
}
