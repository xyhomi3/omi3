import { generateLocaleRoutes, getStaticRoutes, getUrl } from './_utils/sitemap';

import { MetadataRoute } from 'next';
import { routing } from '@/lang';

export default function sitemap(): MetadataRoute.Sitemap {
  const keys = Object.keys(routing.pathnames) as Array<keyof typeof routing.pathnames>;
  const staticRoutes = getStaticRoutes(keys);
  const localeRoutes = generateLocaleRoutes(staticRoutes, routing.locales, routing.defaultLocale, getUrl);

  return localeRoutes as MetadataRoute.Sitemap;
}
