import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from './utils/config';

const handleI18nRouting = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localeDetection: false,
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/').filter(Boolean);
  const currentLocaleCandidate = segments[0];
  const hasLocale = Array.isArray(locales) && locales.includes(currentLocaleCandidate);
  const localePrefix = hasLocale ? `/${currentLocaleCandidate}` : `/${defaultLocale}`;

  // Fetch redirects from Payload API (no-store to avoid stale values in middleware)
  let redirects: { docs?: any[] } = { docs: [] };
  try {
    redirects = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '')}/api/redirects?limit=100`, {
      cache: 'no-store',
    }).then((res) => res.json());
  } catch {
    // CMS недоступен (например, ещё не поднялся) — не блокируем весь сайт
  }

  // Find matching redirect (ignore leading locale in pathname)
  const pathnameWithoutLocale = hasLocale ? `/${segments.slice(1).join('/')}` : pathname;
  const redirect = redirects.docs?.find((r: any) => {
    // Normalize paths for comparison (remove trailing slashes)
    const normalizedFrom = r.from.replace(/\/$/, '');
    const normalizedPathname = pathnameWithoutLocale.replace(/\/$/, '');
    return normalizedFrom === normalizedPathname || r.from === pathnameWithoutLocale;
  });

  if (redirect) {
    let destinationPath: string;

    if (redirect.to.type === 'reference') {
      const value = redirect.to.reference?.value ?? {};
      const slug = value.slug ?? value.slugs?.[defaultLocale] ?? value.slugs?.en;

      destinationPath = `/${slug}`;
    } else {
      destinationPath = redirect.to.url;
    }

    // Prefix locale for internal paths; keep absolute URLs untouched
    const isAbsolute = /^https?:\/\//.test(destinationPath);
    const destination = isAbsolute ? destinationPath : `${localePrefix}${destinationPath}`;

    const targetUrl = isAbsolute ? new URL(destination) : new URL(destination, request.url);
    return NextResponse.redirect(targetUrl, redirect.type === '301' ? 301 : 302);
  }

  // Continue with i18n routing if no redirect matched
  const response = handleI18nRouting(request);
  response.headers.set(
    'x-your-custom-locale',
    hasLocale ? currentLocaleCandidate : defaultLocale,
  );

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    // Exclude public assets (e.g. /home/map-base.svg, /logo.svg) so files in apps/web/public are not rewritten by i18n.
    '/((?!_next/static|sitemap|robots|api|icons|_next/image|img/|home/|logo\\.svg|favicon.ico|favicon).*)',
    // '/(ua|en)/:path*',
  ],
};
