import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import type { Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ locale: Config['locale'] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });

  return {
    description: t('public_offer_coaches.meta_description'),
    title: t('public_offer_coaches.meta_title'),
  };
}

export default async function PublicOfferCoachesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'not_found' });

  return (
    <main style={{ padding: 24 }}>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}
