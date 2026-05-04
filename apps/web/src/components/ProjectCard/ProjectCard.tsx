'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { CMSMedia } from '@/components/CMSMedia';
import { LocalizedLink } from '@/components/LocalizedLink';
import { Text } from '@/components/Text';
import type { Media, Project } from '@monorepo/cms/src/payload-types';

import styles from './ProjectCard.module.scss';

export type ProjectCardModel = {
  cover: Media | string;
  excerpt: string;
  slug: string;
  title: string;
};

type Props = {
  className?: string;
  project: Project | ProjectCardModel;
};

function resolveCardModel(p: Project | ProjectCardModel): ProjectCardModel | null {
  const slug = typeof p.slug === 'string' && p.slug.trim() ? p.slug.trim() : '';
  if (!slug) {
    return null;
  }
  return {
    cover: p.cover,
    excerpt: p.excerpt,
    slug,
    title: p.title,
  };
}

export function ProjectCard({ className, project }: Props) {
  const t = useTranslations('projects');
  const model = resolveCardModel(project);
  if (!model) {
    return null;
  }

  const { cover, excerpt, slug, title } = model;
  const excerptShort =
    excerpt.length > 160 ? `${excerpt.slice(0, 157).trim()}…` : excerpt;

  return (
    <LocalizedLink className={clsx(styles.card, className)} href={`/projects/${slug}`}>
      <article className={styles.inner}>
        <div className={styles.imageWrap}>
          {cover && typeof cover === 'object' ? (
            <CMSMedia
              className={styles.image}
              fill
              resource={cover}
              size='(max-width: 768px) 100vw, 320px'
              withBlur={false}
            />
          ) : null}
        </div>
        <div className={styles.body}>
          <Text className={styles.title} color='inherit' type='h4' tag='h2'>
            {title}
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
