import RichText from '@/components/RichText';
import { hasLexicalContent } from '@/utils/hasLexicalContent';
import type { ExploreTitleBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ExploreBlocks.module.scss';

/** Старі записи мали `text` + `level` замість Lexical `content`. */
type LegacyTitle = {
  text?: string | null;
  level?: 'h2' | 'h3' | null;
};

export const ExploreTitleBlock = (props: ExploreTitleBlockFields) => {
  const { content } = props;
  const legacy = props as LegacyTitle;

  if (hasLexicalContent(content)) {
    return (
      <div className={styles.titleRich}>
        <RichText content={content as Record<string, unknown>} textColor='text' textType='p2' />
      </div>
    );
  }

  const plain = legacy.text?.trim();
  if (plain) {
    const Tag = legacy.level === 'h3' ? 'h3' : 'h2';
    return <Tag className={styles.title}>{plain}</Tag>;
  }

  return null;
};
