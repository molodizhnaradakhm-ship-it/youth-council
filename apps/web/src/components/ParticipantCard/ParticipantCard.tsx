import clsx from 'clsx';
import Link from 'next/link';

import { CMSMedia } from '@/components/CMSMedia';
import { Text } from '@/components/Text';
import type { Config, Media, Participant } from '@monorepo/cms/src/payload-types';

import styles from './ParticipantCard.module.scss';

export type ParticipantCardModel = {
  contentPhoto?: Media | string;
  excerpt: string;
  shortName: string;
  slug: string;
  specialization?: string | null;
  thumbnail: Media | string;
};

type Props = {
  className?: string;
  locale: Config['locale'];
  openLabel: string;
  participant: Participant | ParticipantCardModel;
};

function resolveCardModel(p: Participant | ParticipantCardModel): ParticipantCardModel | null {
  const slug = typeof p.slug === 'string' && p.slug.trim() ? p.slug.trim() : '';
  if (!slug) {
    return null;
  }
  const thumbnail =
    'thumbnail' in p && p.thumbnail
      ? p.thumbnail
      : 'contentPhoto' in p && p.contentPhoto
        ? p.contentPhoto
        : 'photo' in p
          ? (p as { photo?: Media | string }).photo
          : undefined;

  return {
    contentPhoto: 'contentPhoto' in p ? p.contentPhoto : undefined,
    excerpt: p.excerpt,
    shortName:
      'shortName' in p && p.shortName
        ? p.shortName
        : 'title' in p
          ? String((p as { title?: string }).title ?? '')
          : '',
    slug,
    specialization: p.specialization,
    thumbnail: thumbnail ?? '',
  };
}

export function ParticipantCard({ className, locale, openLabel, participant }: Props) {
  const model = resolveCardModel(participant);
  if (!model) {
    return null;
  }

  const { excerpt, shortName, slug, specialization, thumbnail } = model;
  const excerptShort =
    excerpt.length > 160 ? `${excerpt.slice(0, 157).trim()}…` : excerpt;
  const specializationLabel = typeof specialization === 'string' ? specialization.trim() : '';

  return (
    <Link className={clsx(styles.card, className)} href={`/${locale}/participants/${slug}`}>
      <article className={styles.inner}>
        <div className={styles.imageWrap}>
          {thumbnail && typeof thumbnail === 'object' ? (
            <CMSMedia
              className={styles.image}
              fill
              quality={75}
              resource={thumbnail}
              size='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px'
              withBlur={false}
            />
          ) : null}
        </div>
        <div className={styles.body}>
          <Text className={styles.title} color='inherit' type='h4' tag='h2'>
            {shortName}
          </Text>
          {specializationLabel ? (
            <Text className={styles.specialization} color='inherit' type='d2'>
              {specializationLabel}
            </Text>
          ) : null}
          {excerptShort ? (
            <Text className={styles.excerpt} color='inherit' type='p2' tag='p'>
              {excerptShort}
            </Text>
          ) : null}
          <span className={styles.cta}>
            <Text color='main-violet' type='p2' tag='span'>
              {openLabel}
            </Text>
          </span>
        </div>
      </article>
    </Link>
  );
}
