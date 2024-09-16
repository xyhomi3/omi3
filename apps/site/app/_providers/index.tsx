import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import { Analytics } from '@vercel/analytics/react';
import { LangProvider } from './lang';
import { ReactNode } from 'react';
import { StoreProvider } from './store';
import { ThemeProvider } from './theme';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export async function Providers({ children, params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <LangProvider messages={messages} locale={locale}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <StoreProvider>{children}</StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </ThemeProvider>
    </LangProvider>
  );
}
