import { Pathnames } from 'next-intl/routing';

export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en' as const;
export const localePrefix = 'never' as const;
export const pathnames = {
  '/': '/',
} satisfies Pathnames<typeof locales>;
