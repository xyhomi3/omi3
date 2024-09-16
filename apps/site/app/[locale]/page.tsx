import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { AudioPlayer } from '../_components';
import { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Pages.player' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return (
    <main className="flex flex-grow items-center justify-center p-5" role="main">
      <section className="w-full max-w-lg">
        <AudioPlayer />
      </section>
    </main>
  );
}
