import { MAIN_URL } from '@omi3/utils';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
      },
    ],
    sitemap: `${MAIN_URL}/sitemap.xml`,
    host: MAIN_URL,
  };
}
