import { getCmsBaseUrl } from '@/lib/cmsBaseUrl';
import type { Config } from '@monorepo/cms/src/payload-types';

import { PayloadApiClient } from '@payload-enchants/sdk';

type PayloadClient = PayloadApiClient<Config>;

let client: PayloadClient | undefined;

/**
 * Self-signed CMS TLS (staging): Node’s native fetch respects NODE_TLS_REJECT_UNAUTHORIZED.
 * Do not use with undici/Agent — it breaks Edge/webpack bundles that import @/api.
 * Never enable in production with a proper public CMS certificate.
 */
if (process.env.PAYLOAD_FETCH_ALLOW_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

function getCmsBase(): string {
  return getCmsBaseUrl();
}

function requestUrlString(input: URL | RequestInfo): string {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof URL) {
    return input.href;
  }
  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.url;
  }
  return String(input);
}

/**
 * Payload JSON APIs must return JSON. HTML almost always means wrong base URL
 * (e.g. NEXT_PUBLIC_CMS_URL=http://localhost:3000 → Next.js app, not CMS on :3001)
 * or the CMS is down and a proxy returns an HTML error page.
 */
async function payloadFetcher(input: URL | RequestInfo, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, { ...(init ?? {}), next: { tags: ['tag'] } });
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('text/html')) {
    const base = getCmsBase();
    const reqUrl = requestUrlString(input);
    throw new Error(
      `[Payload API] Got HTML instead of JSON for ${reqUrl}. ` +
        `NEXT_PUBLIC_CMS_URL is "${base}" — it must be the Payload CMS origin (e.g. http://localhost:3001), not the web app (e.g. :3000). Start the CMS or fix the env.`,
    );
  }
  return res;
}

function getClient(): PayloadClient {
  if (!client) {
    // @ts-ignore
    client = new PayloadApiClient<Config>({
      apiURL: `${getCmsBase()}/api`,
      fetcher: payloadFetcher,
    });
  }
  return client;
}

export const payload = new Proxy({} as PayloadClient, {
  get(_target, prop) {
    const c = getClient();
    const value = Reflect.get(c, prop as keyof PayloadClient);
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(c) : value;
  },
});
