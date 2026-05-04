'use client';

import { useTranslations } from 'next-intl';

import { Container } from '@/components/Container';
import { SpinningLoader } from '@/components/SpinningLoader';
import useLoadMore from '@/hooks/useLoadMore';
import type { Blog, BlogAuthor, BlogCategory, Page } from '@monorepo/cms/src/payload-types';

import { NewsHeading } from '../News/NewsHeading';
import { NewsList } from '../News/NewsList';

import blogStyles from './Blog.module.scss';

type Props = {
  list: Blog[];
  limit: number;
  pageTitle: string;
  total: number;
  publishYears: number[];
  newsCategories: BlogCategory[];
  blogAuthors: BlogAuthor[];
  blogReadMoreLabel?: string | null;
} & Page;

export const BlogView = ({
  title,
  newsCategories,
  blogAuthors,
  publishYears,
  limit,
  total,
  list,
  blogReadMoreLabel,
}: Props) => {
  const t = useTranslations('blog');
  const { hasMore } = useLoadMore({ currentCount: list.length, limit, totalLength: total });

  return (
    <main className={blogStyles.blogRoot}>
      <section className={blogStyles.posts}>
        <Container>
          <NewsHeading
            authors={blogAuthors}
            blogLayout
            blogSubtitle={t('subtitle')}
            breadcrumbsList={[
              {
                title: title,
              },
            ]}
            categories={newsCategories}
            publishYears={publishYears}
            title={title}
          />
          <NewsList list={list} url='blog' readMoreLabel={blogReadMoreLabel} />
          {hasMore && total > list.length && (
            <div className={blogStyles.loaderContainer}>
              <SpinningLoader />
            </div>
          )}
        </Container>
      </section>
    </main>
  );
};
