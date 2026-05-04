import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { payload } from '@/api';
import { fetchRelatedBlogPosts } from '@/lib/fetchRelatedBlogPosts';
import { generatePageMetadata } from '@/utils/seoUtils';
import { SingleParticipant } from '@/views/SingleParticipant';
import type { Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ locale: Config['locale']; slug?: string }>;
  searchParams?: Promise<{
    category?: string;
    loadMore?: string;
    year?: string;
  }>;
};

const getParticipantBySlug = cache(async (slug: string, locale: Config['locale']) => {
  const res = await payload.find({
    collection: 'participants',
    depth: 2,
    limit: 1,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  const doc = res.docs?.[0];
  if (!doc) {
    return null;
  }
  return doc;
});

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params;
  const doc = await getParticipantBySlug(slug as string, locale);
  if (!doc) {
    return { robots: 'noindex, nofollow', title: 'Not found' };
  }
  return generatePageMetadata({ basePath: '/participants', doc });
};

export default async function ParticipantSinglePage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const page = await getParticipantBySlug(slug as string, locale);
  if (!page) {
    notFound();
  }

  const query = (await searchParams) ?? {};
  const related = await fetchRelatedBlogPosts({
    entityId: page.id,
    locale,
    query,
    relationKey: 'relatedParticipant',
  });

  const relatedPosts =
    related.total > 0
      ? {
          categories: related.entityCategories,
          limit: related.limit,
          posts: related.posts,
          publicationYears: related.publicationYears,
          total: related.total,
        }
      : null;

  return <SingleParticipant {...page} relatedPosts={relatedPosts} />;
}
