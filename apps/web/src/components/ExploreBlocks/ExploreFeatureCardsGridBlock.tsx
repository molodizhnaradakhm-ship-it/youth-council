'use client';

import clsx from 'clsx';

import type { ExploreFeatureCardsGridBlockFields } from '@monorepo/cms/src/payload-types';

import { FeatureExploreCard } from './FeatureExploreCard';

import styles from './ExploreFeatureCardsGridBlock.module.scss';

export const ExploreFeatureCardsGridBlock = ({
  cards,
  gridColumns,
}: ExploreFeatureCardsGridBlockFields) => {
  const list = cards?.length ? cards : [];
  if (!list.length) {
    return null;
  }

  const cols = gridColumns === '3' ? 3 : 2;

  return (
    <div className={clsx(styles.grid, cols === 2 ? styles.gridCols2 : styles.gridCols3)}>
      {list.map((item) => {
        const key = item.id ?? `${item.title}-${item.link?.url ?? ''}`;
        if (!item.image || typeof item.image !== 'object') {
          return null;
        }

        return (
          <FeatureExploreCard
            key={key}
            image={item.image}
            link={item.link ?? {}}
            title={item.title}
          />
        );
      })}
    </div>
  );
};
