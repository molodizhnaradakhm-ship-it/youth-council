'use client';

import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/Button';
import { CMSMedia } from '@/components/CMSMedia';
import { LocalizedLink } from '@/components/LocalizedLink';
import { Tag } from '@/components/Tag';
import { Text } from '@/components/Text';
import { formatDateString } from '@/utils/common';
import type { Media } from '@monorepo/cms/src/payload-types';

import styles from './PostCard.module.scss';

type Props = {
  slug?: string | null;
  title: string;
  shortDescription: string;
  location?: string;
  readTime?: number;
  categoryTitle: string;
  thumbnail: string | Media;
  publishedOn?: string | null;
  url: string;
  /** Optional per-page/per-block override (CMS). */
  readMoreLabel?: string | null;
  /** Light card grid (blog index) */
  /** Compact light cards (home landing grid) */
  variant?: 'blog' | 'default' | 'home' | 'blogHome';
  rest?: unknown;
};

export const PostCard = ({
  slug,
  title,
  shortDescription,
  location,
  categoryTitle,
  thumbnail,
  publishedOn,
  url,
  readTime,
  readMoreLabel,
  variant = 'default',
  ...rest
}: Props) => {
  const locale = useLocale();
  const t = useTranslations('common');
  const categoryId = (rest as { category: { id: string } }).category.id;
  const LocationReadTime = location ?? `${readTime}  ${t('min_read')}`;

  const isHomeLike = variant === 'home' || variant === 'blogHome';
  const isLightCard = variant === 'blog' || isHomeLike;
  const bodyColor = isLightCard ? 'blue-23' : 'text';
  const useVioletCta = variant === 'blog';
  const readMoreText = readMoreLabel || t('read_more');

  return (
    <div
      className={clsx(
        styles.wrapper,
        variant === 'blog' && styles.blogCard,
        isHomeLike && styles.homeCard,
        variant === 'blogHome' && styles.blogHomeCard,
      )}
    >
      <LocalizedLink className={styles.thumbnailContainer} href={`/${url}/${slug}`}>
        <CMSMedia className={styles.thumbnail} resource={thumbnail} />
      </LocalizedLink>
      <div className={clsx(styles.wrapperInfo, isHomeLike && styles.wrapperInfoHome)}>
        <LocalizedLink href={`/${url}?category=${categoryId}`}>
          <Tag className={isHomeLike ? styles.homeTag : undefined} title={categoryTitle} />
        </LocalizedLink>
        <Text
          className={clsx(
            styles.wrapperInfoBottom,
            variant === 'blog' && styles.blogMeta,
            isHomeLike && styles.homeMeta,
          )}
          color={bodyColor}
          tag='div'
          type='p2'
        >
          <span>{formatDateString(publishedOn as string, locale)}</span>
          <span>{LocationReadTime && LocationReadTime}</span>
        </Text>
      </div>
      <LocalizedLink className={styles.descriptionBlock} href={`/${url}/${slug}`}>
        <Text
          className={clsx(
            variant === 'blog' && styles.blogTitle,
            isHomeLike && styles.homeTitle,
          )}
          color={bodyColor}
          tag='h3'
          type='h4'
        >
          {title}
        </Text>
        <Text
          className={clsx(
            styles.shortDescription,
            variant === 'blog' && styles.blogExcerpt,
            isHomeLike && styles.homeExcerpt,
          )}
          color={bodyColor}
          tag='p'
          type='p2'
        >
          {shortDescription}
        </Text>
        {isHomeLike ? (
          <span className={styles.homeReadMore}>{readMoreText}</span>
        ) : (
          <Button
            className={styles.btn}
            dark={!useVioletCta}
            isHeader
            violet={useVioletCta}
          >
            {readMoreText}
          </Button>
        )}
      </LocalizedLink>
    </div>
  );
};
