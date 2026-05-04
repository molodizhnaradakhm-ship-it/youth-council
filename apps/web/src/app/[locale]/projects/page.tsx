import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { payload } from '@/api';
import { ProjectsView } from '@/views/Projects/Projects';
import type { Config } from '@monorepo/cms/src/payload-types';

const PAGE_SIZE = 20;

type Props = {
  params: Promise<{ locale: Config['locale'] }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  return {
    description: t('meta_description'),
    title: t('meta_title'),
  };
}

export default async function ProjectsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const pageRaw = parseInt(String(sp?.page ?? '1'), 10);
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const res = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: PAGE_SIZE,
    locale,
    page: currentPage,
    sort: 'title',
  });

  return (
    <ProjectsView
      currentPage={currentPage}
      pageSize={PAGE_SIZE}
      projects={res.docs ?? []}
      totalDocs={res.totalDocs ?? 0}
    />
  );
}
