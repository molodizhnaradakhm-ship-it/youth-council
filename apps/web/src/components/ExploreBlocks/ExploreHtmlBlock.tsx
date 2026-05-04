import type { ExploreHtmlBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ExploreBlocks.module.scss';

export const ExploreHtmlBlock = ({ html }: ExploreHtmlBlockFields) => {
  const safe = html?.trim() ?? '';
  if (!safe) return null;

  return <div className={styles.html} dangerouslySetInnerHTML={{ __html: safe }} />;
};
