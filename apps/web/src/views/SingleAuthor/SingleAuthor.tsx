'use client';

import { useTranslations } from 'next-intl';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { EmailBlock } from '@/components/EmailBlock';
import { InViewAnimation } from '@/components/InViewAnimation';
import { PhoneBlock } from '@/components/PhoneBlock';
import RichText from '@/components/RichText';
import { SocialsBlock } from '@/components/SocialsBlock';
import { SpinningLoader } from '@/components/SpinningLoader';
import { Text } from '@/components/Text';
import useLoadMore from '@/hooks/useLoadMore';
import type { Blog, BlogAuthor, BlogCategory } from '@monorepo/cms/src/payload-types';

import { NewsHeading } from '../News/NewsHeading';
import { NewsList } from '../News/NewsList';

import styles from './SingleAuthor.module.scss';

export const SingleAuthor = ({
  photo,
  title,
  position,
  socList,
  email,
  phone,
  about,
  authorPosts,
  authorCategories,
  publicationYears,
  total,
  limit,
}: BlogAuthor & {
  authorPosts: Blog[];
  authorCategories: BlogCategory[];
  publicationYears: number[];
  total: number;
  limit: number;
}) => {
  const t = useTranslations('common');
  const { hasMore } = useLoadMore({ currentCount: authorPosts.length, limit, totalLength: total });
  const phoneStr = typeof phone === 'string' ? phone.trim() : '';

  return (
    <main className={styles.wrapper}>
      <section className={styles.intro}>
        <Container className={styles.container}>
          <div className={styles.introRow}>
            <div className={styles.introLeft}>
              <InViewAnimation animateImage className={styles.photoWrap}>
                <CMSMedia resource={photo} className={styles.photo} />
              </InViewAnimation>
              <InViewAnimation className={styles.contacts} effect='y' delay={0.4}>
                <SocialsBlock variant='onLight' socList={socList} />
                {phoneStr ? <PhoneBlock variant='onLight' phone={phoneStr} /> : null}
                <EmailBlock variant='onLight' email={email} />
              </InViewAnimation>
            </div>
            <div className={styles.introRight}>
              <InViewAnimation className={styles.namePosition} effect='y'>
                <Text className={styles.positionLabel} color='inherit' type='d2'>
                  {position}
                </Text>
                <Text className={styles.authorTitle} color='inherit' type='h1'>
                  {title}
                </Text>
              </InViewAnimation>
              <InViewAnimation effect='y' delay={0.2}>
                <RichText
                  content={about}
                  className={styles.aboutDescription}
                  textColor='inherit'
                  textType='p2'
                />
              </InViewAnimation>
            </div>
          </div>
        </Container>
      </section>
      <section className={styles.authorPosts}>
        <Container>
          <NewsHeading
            title={t('authors_publications')}
            categories={authorCategories}
            publishYears={publicationYears}
          />
          <NewsList list={authorPosts} url='blog' />
          {hasMore && total > authorPosts.length && (
            <div className={styles.loaderContainer}>
              <SpinningLoader className={styles.loader} />
            </div>
          )}
        </Container>
      </section>
    </main>
  );
};
