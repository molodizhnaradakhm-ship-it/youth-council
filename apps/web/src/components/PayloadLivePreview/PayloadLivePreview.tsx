'use client';

import { useRouter } from 'next/navigation';

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';

/**
 * Live Preview в админке Payload: iframe с сайтом получает postMessage и дергает refresh().
 * `serverURL` — origin CMS (NEXT_PUBLIC_CMS_URL), совпадает с проверкой в `@payloadcms/live-preview`.
 */
export function PayloadLivePreview() {
  const router = useRouter();
  const serverURL = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ?? '';

  if (!serverURL) {
    return null;
  }

  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />;
}
