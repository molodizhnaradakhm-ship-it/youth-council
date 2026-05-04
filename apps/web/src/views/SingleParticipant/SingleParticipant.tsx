import { getTranslations } from 'next-intl/server';

import {
  EntityRelatedPostsSection,
  type EntityRelatedPostsProps,
} from '@/components/EntityRelatedPostsSection';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { PhoneBlock } from '@/components/PhoneBlock';
import RichText from '@/components/RichText';
import { Text } from '@/components/Text';
import type { Participant } from '@monorepo/cms/src/payload-types';

import styles from './SingleParticipant.module.scss';

type Props = Participant & {
  relatedPosts?: EntityRelatedPostsProps | null;
};

export async function SingleParticipant({
  about,
  photo,
  receptionHours,
  relatedPosts,
  specialization,
  title,
  workplaces,
  phone,
}: Props) {
  const t = await getTranslations('participants');
  const phoneStr = typeof phone === 'string' ? phone.trim() : '';
  const hoursStr = typeof receptionHours === 'string' ? receptionHours.trim() : '';

  return (
    <main className={styles.wrapper}>
      <section className={styles.intro}>
        <Container className={styles.container}>
          <div className={styles.introRow}>
            <div className={styles.introLeft}>
              <InViewAnimation animateImage className={styles.photoWrap}>
                <CMSMedia resource={photo} className={styles.photo} />
              </InViewAnimation>
              <InViewAnimation className={styles.sideMeta} delay={0.4} effect='y'>
                {workplaces?.length ? (
                  <div className={styles.block}>
                    <Text className={styles.blockTitle} color='inherit' type='t1'>
                      {t('workplaces')}
                    </Text>
                    <ul className={styles.workplaceList}>
                      {workplaces.map((w) => (
                        <li key={w.id ?? `${w.organization}-${w.note ?? ''}`}>
                          <Text className={styles.org} color='inherit' type='p2'>
                            {w.organization}
                          </Text>
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
              </InViewAnimation>
            </div>
            <div className={styles.introRight}>
              <InViewAnimation className={styles.nameBlock} effect='y'>
                <Text className={styles.specializationLabel} color='inherit' type='d2'>
                  {specialization}
                </Text>
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
