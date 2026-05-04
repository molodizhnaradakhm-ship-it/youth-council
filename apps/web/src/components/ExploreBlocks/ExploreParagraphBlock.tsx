import RichText from '@/components/RichText';
import type { ExploreParagraphBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ExploreBlocks.module.scss';

export const ExploreParagraphBlock = ({ content }: ExploreParagraphBlockFields) => {
  return (
    <RichText
      className={styles.paragraph}
      content={content as Record<string, unknown>}
      textColor='text'
      textType='p2'
    />
  );
};
