import { getTranslations } from 'next-intl/server';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import {
  type EntityRelatedPostsProps,
  EntityRelatedPostsSection,
} from '@/components/EntityRelatedPostsSection';
import { InViewAnimation } from '@/components/InViewAnimation';
import { PhoneBlock } from '@/components/PhoneBlock';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import { SocialsBlock } from '@/components/SocialsBlock';
import { Text } from '@/components/Text';
import type { Participant } from '@monorepo/cms/src/payload-types';

import styles from './SingleParticipant.module.scss';
import { WorkplaceOrganization } from './WorkplaceOrganization';

type Props = Participant & {
  relatedPosts?: EntityRelatedPostsProps | null;
};

export async function SingleParticipant({
  contentBlocks,
  contentPhoto,
  fullName,
  receptionHours,
  relatedPosts,
  socList,
  specialization,
  workplaces,
  phone,
}: Props) {
  const t = await getTranslations('participants');
  const phoneStr = typeof phone === 'string' ? phone.trim() : '';
  const hoursStr = typeof receptionHours === 'string' ? receptionHours.trim() : '';
  const specializationLabel = typeof specialization === 'string' ? specialization.trim() : '';
  const blocks = contentBlocks ?? [];
  const hasBlocks = blocks.length > 0;
  const socials = (socList ?? []).filter(
    (item) => item?.icon && typeof item.link === 'string' && item.link.trim() !== '',
  );

  return (
    <main className={styles.wrapper}>
      <section className={styles.intro}>
        <Container className={styles.container}>
          <div className={styles.introRow}>
            <div className={styles.introLeft}>
              <div className={styles.photoWrap}>
                <CMSMedia resource={contentPhoto} className={styles.photo} />
              </div>
              <InViewAnimation className={styles.sideMeta} delay={0.4} effect='y'>
                {workplaces?.length ? (
                  <div className={styles.block}>
                    <Text className={styles.blockTitle} color='inherit' type='t1'>
                      {t('workplaces')}
                    </Text>
                    <ul className={styles.workplaceList}>
                      {workplaces.map((w) => (
                        <li key={w.id ?? `${w.organization}-${w.note ?? ''}`}>
                          <WorkplaceOrganization workplace={w} />
                          {w.note?.trim() ? (
                            <Text className={styles.note} color='inherit' type='p2' tag='p'>
                              {w.note.trim()}
                            </Text>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {hoursStr ? (
                  <div className={styles.block}>
                    <Text className={styles.blockTitle} color='inherit' type='t1'>
                      {t('reception_hours')}
                    </Text>
                    <Text className={styles.plainText} color='inherit' type='p2' tag='p'>
                      {hoursStr}
                    </Text>
                  </div>
                ) : null}
                {phoneStr ? <PhoneBlock phone={phoneStr} variant='onLight' /> : null}
                {socials.length ? <SocialsBlock socList={socials} variant='onLight' /> : null}
              </InViewAnimation>
            </div>
            <div className={styles.introRight}>
              <InViewAnimation className={styles.nameBlock} effect='y'>
                {specializationLabel ? (
                  <Text className={styles.specializationLabel} color='inherit' type='d2'>
                    {specializationLabel}
                  </Text>
                ) : null}
                <Text className={styles.nameTitle} color='inherit' tag='h1' type='h1'>
                  {fullName}
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
