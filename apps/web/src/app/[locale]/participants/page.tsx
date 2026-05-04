import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { payload } from '@/api';
import { buildParticipantSearchWhere } from '@/utils/participantSearchWhere';
import { ParticipantsView } from '@/views/Participants/Participants';
import type { Config } from '@monorepo/cms/src/payload-types';

const PAGE_SIZE = 20;

type Props = {
  params: Promise<{ locale: Config['locale'] }>;
  searchParams: Promise<{ page?: string; q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'participants' });
  return {
    description: t('meta_description'),
    title: t('meta_title'),
  };
}

export default async function ParticipantsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const q = typeof sp?.q === 'string' ? sp.q : '';
  const pageRaw = parseInt(String(sp?.page ?? '1'), 10);
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const where = buildParticipantSearchWhere(q);

  const res = await payload.find({
    collection: 'participants',
    depth: 1,
    limit: PAGE_SIZE,
    locale,
    page: currentPage,
    sort: 'title',
    ...(Object.keys(where).length > 0 ? { where: where as never } : {}),
  });

  const participants = res.docs ?? [];
  const totalDocs = res.totalDocs ?? 0;

  return (
    <ParticipantsView
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
      participants={participants}
      query={q}
      totalDocs={totalDocs}
    />
  );
}
