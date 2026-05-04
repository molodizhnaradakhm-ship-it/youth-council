import { useTranslations } from 'next-intl';

import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import type { Blog, BlogCategory } from '@monorepo/cms/src/payload-types';

import { PostCard } from '../PostCard';

import styles from './NewsList.module.scss';

export const NewsList = ({
  list,
  url,
  readMoreLabel,
}: {
  list: Blog[];
  url: string;
  readMoreLabel?: string | null;
}) => {
  const t = useTranslations('common');
  // Blog index should use the same card styling as the homepage grid
  const cardVariant = url === 'blog' ? 'blogHome' : 'default';

  if (!list || list.length === 0) {
    const notFoundKey = url === 'blog' ? 'blog_not_found' : 'news_not_found';
    return <Text type='h4'>{t(notFoundKey)}</Text>;
  }

  return (
    <ul className={styles.list}>
      {list.map((post) => (
        <InViewAnimation key={post.id}>
          <PostCard
            {...post}
            categoryTitle={(post.category as BlogCategory)?.title ?? ''}
            url={url}
            variant={cardVariant}
            readMoreLabel={readMoreLabel}
          />
        </InViewAnimation>
      ))}
    </ul>
  );
};
