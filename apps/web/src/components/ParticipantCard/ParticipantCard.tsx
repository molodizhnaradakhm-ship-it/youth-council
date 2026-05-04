'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { CMSMedia } from '@/components/CMSMedia';
import { LocalizedLink } from '@/components/LocalizedLink';
import { Text } from '@/components/Text';
import type { Media, Participant } from '@monorepo/cms/src/payload-types';

import styles from './ParticipantCard.module.scss';

export type ParticipantCardModel = {
  excerpt: string;
  photo: Media | string;
  slug: string;
  specialization: string;
  title: string;
};

type Props = {
  className?: string;
  participant: Participant | ParticipantCardModel;
};

function resolveCardModel(p: Participant | ParticipantCardModel): ParticipantCardModel | null {
  const slug = typeof p.slug === 'string' && p.slug.trim() ? p.slug.trim() : '';
  if (!slug) {
    return null;
  }
  return {
    excerpt: p.excerpt,
    photo: p.photo,
    slug,
    specialization: p.specialization,
    title: p.title,
  };
}

export function ParticipantCard({ className, participant }: Props) {
  const t = useTranslations('participants');
  const model = resolveCardModel(participant);
  if (!model) {
    return null;
  }

  const { excerpt, photo, slug, specialization, title } = model;
  const excerptShort =
    excerpt.length > 160 ? `${excerpt.slice(0, 157).trim()}…` : excerpt;

  return (
    <LocalizedLink className={clsx(styles.card, className)} href={`/participants/${slug}`}>
      <article className={styles.inner}>
        <div className={styles.imageWrap}>
          {photo && typeof photo === 'object' ? (
            <CMSMedia
              className={styles.image}
              fill
              resource={photo}
              size='(max-width: 768px) 100vw, 320px'
              withBlur={false}
            />
          ) : null}
        </div>
        <div className={styles.body}>
          <Text className={styles.title} color='inherit' type='h4' tag='h2'>
            {title}
          </Text>
          <Text className={styles.specialization} color='inherit' type='d2'>
            {specialization}
          </Text>
          {excerptShort ? (
            <Text className={styles.excerpt} color='inherit' type='p2' tag='p'>
              {excerptShort}
            </Text>
          ) : null}
          <span className={styles.cta}>
            <Text color='main-violet' type='p2' tag='span'>
              {t('open')}
            </Text>
          </span>
        </div>
      </article>
    </LocalizedLink>
  );
}
