import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('Pages.notFound');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
};

export default async function NotFound() {
  const t = await getTranslations('Pages.notFound');
  return (
    <main className="flex h-dvh flex-col items-center justify-center p-5">
      <div className="relative text-center max-w-md">
        <h1 className="text-foreground mt-4 text-xl font-bold tracking-tight sm:text-3xl">{`${t('title')} :(`}</h1>
        <p className="text-off-white mt-6 text-base leading-5">
          {t('description')}
        </p>
      </div>
    </main>
  );
}
