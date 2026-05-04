import type { Metadata } from 'next';

import { defaultLocale, locales, SITE_URL } from '@/utils/config';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import type { ExplorePage } from '@monorepo/cms/src/payload-types';

const HOME_PAGE_SLUG = 'home' as const;

function removeLastSlash(text: string): string {
  return text.endsWith('/') ? text.replace(/\/$/, '') : text;
}

/** Collapse duplicate slashes in path only; never strip `://` from `http://` / `https://`. */
function collapseDuplicateSlashes(url: string): string {
  return url.replace(/([^:]\/)\/+/g, '$1');
}

const resolveAlternatesByInput = ({
  basePath,
  slugs,
}: {
  basePath: string;
  slugs?: Record<string, string>;
}) => {
  if (!basePath || !slugs) return null;

  return locales.reduce<Record<string, string>>((acc, locale) => {
    const base = `${SITE_URL}/${locale}${basePath}`;

    const slug = slugs[locale];

    const slugPart = !slug || slug === HOME_PAGE_SLUG ? '' : slug;
    const url = slugPart ? `${base}/${slugPart}` : base;

    acc[locale === 'ua' ? 'uk' : locale] = removeLastSlash(collapseDuplicateSlashes(url));

    return acc;
  }, {});
};

type MetadataArgs = {
  doc: any;
  basePath: string;
};

export const generatePageMetadata = ({ doc, basePath }: MetadataArgs) => {
  if (!doc) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      robots: 'noindex, nofollow',
    };
  }

  const canonicalPath = doc.slug || '';

  const image =
    doc.meta?.image && typeof doc.meta?.image === 'object' && doc.meta?.image.url
      ? doc.meta.image.url
      : `${SITE_URL}/default-image.jpg`;

  const alternates = resolveAlternatesByInput({ basePath, slugs: doc.slugs });

  const canonical =
    alternates &&
    collapseDuplicateSlashes(
      alternates[(defaultLocale as string) === 'ua' ? 'uk' : defaultLocale].replace(
        `${SITE_URL}/${defaultLocale}`,
        SITE_URL,
      ),
    );

  return {
    robots: 'index, follow',
    ...(alternates &&
      canonical && {
        alternates: {
          canonical,
          languages: alternates,
        },
      }),
    description: doc.meta?.description || 'Smarty Landing',
    openGraph: {
      title: doc.meta?.title || 'Smarty Landing',
      description: doc.meta?.description || 'Smarty Landing',
      images: [
        {
          url: image,
          alt: doc.meta?.image?.alt || 'Smarty Landing',
          width: 1200,
          height: 630,
        },
      ],
      url: `${SITE_URL}/${canonicalPath}`,
      siteName: 'Smarty Landing',
      type: 'website',
    },
    title: doc.meta?.title || 'Smarty Landing',
  };
};

/** SEO for `/explore/...` — uses `meta` when set, else main title + site suffix. */
export function generateExplorePageMetadata({
  page,
  siteSuffix,
}: {
  page: ExplorePage | null;
  siteSuffix: string;
}): Metadata {
  if (!page) {
    return { title: siteSuffix };
  }

  const pageTitle = page.title?.trim() ?? '';
  const metaTitle = page.meta?.title?.trim();
  const browserTitle = metaTitle ? metaTitle : pageTitle ? `${pageTitle} — ${siteSuffix}` : siteSuffix;

  const description = page.meta?.description?.trim() || undefined;

  let imageUrl = `${SITE_URL}/default-image.jpg`;
  const metaImg = page.meta?.image;
  if (metaImg && typeof metaImg === 'object' && 'url' in metaImg && metaImg.url) {
    imageUrl = resolvePayloadMediaUrl(String(metaImg.url));
  }

  const ogTitle = metaTitle || pageTitle || siteSuffix;

  return {
    description: description ?? 'Smarty Landing',
    openGraph: {
      description: description ?? siteSuffix,
      images: [
        {
          alt: (typeof metaImg === 'object' && metaImg && 'alt' in metaImg && metaImg.alt) || ogTitle,
          height: 630,
          url: imageUrl,
          width: 1200,
        },
      ],
      siteName: 'Smarty Landing',
      title: ogTitle,
      type: 'website',
    },
    robots: 'index, follow',
    title: browserTitle,
  };
}
