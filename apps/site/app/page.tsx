import { AudioPlayer } from './_components/audio';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Player',
};

export default function Home() {
  return (
    <main className="flex flex-grow items-center justify-center p-5" role="main">
      <div className="w-full max-w-md">
        <AudioPlayer />
      </div>
    </main>
  );
}
