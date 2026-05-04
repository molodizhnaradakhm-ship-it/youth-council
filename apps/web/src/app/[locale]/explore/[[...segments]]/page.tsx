import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { ExploreSegmentsLength } from '@/constants/explore';
import {
  fetchExploreNavTreesBySection,
  fetchExplorePagesBySectionId,
  fetchExploreSections,
  resolveExploreDefaultHref,
} from '@/lib/exploreData';
import { firstExplorePageHref, resolveExplorePageFromSegments } from '@/lib/exploreTree';
import { generateExplorePageMetadata } from '@/utils/seoUtils';
import { ExplorePage as ExplorePageView } from '@/views/Explore';
import type { Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ locale: Config['locale']; segments?: string[] }>;
};

async function findSectionBySlug(slug: string, locale: Config['locale']) {
  const sections = await fetchExploreSections(locale);

  return sections.find((s) => s.slug === slug) ?? null;
}

async function generateExploreRootMetadata({ locale }: { locale: Config['locale'] }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'details' });
  return { title: t('page_title') };
}

async function generateExploreSectionMetadata({
  locale,
  segs,
}: {
  locale: Config['locale'];
  segs: string[];
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'details' });
  const siteSuffix = t('page_title');

  const sectionSlug = segs[0];
  const section = await findSectionBySlug(sectionSlug, locale);
  if (!section) return { title: siteSuffix };

  const sectionTitle = section.title?.trim() || sectionSlug;
  return { title: `${sectionTitle} — ${siteSuffix}` };
}

async function generateExplorePageMetadataBySegments({
  locale,
  segs,
}: {
  locale: Config['locale'];
  segs: string[];
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'details' });
  const siteSuffix = t('page_title');

  const sectionSlug = segs[0];
  const section = await findSectionBySlug(sectionSlug, locale);
  if (!section) return { title: siteSuffix };

  const docs = await fetchExplorePagesBySectionId(section.id, locale);
  const page = resolveExplorePageFromSegments(docs, segs);
  if (!page) return { title: siteSuffix };

  return generateExplorePageMetadata({ page, siteSuffix });
}

async function renderExploreRoot({
  locale,
}: {
  locale: Config['locale'];
}) {
  const href = await resolveExploreDefaultHref(locale);
  redirect(href ? `/${locale}${href}` : `/${locale}/explore`);
}

async function renderExploreSection({
  locale,
  segs,
}: {
  locale: Config['locale'];
  segs: string[];
}) {
  const sectionSlug = segs[0];
  const section = await findSectionBySlug(sectionSlug, locale);
  if (!section?.slug) notFound();

  const sectionsList = await fetchExploreSections(locale);
  const navTreesBySection = await fetchExploreNavTreesBySection(locale);
  const docs = await fetchExplorePagesBySectionId(section.id, locale);
  const landing = firstExplorePageHref(docs, section.slug);
  if (landing) redirect(`/${locale}${landing}`);

  return (
    <>
      <ExplorePageView
        activePage={null}
        activeSectionSlug={section.slug}
        navTreesBySection={navTreesBySection}
        sections={sectionsList}
      />
    </>
  );
}

async function renderExplorePage({
  locale,
  segs,
}: {
  locale: Config['locale'];
  segs: string[];
}) {
  const sectionSlug = segs[0];
  const section = await findSectionBySlug(sectionSlug, locale);
  if (!section?.slug) notFound();

  const sectionsList = await fetchExploreSections(locale);
  const navTreesBySection = await fetchExploreNavTreesBySection(locale);
  const docs = await fetchExplorePagesBySectionId(section.id, locale);
  const activePage = resolveExplorePageFromSegments(docs, segs);
  if (!activePage) notFound();

  return (
    <>
      <ExplorePageView
        activePage={activePage}
        activeSectionSlug={section.slug}
        navTreesBySection={navTreesBySection}
        sections={sectionsList}
      />
    </>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments } = await params;
  const segs = segments ?? [];

  switch (segs.length) {
    case ExploreSegmentsLength.Root:
      return generateExploreRootMetadata({ locale });
    case ExploreSegmentsLength.Section:
      return generateExploreSectionMetadata({ locale, segs });
    default:
      return generateExplorePageMetadataBySegments({ locale, segs });
  }
}

export default async function ExploreRoute({ params }: Props) {
  const { locale, segments } = await params;
  const segs = segments ?? [];

  switch (segs.length) {
    case ExploreSegmentsLength.Root:
      return renderExploreRoot({ locale });
    case ExploreSegmentsLength.Section:
      return renderExploreSection({ locale, segs });
    default:
      return renderExplorePage({ locale, segs });
  }
}

export const dynamic = 'force-dynamic';
