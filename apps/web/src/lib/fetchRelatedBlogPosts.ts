import { payload } from '@/api';
import { buildYearFilter } from '@/utils/buildYearFilter';
import type { Blog, BlogCategory, Config } from '@monorepo/cms/src/payload-types';

const POSTS_LIMIT = 6;

type RelationKey = 'relatedParticipant' | 'relatedProject';

export type RelatedPostsUrlQuery = {
  category?: string;
  loadMore?: string;
  year?: string;
};

export type RelatedBlogPostsResult = {
  entityCategories: BlogCategory[];
  limit: number;
  posts: Blog[];
  publicationYears: number[];
  total: number;
};

export async function fetchRelatedBlogPosts({
  entityId,
  locale,
  query,
  relationKey,
}: {
  entityId: string;
  locale: Config['locale'];
  query?: RelatedPostsUrlQuery;
  relationKey: RelationKey;
}): Promise<RelatedBlogPostsResult> {
  const currentCategory = typeof query?.category === 'string' ? query.category : '';
  const loadMoreRaw = query?.loadMore;
  const loadMoreQuery =
    loadMoreRaw !== undefined && loadMoreRaw !== null && String(loadMoreRaw).trim() !== ''
      ? Number(loadMoreRaw)
      : POSTS_LIMIT;
  const yearFilter = buildYearFilter(query?.year);

  const postsFind = await payload.find({
    collection: 'blog',
    depth: 2,
    limit: Number(loadMoreQuery),
    locale,
    sort: '-publishedOn',
    where: {
      _status: {
        equals: 'published',
      },
      [relationKey]: {
        equals: entityId,
      },
      ...(currentCategory ? { category: { equals: currentCategory } } : {}),
      ...yearFilter,
    },
  });

  const postsAllFind = await payload.find({
    collection: 'blog',
    depth: 1,
    limit: 100,
    locale,
    select: {
      category: true,
      publishedOn: true,
    } as any,
    where: {
      _status: {
        equals: 'published',
      },
      [relationKey]: {
        equals: entityId,
      },
    },
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
  const publicationYears = [...new Set(allDates.map((date) => new Date(date as string).getFullYear()))].sort(
    (a, b) => b - a,
  );

  return {
    entityCategories: uniqueCategories as BlogCategory[],
    limit: POSTS_LIMIT,
    posts: postsFind.docs ?? [],
    publicationYears,
    total: postsFind.totalDocs ?? 0,
  };
}
