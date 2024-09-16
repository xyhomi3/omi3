'use client';

import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

type Props = {
  messages: AbstractIntlMessages;
  children: React.ReactNode;
  locale: string;
};

export function LangProvider({ messages, locale, children }: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      defaultTranslationValues={{
        i: (text) => <i>{text}</i>,
      }}
      timeZone="Africa/Dakar"
    >
      {children}
    </NextIntlClientProvider>
  );
}
