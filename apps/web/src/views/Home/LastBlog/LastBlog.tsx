import clsx from 'clsx';

import { Button } from '@/components/Button';
import { CMSLink } from '@/components/CMSLink';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import { PostCard } from '@/views/News/PostCard';
import type { Blog, BlogBlockFields, BlogCategory } from '@monorepo/cms/src/payload-types';

import styles from './LastBlog.module.scss';

export const LastBlog = ({
  link,
  posts,
  title,
  readMoreLabel,
}: BlogBlockFields) => {
  const list = (posts as Blog[]) ?? [];

  return (
    <section className={styles.wrapper}>
      <Container>
        <InViewAnimation effect='y' translateAmount='medium' className={clsx('InViewAnimation_animate', styles.heading)}>
          <Text type='h2' tag='h2' className={styles.title}>
            {title}
          </Text>
        </InViewAnimation>
        <InViewAnimation
          tagType='ul'
          delay={0.12}
          effect='y'
          translateAmount='medium'
          className={clsx('InViewAnimation_animate', styles.list)}
        >
          {list.map((post) => (
            <li key={post.id} className={styles.cardCell}>
              <PostCard
                url='blog'
                variant='home'
                categoryTitle={(post.category as BlogCategory).title}
                readMoreLabel={readMoreLabel}
                {...post}
              />
            </li>
          ))}
        </InViewAnimation>
        <InViewAnimation
          effect='y'
          translateAmount='medium'
          delay={0.2}
          className={clsx('InViewAnimation_animate', styles.ctaWrap)}
        >
          <CMSLink {...link} className={styles.ctaLink}>
            <Button asDiv className={styles.sectionCta}>
              {link.label}
            </Button>
          </CMSLink>
        </InViewAnimation>
      </Container>
    </section>
  );
};
