'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import { BackButton } from '@/components/BackButton';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { LocalizedLink } from '@/components/LocalizedLink';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Text';
import { formatDateLong } from '@/utils/common';
import type { Blog, BlogAuthor, BlogCategory } from '@monorepo/cms/src/payload-types';

import { PostCard } from '../News/PostCard';

import styles from './SinglePost.module.scss';

type Props = {
  title: string;
  shortDescription: string;
  readTime?: number;
  contentBlocks?: Blog['contentBlocks'] | null;
  category: BlogCategory;
  slug?: string | null;
  author?: string | BlogAuthor;
  publishedOn?: string | null;
  otherPosts: Blog[];
};

export const SinglePost = ({
  title,
  shortDescription,
  publishedOn,
  category,
  contentBlocks,
  author,
  otherPosts,
  readTime,
}: Props) => {
  const locale = useLocale();
  const t = useTranslations('common');
  const tBlog = useTranslations('blog');

  const postAuthor = author as BlogAuthor;

  return (
    <main className={clsx(styles.wrapper, styles.blogSingle)}>
      <section className={styles.post}>
        <div className={clsx(styles.postIntro, styles.postIntroBlog)}>
          <Container>
            <>
              <div className={clsx(styles.postHeading, styles.postHeadingBlog)}>
                <InViewAnimation className={styles.postTopBlog}>
                  <BackButton />
                </InViewAnimation>
                <div className={styles.postHeadingLayout}>
                  <div className={styles.postHeadingMain}>
                    <InViewAnimation effect='y'>
                      <Text className={styles.title} type='h1'>
                        {title}
                      </Text>
                    </InViewAnimation>
                    <InViewAnimation delay={0.12} effect='y'>
                      <Text className={styles.shortDescription} type='p1'>
                        {shortDescription}
                      </Text>
                    </InViewAnimation>
                  </div>
                  <aside className={styles.postHeadingAside}>
                    <InViewAnimation className={styles.blogMeta} delay={0.2} effect='y'>
                      <div className={styles.blogMetaPrimary}>
                        <Text className={styles.blogDate} type='p2'>
                          {formatDateLong(publishedOn as string, locale)}
                        </Text>
                        <div className={styles.blogMetaTags}>
                          <Tag className={styles.blogTag} title={category.title} />
                          <Text color='inherit' type='p2'>
                            {`${readTime}  ${t('min_read')}`}
                          </Text>
                        </div>
                      </div>
                      {postAuthor ? (
                        <div className={styles.author}>
                          <Text color='inherit' type='p2'>
                            {t('author')}
                          </Text>
                          <LocalizedLink href={`/author/${postAuthor.slug}`}>
                            <Text className={styles.authorLink} type='p2'>
                              {postAuthor.title}
                            </Text>
                          </LocalizedLink>
                        </div>
                      ) : null}
                    </InViewAnimation>
                  </aside>
                </div>
              </div>
            </>
          </Container>
        </div>
        <div className={clsx(styles.postArticle, styles.postArticleBlog)}>
          <Container className={styles.container}>
            {contentBlocks && contentBlocks.length > 0 ? (
              <InViewAnimation threshold={0}>
                <div className={styles.contentBlocks}>
                  <RenderBlocks blocks={contentBlocks as never} mapper={unifiedBlocksMapper} />
                </div>
              </InViewAnimation>
            ) : null}

            <InViewAnimation className={styles.postArticleBottom}>
              <BackButton />
            </InViewAnimation>
          </Container>
        </div>
      </section>
      {otherPosts.length > 0 && (
        <section className={clsx(styles.otherPosts, styles.otherPostsBlog)}>
          <Container>
            <InViewAnimation effect='y'>
              <Text className={styles.otherPostsTitle} tag='h2' type='h2'>
                {tBlog('latest_stories')}
              </Text>
            </InViewAnimation>

            <InViewAnimation className={styles.otherPostsList} delay={0.2} tagType='ul'>
              {otherPosts.map((post) => (
                <li key={post.id}>
                  <PostCard
                    {...post}
                    categoryTitle={(post.category as BlogCategory).title}
                    url='blog'
                    variant='grid'
                  />
                </li>
              ))}
            </InViewAnimation>
          </Container>
        </section>
      )}
    </main>
  );
};
