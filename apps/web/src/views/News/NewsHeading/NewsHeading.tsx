'use client';

import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { BreadCrumbs } from '@/components/BreadCrumbs';
import { CatFilter } from '@/components/CatFilter';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import type { BlogAuthor } from '@monorepo/cms/src/payload-types';

import styles from './NewsHeading.module.scss';

type Props = {
  title: string;
  /** Blog index: light hero + subtitle (GoGym-style) */
  blogLayout?: boolean;
  blogSubtitle?: string;
  breadcrumbsList?: {
    title: string;
    url?: string;
  }[];
  publishYears: number[];
  categories: {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
  }[];
  authors?: BlogAuthor[];
};

export const NewsHeading = ({
  blogLayout,
  blogSubtitle,
  breadcrumbsList,
  publishYears,
  authors,
  categories,
  title,
}: Props) => {
  const tone = blogLayout ? 'light' : 'dark';

  return (
    <section className={clsx(styles.wrapper, blogLayout && styles.blogWrapper)}>
      <InViewAnimation className={clsx(styles.mainRow, blogLayout && styles.blogMainRow)} effect='y'>
        <div className={clsx(styles.mainRowLeft, blogLayout && styles.blogMainRowLeft)}>
          {blogLayout ? (
            <div className={styles.blogHeroTop}>
              <div className={styles.blogHeroText}>
                {breadcrumbsList ? (
                  <BreadCrumbs list={breadcrumbsList} variant='onLight' />
                ) : null}
                <Text className={styles.blogTitle} color='inherit' tag='h1' type='h1'>
                  {title}
                </Text>
                {blogSubtitle ? (
                  <Text className={styles.blogSubtitle} color='inherit' tag='p' type='p2'>
                    {blogSubtitle}
                  </Text>
                ) : null}
              </div>
              <div className={styles.blogHeroFilters}>
                <CatFilter
                  tone={tone}
                  className={styles.filtersBar}
                  filterAlign='end'
                  years={publishYears}
                  authors={authors?.map((c) => ({ id: c.id, title: c.title }))}
                  categories={categories.map((c) => ({ id: c.id, title: c.title }))}
                />
              </div>
            </div>
          ) : (
            <>
              {breadcrumbsList ? (
                <BreadCrumbs list={breadcrumbsList} variant='default' />
              ) : null}
              <Text color='white' tag='h1' type='h1'>
                {title}
              </Text>
            </>
          )}
        </div>
        {!blogLayout ? (
          <div className={styles.mainRowRight}>
            <CatFilter
              tone={tone}
              className={styles.filtersBar}
              years={publishYears}
              authors={authors?.map((c) => ({ id: c.id, title: c.title }))}
              categories={categories.map((c) => ({ id: c.id, title: c.title }))}
            />
          </div>
        ) : null}
      </InViewAnimation>
    </section>
  );
};
