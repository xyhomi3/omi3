import { Footer, Navbar } from '../_components';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import type { Metadata } from 'next';
import { Providers } from '../_providers';
import { cn } from '@omi3/utils';
import { routing } from '@/lang';
import { silk } from '@omi3/ui';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Layout.locale' });

  return {
    metadataBase: new URL('https://omi3.dev'),
    title: {
      default: t('title'),
      template: `%s - ${t('title')}`,
    },
    description: t('description'),
    keywords: ['web audio', 'web audio api', 'audio player', 'audio library', 'audio processing', 'open source'],
    referrer: 'origin-when-cross-origin',
    classification: 'Audio',
    category: 'Audio',
    applicationName: 'Omi3',
    creator: 'Omi3',
    authors: [{ name: 'Omi3', url: 'https://omi3.dev' }],
    openGraph: {
      type: 'website',
      siteName: 'Omi3',
      title: {
        default: t('title'),
        template: `%s - ${t('title')}`,
      },
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        nocache: true,
        noimageindex: true,
        nosnippet: true,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  params: { locale: string };
  children: React.ReactNode;
}>) {
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body className={cn(silk.variable, 'font-silk flex min-h-full flex-col antialiased')}>
        <Providers params={{ locale }}>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
