'use client';

import { useTranslations } from 'next-intl';

import { Container } from '@/components/Container';
import { SpinningLoader } from '@/components/SpinningLoader';
import useLoadMore from '@/hooks/useLoadMore';
import { NewsHeading } from '@/views/News/NewsHeading';
import { NewsList } from '@/views/News/NewsList';
import type { Blog, BlogCategory } from '@monorepo/cms/src/payload-types';

import styles from './EntityRelatedPostsSection.module.scss';

export type EntityRelatedPostsProps = {
  categories: BlogCategory[];
  limit: number;
  posts: Blog[];
  publicationYears: number[];
  total: number;
};

export function EntityRelatedPostsSection({
  categories,
  limit,
  posts,
  publicationYears,
  total,
}: EntityRelatedPostsProps) {
  const t = useTranslations('common');
  const { hasMore } = useLoadMore({
    currentCount: posts.length,
    limit,
    totalLength: total,
  });

  if (total < 1) {
    return null;
  }

  return (
    <section className={styles.section}>
      <Container>
        <NewsHeading
          categories={categories}
          publishYears={publicationYears}
          title={t('latest_posts')}
        />
        <NewsList list={posts} url='blog' />
        {hasMore && total > posts.length && (
          <div className={styles.loaderContainer}>
            <SpinningLoader className={styles.loader} />
          </div>
        )}
      </Container>
    </section>
  );
}
