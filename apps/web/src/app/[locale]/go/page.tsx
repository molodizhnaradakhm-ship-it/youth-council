import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { OpenAppLink } from '@/views/OpenAppLink';
import type { Config } from '@monorepo/cms/src/payload-types';

type MetadataProps = {
  params: Promise<{ locale: Config['locale'] }>;
};

type PageProps = {
  searchParams: Promise<{ url?: string; u?: string; link?: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'open_app' });

  return {
    description: t('meta_description'),
    robots: { index: false, follow: false },
    title: t('meta_title'),
  };
}

export default async function OpenAppPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const deepLinkParam = sp.url ?? sp.u ?? sp.link;

  return <OpenAppLink deepLinkParam={deepLinkParam} />;
}

export const dynamic = 'force-dynamic';
