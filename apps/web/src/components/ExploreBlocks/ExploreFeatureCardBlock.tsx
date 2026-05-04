'use client';

import type { ExploreFeatureCardBlockFields } from '@monorepo/cms/src/payload-types';

import { FeatureExploreCard } from './FeatureExploreCard';

import styles from './ExploreFeatureCardBlock.module.scss';

export const ExploreFeatureCardBlock = (props: ExploreFeatureCardBlockFields) => {
  const { title, image, link } = props;

  if (!image || typeof image !== 'object') {
    return null;
  }

  return (
    <div className={styles.standalone}>
      <FeatureExploreCard image={image} link={link ?? {}} title={title} />
    </div>
  );
};
