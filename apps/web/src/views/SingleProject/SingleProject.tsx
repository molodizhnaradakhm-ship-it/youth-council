import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/Button';
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
import { buildMailtoUrl } from '@/utils/buildMailtoUrl';
import type { Project } from '@monorepo/cms/src/payload-types';

import styles from './SingleProject.module.scss';

type Props = Project & {
  joinEmail?: string | null;
  relatedPosts?: EntityRelatedPostsProps | null;
};

export async function SingleProject({
  contentBlocks,
  cover,
  excerpt,
  joinEmail,
  relatedPosts,
  showJoinButton,
  title,
}: Props) {
  const t = await getTranslations('projects');
  const excerptStr = excerpt?.trim() ?? '';
  const blocks = contentBlocks ?? [];
  const hasBlocks = blocks.length > 0;
  const email = typeof joinEmail === 'string' ? joinEmail.trim() : '';
  const shouldShowJoin = showJoinButton !== false && Boolean(email);
  const mailtoHref = shouldShowJoin
    ? buildMailtoUrl({
        email,
        subject: t('join_email_subject', { title }),
      })
    : '';

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
              {shouldShowJoin && mailtoHref ? (
                <InViewAnimation delay={0.12} effect='y'>
                  <a className={styles.joinLink} href={mailtoHref}>
                    <Button asDiv className={styles.joinButton} violet>
                      {t('join_button')}
                    </Button>
                  </a>
                </InViewAnimation>
              ) : null}
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
