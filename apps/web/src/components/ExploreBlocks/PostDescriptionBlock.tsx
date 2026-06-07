import RichText from '@/components/RichText';
import type { PostDescriptionBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './PostDescriptionBlock.module.scss';

export function PostDescriptionBlock({ content }: PostDescriptionBlockFields) {
  return (
    <RichText
      className={styles.body}
      content={content as Record<string, unknown>}
      textColor='inherit'
      textType='p2'
    />
  );
}
