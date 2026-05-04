import { CMSMedia } from '@/components/CMSMedia';
import { Text } from '@/components/Text';
import type { BlogAuthor } from '@monorepo/cms/src/payload-types';

import styles from './Author.module.scss';

export const Author = ({ photo, position, title }: BlogAuthor) => {
  return (
    <div className={styles.wrapper}>
      <CMSMedia className={styles.blogAuthorPhoto} resource={photo} />
      <Text type='p2'>
        {title} - {position}
      </Text>
    </div>
  );
};
