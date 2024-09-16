import { Locale, routing } from '@/lang';

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as Locale)) notFound();

  try {
    const messages = (
      await (locale === routing.defaultLocale
        ? import('./lang/messages/en.json')
        : import(`./lang/messages/${locale}.json`))
    ).default;

    return { messages };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
});
