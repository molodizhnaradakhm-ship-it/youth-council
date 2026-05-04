import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { payload } from '@/api';
import { buildYearFilter } from '@/utils/buildYearFilter';
import { generatePageMetadata } from '@/utils/seoUtils';
import { SingleAuthor } from '@/views/SingleAuthor';
import type { BlogCategory, Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ slug?: string; locale: Config['locale'] }>;
  searchParams?: Promise<{
    category?: string;
    loadMore?: string;
    year?: string;
  }>;
};

const getPageBySlug = cache(async (slug: string, locale: Config['locale']) => {
  const res = await payload.find({
    collection: 'blog-authors',
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  const docs = res.docs ?? [];
  const pageData = docs[0];
  if (!pageData) return notFound();

  return pageData;
});

// Metadata generation
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params;

  const doc = await getPageBySlug(slug as string, locale);

  return generatePageMetadata({ doc, basePath: '/author' });
};

export default async function AuthorSingle({ params, searchParams }: Props) {
  const { slug, locale } = await params;

  const page = await getPageBySlug(slug as string, locale);
  const query = await searchParams;
  const currentCategory = query?.category ?? '';
  const limit = 6;
  const loadMoreQuery = query?.loadMore || limit;
  const yearFilter = buildYearFilter(query?.year);

  const currentId = page.id;

  const postsFind = await payload.find({
    collection: 'blog',
    limit: Number(loadMoreQuery),
    locale,
    where: {
      author: {
        equals: currentId,
      },
      _status: {
        equals: 'published',
      },
      ...(currentCategory ? { category: { equals: currentCategory } } : {}),
      ...yearFilter,
    },
  });
  const authorPosts = postsFind.docs ?? [];
  const totalDocs = postsFind.totalDocs ?? 0;

  const postsAllFind = await payload.find({
    collection: 'blog',
    locale,
    select: {
      category: true,
      publishedOn: true,
    } as any,
    where: {
      author: { equals: currentId },
    },
    depth: 1,
    limit: 100,
  });
  const authorPostsAll = postsAllFind.docs ?? [];

  const uniqueCategories = [
    ...new Map(
      authorPostsAll
        .filter((p) => p.category)
        .map((p) => [typeof p.category === 'object' ? p.category.id : p.category, p.category]),
    ).values(),
  ];

  const allDates = authorPostsAll.map((doc) => doc.publishedOn);
  const uniqueYears = [
    ...new Set(allDates.map((date) => new Date(date as string).getFullYear())),
  ].sort((a, b) => b - a);

  return (
    <SingleAuthor
      {...page}
      authorPosts={authorPosts}
      authorCategories={uniqueCategories as BlogCategory[]}
      publicationYears={uniqueYears}
      total={totalDocs}
      limit={limit}
    />
  );
}
