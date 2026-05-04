import type { MetadataRoute } from 'next';

import { payload } from '@/api';
import { defaultLocale, SITE_URL, validLocales } from '@/utils/config';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

/** Do not call CMS during `next build` (CMS may be down); generate on each request. */
export const dynamic = 'force-dynamic';

function minimalSitemapHomeOnly(): MetadataRoute.Sitemap {
  return validLocales.flatMap((locale) => {
    const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
    return [
      {
        url: `${SITE_URL}${localePrefix}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as ChangeFrequency,
        priority: 1,
      },
    ];
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Function to fetch collection data for each locale
    const fetchLocalizedData = async (collection: any) => {
      const results = await Promise.all(
        validLocales.map(async (locale) => {
          const res = await payload.find({ collection, depth: 0, locale, limit: 0 });
          const docs = res.docs ?? [];
          return docs.map((doc) => ({
            ...doc,
            locale,
          }));
        }),
      );
      return results.flat();
    };

    // Generate URLs for collections
    const generateUrls = (
      items: any[],
      basePath: string,
      changeFreq: ChangeFrequency = 'weekly',
      priorityValue: number = 0.7,
    ): MetadataRoute.Sitemap =>
      items.map((item) => {
        const localizedSlug = item.slug;
        const locale = item.locale;
        const localePrefix = locale === defaultLocale ? '' : `/${locale}`;

        return {
          url: basePath
            ? `${SITE_URL}${localePrefix}/${basePath}/${localizedSlug}`
            : `${SITE_URL}${localePrefix}/${localizedSlug}`,
          lastModified: new Date(item.updatedAt || item.createdAt),
          changeFrequency: changeFreq,
          priority: priorityValue,
        };
      });

    // Get document count for paginated collections
    const blogData = await payload.find({ collection: 'blog', depth: 0, limit: 1 });

    const blogCount = blogData.totalDocs ?? 0;

    // Page size for sitemap (recommended up to 50000 URLs per file)
    const PAGE_SIZE = 1000;

    // Generate URLs for sitemap pagination with locales
    const generateSitemapUrls = (
      totalCount: number,
      basePath: string,
      changeFreq: ChangeFrequency,
      priorityValue: number,
    ): MetadataRoute.Sitemap => {
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);
      return validLocales.flatMap((locale) => {
        const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
        return Array.from({ length: totalPages }, (_, i) => ({
          url: `${SITE_URL}${localePrefix}/${basePath}/sitemap/${i + 1}`,
          lastModified: new Date(),
          changeFrequency: changeFreq,
          priority: priorityValue,
        }));
      });
    };

    // Get data for other collections
    const [pages, authors, participants, projects] = await Promise.all([
      fetchLocalizedData('pages'),
      fetchLocalizedData('blog-authors'),
      fetchLocalizedData('participants'),
      fetchLocalizedData('projects'),
    ]);

    // Generate URLs for each collection
    const pageUrls = generateUrls(pages, '', 'weekly', 1);
    const authorUrls = generateUrls(authors, 'author', 'monthly', 0.6);
    const participantUrls = generateUrls(participants, 'participants', 'monthly', 0.6);
    const projectUrls = generateUrls(projects, 'projects', 'monthly', 0.6);

    // Generate URLs for paginated sitemaps
    const blogSitemapUrls = generateSitemapUrls(blogCount, 'blog', 'daily', 0.8);

    // Static URLs for home pages for each locale
    const staticUrls: MetadataRoute.Sitemap = validLocales.flatMap((locale) => {
      const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
      return [
        {
          url: `${SITE_URL}${localePrefix}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as ChangeFrequency,
          priority: 1,
        },
        {
          url: `${SITE_URL}${localePrefix}/participants`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.7,
        },
        {
          url: `${SITE_URL}${localePrefix}/projects`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as ChangeFrequency,
          priority: 0.7,
        },
      ];
    });

    // Return combined sitemap index
    return [
      ...staticUrls,
      ...pageUrls,
      ...blogSitemapUrls,
      ...authorUrls,
      ...participantUrls,
      ...projectUrls,
    ];
  } catch (e) {
    console.error('[sitemap] CMS fetch failed, returning home URLs only', e);
    return minimalSitemapHomeOnly();
  }
}
