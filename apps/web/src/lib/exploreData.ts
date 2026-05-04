import { cache } from 'react';

import { payload } from '@/api';
import type { Config, ExplorePage, ExploreSection, Page } from '@monorepo/cms/src/payload-types';

import { buildExploreNav, firstExplorePageHref, type ExploreNavItem } from './exploreTree';

/**
 * Stub entry in Pages (viewType: explore) — header style, manual copy. Explore content lives in Explore collections.
 */
export const fetchExploreSettingsFromPages = cache(async (locale: Config['locale']): Promise<Page | null> => {
  const common = {
    collection: 'pages' as const,
    depth: 0,
    limit: 1,
    locale,
  };

  const bySlug = await payload.find({
    ...common,
    where: {
      and: [{ viewType: { equals: 'explore' } }, { slug: { equals: 'explore' } }],
    },
  });
  const fromSlug = bySlug.docs?.[0];
  if (fromSlug) {
    return fromSlug as Page;
  }

  const byType = await payload.find({
    ...common,
    where: {
      viewType: { equals: 'explore' },
    },
  });

  return (byType.docs?.[0] as Page) ?? null;
});

export const fetchExploreSections = cache(async (locale: Config['locale']) => {
  const res = await payload.find({
    collection: 'explore-sections',
    depth: 1,
    limit: 200,
    locale,
    sort: 'navOrder',
  });

  return (res.docs ?? []) as ExploreSection[];
});

/** Nav trees for every Explore section (for sidebar accordion). Uses cached page fetches per section. */
export const fetchExploreNavTreesBySection = cache(async (locale: Config['locale']) => {
  const sections = await fetchExploreSections(locale);
  const navTreesBySection: Record<string, ExploreNavItem[]> = {};

  await Promise.all(
    sections.map(async (s) => {
      const slug = s.slug?.trim();
      if (!slug) {
        return;
      }
      const docs = await fetchExplorePagesBySectionId(s.id, locale);
      navTreesBySection[slug] = buildExploreNav(docs, slug);
    }),
  );

  return navTreesBySection;
});

export const fetchExplorePagesBySectionId = cache(async (sectionId: string, locale: Config['locale']) => {
  const res = await payload.find({
    collection: 'explore-pages',
    /** Nested tab blocks + uploads (e.g. explore-image) need depth > 1 */
    depth: 3,
    limit: 500,
    locale,
    sort: 'navOrder',
    where: {
      section: {
        equals: sectionId,
      },
    },
  });

  return (res.docs ?? []) as ExplorePage[];
});

/** First meaningful URL under /explore, or `null` if there are no sections. */
export async function resolveExploreDefaultHref(locale: Config['locale']): Promise<string | null> {
  const sections = await fetchExploreSections(locale);

  if (sections.length === 0) {
    return null;
  }

  const first = sections[0];
  const sectionSlug = first.slug?.trim();

  if (!sectionSlug) {
    return null;
  }

  const pages = await fetchExplorePagesBySectionId(first.id, locale);
  const leaf = firstExplorePageHref(pages, sectionSlug);

  if (leaf) {
    return leaf;
  }

  return `/explore/${sectionSlug}`;
}
