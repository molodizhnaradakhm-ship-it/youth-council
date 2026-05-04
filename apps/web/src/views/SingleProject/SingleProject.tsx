import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import {
  type EntityRelatedPostsProps,
  EntityRelatedPostsSection,
} from '@/components/EntityRelatedPostsSection';
import { InViewAnimation } from '@/components/InViewAnimation';
import RichText from '@/components/RichText';
import { Text } from '@/components/Text';
import type { Project } from '@monorepo/cms/src/payload-types';

import styles from './SingleProject.module.scss';

type Props = Project & {
  relatedPosts?: EntityRelatedPostsProps | null;
};

export function SingleProject({ about, cover, excerpt, relatedPosts, title }: Props) {
  const excerptStr = excerpt?.trim() ?? '';

  return (
    <main className={styles.wrapper}>
      <section className={styles.intro}>
        <Container className={styles.container}>
          <div className={styles.introRow}>
            <div className={styles.introLeft}>
              <InViewAnimation animateImage className={styles.coverWrap}>
                <CMSMedia className={styles.cover} resource={cover} />
              </InViewAnimation>
            </div>
            <div className={styles.introRight}>
              <InViewAnimation className={styles.nameBlock} effect='y'>
                {excerptStr ? (
                  <Text className={styles.excerptMuted} color='inherit' type='d2'>
                    {excerptStr}
                  </Text>
                ) : null}
                <Text className={styles.nameTitle} color='inherit' tag='h1' type='h1'>
                  {title}
                </Text>
              </InViewAnimation>
              <InViewAnimation delay={0.1} effect='y'>
                <RichText
                  className={styles.about}
                  content={about}
                  textColor='inherit'
                  textType='p2'
                />
              </InViewAnimation>
            </div>
          </div>
        </Container>
      </section>
      {relatedPosts ? (
        <EntityRelatedPostsSection
          categories={relatedPosts.categories}
          limit={relatedPosts.limit}
          posts={relatedPosts.posts}
          publicationYears={relatedPosts.publicationYears}
          total={relatedPosts.total}
        />
      ) : null}
    </main>
  );
}
