import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import {
  type EntityRelatedPostsProps,
  EntityRelatedPostsSection,
} from '@/components/EntityRelatedPostsSection';
import { InViewAnimation } from '@/components/InViewAnimation';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import { Text } from '@/components/Text';
import type { Project } from '@monorepo/cms/src/payload-types';

import styles from './SingleProject.module.scss';

type Props = Project & {
  relatedPosts?: EntityRelatedPostsProps | null;
};

export function SingleProject({ contentBlocks, cover, excerpt, relatedPosts, title }: Props) {
  const excerptStr = excerpt?.trim() ?? '';
  const blocks = contentBlocks ?? [];
  const hasBlocks = blocks.length > 0;

  return (
    <main className={styles.wrapper}>
      <section className={styles.intro}>
        <Container className={styles.container}>
          <div className={styles.introRow}>
            <div className={styles.introLeft}>
              <div className={styles.coverWrap}>
                <CMSMedia className={styles.cover} resource={cover} />
              </div>
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
            </div>
          </div>
        </Container>
      </section>
      {hasBlocks ? (
        <section className={styles.content}>
          <Container>
            <div className={styles.contentBlocks}>
              <RenderBlocks blocks={blocks as never} mapper={unifiedBlocksMapper} />
            </div>
          </Container>
        </section>
      ) : null}
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
