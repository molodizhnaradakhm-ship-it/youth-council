export const defaultLocale = 'ua';

export const locales = ['ua', 'en'];

export const validLocales = ['ua', 'en'] as const;

export const localesPayloadConfig = [
  {
    code: 'ua',
    label: 'Українська',
  },
  {
    code: 'en',
    label: 'English',
  },
];

/** Ensures absolute URL for metadata and sitemap; env without scheme (e.g. localhost:2000) breaks URL parsing. */
function normalizePublicUrl(raw: string | undefined): string {
  const t = raw?.trim() ?? '';
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t.replace(/\/$/, '');
  return `http://${t.replace(/^\/+/, '')}`.replace(/\/$/, '');
}

export const SITE_URL = normalizePublicUrl(process.env.NEXT_PUBLIC_URL);
