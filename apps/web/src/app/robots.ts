import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/utils/config';

export default function robots(): MetadataRoute.Robots {
  // test
  return {
    rules: {
      allow: "/",
      userAgent: '*',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
