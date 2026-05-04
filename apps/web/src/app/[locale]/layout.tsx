import clsx from 'clsx';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { payload } from '@/api';
import AppToaster from '@/components/AppToaster';
import { Cookies } from '@/components/Cookies';
import { PayloadLivePreview } from '@/components/PayloadLivePreview/PayloadLivePreview';
import { GlobalsProvider } from '@/contexts/GlobalsContext/GlobalsProvider';
import { PPMori } from '@/utils/customFonts';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import { Layout } from '@/views/Layout';
import type { Config } from '@monorepo/cms/src/payload-types';

import '@/scss/globals.scss';
import 'sonner/dist/styles.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Config['locale'] }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let iconHref: string | undefined;
  try {
    const siteSettings = await payload.findGlobal({
      depth: 1,
      locale,
      slug: 'site-settings',
    });
    const fav = siteSettings.favicon;
    if (fav && typeof fav === 'object' && 'url' in fav && typeof fav.url === 'string' && fav.url) {
      iconHref = resolvePayloadMediaUrl(fav.url);
    }
  } catch {
    // ignore — fallback below
  }

  return {
    description: 'Smarty Landing',
    title: 'Smarty Landing',
    icons: iconHref
      ? {
          icon: iconHref,
          shortcut: iconHref,
        }
      : {
          icon: '/favicon.ico',
        },
  };
}

export const viewport: Viewport = {
  themeColor: '#0e3347',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Config['locale'] }>;
}>) {
  const { locale } = await params;

  let header: unknown;
  let footer: unknown;

  try {
    [header, footer] = await Promise.all([
      payload.findGlobal({ depth: 2, locale, slug: 'header' }),
      payload.findGlobal({ depth: 2, locale, slug: 'footer' }),
    ]);
  } catch (e) {
    console.error('[RootLayout] Failed to load Payload globals. Check NEXT_PUBLIC_CMS_URL and CMS availability.', e);
    header = {} as never;
    footer = {} as never;
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={clsx(PPMori.variable)}>
        <PayloadLivePreview />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalsProvider footer={footer as never} header={header as never}>
            <Layout>{children}</Layout>
            <AppToaster />
            <Cookies />
          </GlobalsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
