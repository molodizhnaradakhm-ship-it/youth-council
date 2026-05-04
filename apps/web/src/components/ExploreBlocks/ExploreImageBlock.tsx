import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import type { ExploreImageBlockFields, Media } from '@monorepo/cms/src/payload-types';

import styles from './ExploreBlocks.module.scss';

const EXPLORE_IMAGE_ALIGN = {
  Left: 'left',
  Right: 'right',
  Center: 'center',
} as const;

export const ExploreImageBlock = ({
  image,
  caption,
  fullWidth,
  align,
}: ExploreImageBlockFields) => {
  if (!image || typeof image !== 'object') {
    return null;
  }

  let alignClass: string | undefined;
  if (!fullWidth) {
    if (align === EXPLORE_IMAGE_ALIGN.Left) {
      alignClass = styles.figureAlignLeft;
    } else if (align === EXPLORE_IMAGE_ALIGN.Right) {
      alignClass = styles.figureAlignRight;
    } else {
      alignClass = styles.figureAlignCenter;
    }
  }

  return (
    <figure className={clsx(styles.figure, fullWidth && styles.figureFull, alignClass)}>
      <CMSMedia className={styles.image} resource={image as Media} withBlur />
      {caption?.trim() ? <figcaption className={styles.caption}>{caption.trim()}</figcaption> : null}
    </figure>
  );
};
