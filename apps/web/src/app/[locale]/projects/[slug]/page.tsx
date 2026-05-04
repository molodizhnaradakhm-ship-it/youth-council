import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { payload } from '@/api';
import { fetchRelatedBlogPosts } from '@/lib/fetchRelatedBlogPosts';
import { generatePageMetadata } from '@/utils/seoUtils';
import { SingleProject } from '@/views/SingleProject';
import type { Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ locale: Config['locale']; slug?: string }>;
  searchParams?: Promise<{
    category?: string;
    loadMore?: string;
    year?: string;
  }>;
};

const getProjectBySlug = cache(async (slug: string, locale: Config['locale']) => {
  const res = await payload.find({
    collection: 'projects',
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
  const doc = await getProjectBySlug(slug as string, locale);
  if (!doc) {
    return { robots: 'noindex, nofollow', title: 'Not found' };
  }
  return generatePageMetadata({ basePath: '/projects', doc });
};

export default async function ProjectSinglePage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const page = await getProjectBySlug(slug as string, locale);
  if (!page) {
    notFound();
  }

  const query = (await searchParams) ?? {};
  const related = await fetchRelatedBlogPosts({
    entityId: page.id,
    locale,
    query,
    relationKey: 'relatedProject',
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

  return <SingleProject {...page} relatedPosts={relatedPosts} />;
}
