import { getPathname, routing } from '@/lang';

import { MAIN_URL } from '@omi3/utils';

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternateRefs?: Array<{ href: string; hreflang: string }>;
}

/**
 * Generates a complete URL for a given route and locale
 * @param endpointUrl - The base URL of the site
 * @param key - The path key
 * @param locale - The locale
 * @param params - Optional parameters for dynamic routes
 * @returns The generated complete URL
 */
export function getUrl(
  endpointUrl: string,
  key: keyof typeof routing.pathnames,
  locale: (typeof routing.locales)[number],
  params?: Record<string, string>,
): string {
  let pathname = getPathname({ locale, href: key });

  if (params) {
    pathname = Object.entries(params).reduce((path, [param, value]) => path.replace(`[${param}]`, value), pathname);
  }

  return `${endpointUrl}/${locale}${pathname === '/' ? '' : pathname}`;
}

/**
 * Filters static routes (without dynamic parameters)
 * @param keys - Array of all path keys
 * @returns Array of static route keys
 */
export const getStaticRoutes = (keys: Array<keyof typeof routing.pathnames>): Array<keyof typeof routing.pathnames> =>
  keys.filter((key) => !key.toString().includes('['));

/**
 * Generates sitemap entries for each static route and each locale
 * @param staticRoutes - Array of static routes
 * @param locales - Array of supported locales
 * @param defaultLocale - The default locale
 * @param getUrlFunc - Function to generate URLs
 * @returns Array of sitemap entries
 */
export function generateLocaleRoutes(
  staticRoutes: Array<keyof typeof routing.pathnames>,
  locales: ReadonlyArray<(typeof routing.locales)[number]>,
  defaultLocale: (typeof routing.locales)[number],
  getUrlFunc: typeof getUrl,
): SitemapEntry[] {
  return staticRoutes.flatMap((key) =>
    locales.map(
      (locale): SitemapEntry => ({
        url: getUrlFunc(MAIN_URL, key, locale),
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: locale === defaultLocale ? 1.0 : 0.8,
        alternateRefs: locales
          .filter((l) => l !== locale)
          .map((l) => ({
            href: getUrlFunc(MAIN_URL, key, l),
            hreflang: l,
          })),
      }),
    ),
  );
}
