import type { ExploreSubtitleBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ExploreBlocks.module.scss';

export const ExploreSubtitleBlock = ({ text }: ExploreSubtitleBlockFields) => {
  const base = text?.trim() ?? '';
  if (!base) {
    return null;
  }

  return (
    <p className={styles.subtitle}>{base}</p>
  );
};
