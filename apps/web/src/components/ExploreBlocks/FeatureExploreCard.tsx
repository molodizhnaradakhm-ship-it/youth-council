'use client';

import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import type { ExploreFeatureCardBlockFields, Media } from '@monorepo/cms/src/payload-types';

import styles from './FeatureExploreCard.module.scss';

export type FeatureExploreCardLink = NonNullable<ExploreFeatureCardBlockFields['link']>;

export type FeatureExploreCardProps = {
  image: Media | string;
  link: FeatureExploreCardLink;
  title: string | null | undefined;
};

export function FeatureExploreCard({ title, image, link }: FeatureExploreCardProps) {
  if (!image || typeof image !== 'object') {
    return null;
  }

  const titleFallback = title?.trim() ?? '';
  const l = link ?? {};

  return (
    <CMSLink
      aria-label={titleFallback}
      className={styles.card}
      form={l.form}
      newTab={l.newTab}
      reference={l.reference}
      type={l.type}
      url={l.url}
    >
      <div className={styles.media}>
        <CMSMedia
          className={styles.mediaImg}
          fill
          priority
          resource={image as Media}
          size='(max-width: 768px) 100vw, 400px'
          withBlur={false}
        />
      </div>
      <div className={styles.body}>
        {titleFallback ? <p className={styles.cardTitle}>{titleFallback}</p> : null}
      </div>
    </CMSLink>
  );
}
