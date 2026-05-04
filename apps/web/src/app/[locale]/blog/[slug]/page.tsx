import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { payload } from '@/api';
import { generatePageMetadata } from '@/utils/seoUtils';
import { SinglePost } from '@/views/SinglePost';
import type { BlogCategory, Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ slug?: string; locale: Config['locale'] }>;
};

const getPageBySlug = cache(async (slug: string, locale: Config['locale']) => {
  const res = await payload.find({
    collection: 'blog',
    depth: 3,
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

  return generatePageMetadata({ doc, basePath: '/blog' });
};

export default async function BlogSingle({ params }: Props) {
  const { slug, locale } = await params;

  const page = await getPageBySlug(slug as string, locale);

  const currentCategory = page.category;

  const categoryId = typeof currentCategory === 'object' ? currentCategory.id : currentCategory;

  const relatedFind = await payload.find({
    collection: 'blog',
    limit: 2,
    locale,
    where: {
      category: {
        equals: categoryId,
      },
      id: {
        not_equals: page.id,
      },
    },
  });
  const otherPosts = relatedFind.docs ?? [];

  return <SinglePost {...page} otherPosts={otherPosts} category={page.category as BlogCategory} />;
}
