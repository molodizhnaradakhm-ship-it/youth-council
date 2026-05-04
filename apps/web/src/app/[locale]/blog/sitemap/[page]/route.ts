import { payload } from '@/api';
import { defaultLocale, SITE_URL, validLocales } from '@/utils/config';

const PAGE_SIZE = 1000;

/** Node: Payload fetch + optional self-signed TLS; Edge cannot bundle Node TLS/fetch stack. */
export const runtime = 'nodejs';

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function urlEntry({ loc, lastmod }: { loc: string; lastmod: string }): string {
  return ['  <url>', `    <loc>${xmlEscape(loc)}</loc>`, `    <lastmod>${xmlEscape(lastmod)}</lastmod>`, '  </url>'].join(
    '\n',
  );
}

function buildSitemapXml(entries: string[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
  ].join('\n');
}

export async function GET(request: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return new Response('Invalid page number', { status: 400 });
  }

  // Get all posts for all locales
  const results = await Promise.all(
    validLocales.map(async (locale) => {
      const res = await payload.find({
        collection: 'blog',
        depth: 0,
        locale,
        limit: PAGE_SIZE,
        page: pageNumber,
        sort: '-createdAt',
      });
      const docs = res.docs ?? [];
      return docs.map((doc) => ({
        slug: doc.slug,
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
        locale,
      }));
    }),
  );

  const allDocs = results.flat();

  const entries = allDocs.map((doc) => {
    const localePrefix = doc.locale === defaultLocale ? '' : `/${doc.locale}`;
    const loc = `${SITE_URL}${localePrefix}/blog/${doc.slug}`;
    const lastmod = new Date(doc.updatedAt || doc.createdAt).toISOString();
    return urlEntry({ loc, lastmod });
  });
  const sitemap = buildSitemapXml(entries);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
