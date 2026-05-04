import { getServerSideURL } from '@monorepo/cms/src/utilites/getURL';

/**
 * Payload media `url` may be a site-relative path or an absolute URL (e.g. S3/MinIO).
 * Never prefix `NEXT_PUBLIC_CMS_URL` onto an already-absolute URL.
 */
export function resolvePayloadMediaUrl(url: string): string {
  const trimmed = String(url).trim();
  if (trimmed === '') {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const base = getServerSideURL().replace(/\/$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return `${base}${path}`;
}
