import { defaultLocale } from '@/config';

function normalizeWebBase(): string {
  const raw = process.env.WEB_URL?.trim();
  if (!raw) {
    return 'http://localhost:2000';
  }
  return raw.replace(/\/$/, '');
}

/** next-intl `localePrefix: 'as-needed'` — default locale без префикса в URL. */
function localePathPrefix(locale: unknown): string {
  const code =
    typeof locale === 'string'
      ? locale
      : locale && typeof locale === 'object' && 'code' in locale
        ? String((locale as { code: string }).code)
        : defaultLocale;
  return code === defaultLocale ? '' : `/${code}`;
}

type LivePreviewUrlArgs = {
  collectionConfig?: { slug?: string } | null;
  data?: Record<string, unknown> | null;
  globalConfig?: { slug?: string } | null;
  locale?: unknown;
};

/**
 * URL превью фронта для Live Preview в админке (iframe).
 * `WEB_URL` — публичный URL сайта (как в коллекциях `admin.preview`).
 */
export function buildLivePreviewUrl({
  collectionConfig,
  data,
  globalConfig,
  locale,
}: LivePreviewUrlArgs): string {
  const base = normalizeWebBase();
  const lp = localePathPrefix(locale);

  if (globalConfig?.slug) {
    return `${base}${lp || '/'}`;
  }

  const slug = collectionConfig?.slug;
  const d = data ?? {};

  if (slug === 'pages') {
    const pageSlug = typeof d.slug === 'string' ? d.slug : 'home';
    const path = pageSlug === 'home' ? '' : `/${pageSlug}`;
    return `${base}${lp}${path}`;
  }

  if (slug === 'blog') {
    const s = typeof d.slug === 'string' ? d.slug : '';
    if (!s) {
      return `${base}${lp}/blog`;
    }
    return `${base}${lp}/blog/${s}`;
  }

  if (slug === 'blog-authors') {
    const s = typeof d.slug === 'string' ? d.slug : '';
    if (!s) {
      return `${base}${lp}`;
    }
    return `${base}${lp}/author/${s}`;
  }

  if (slug === 'explore-pages' || slug === 'explore-sections') {
    return `${base}${lp}/explore`;
  }

  return `${base}${lp || '/'}`;
}
