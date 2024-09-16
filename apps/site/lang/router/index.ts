import { defaultLocale, localePrefix, locales, pathnames } from '../config';

import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales,
  defaultLocale,
  pathnames,
  localePrefix,
});
export const { Link, redirect, usePathname, useRouter, getPathname } = createLocalizedPathnamesNavigation(routing);

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
export type PathnameKey = keyof typeof routing.pathnames;
