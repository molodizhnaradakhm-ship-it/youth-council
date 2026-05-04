import { getLocale, getTranslations } from 'next-intl/server';

import { payload } from '@/api';
import { Container } from '@/components/Container';
import { ParticipantCard } from '@/components/ParticipantCard';
import { Text } from '@/components/Text';
import type { Config, Participant } from '@monorepo/cms/src/payload-types';

import styles from './RandomParticipants.module.scss';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i];
    copy[i] = copy[j]!;
    copy[j] = t!;
  }
  return copy;
}

type Props = {
  className?: string;
  /** Max cards to show (default 6). */
  limit?: number;
  /** When false, omit the section heading. */
  showTitle?: boolean;
};

export async function RandomParticipants({ className, limit = 6, showTitle = true }: Props) {
  const locale = await getLocale();
  const t = await getTranslations('participants');

  const fetchLimit = Math.min(120, Math.max(40, limit * 10));

  const res = await payload.find({
    collection: 'participants',
    depth: 1,
    limit: fetchLimit,
    locale: locale as Config['locale'],
    sort: 'title',
  });

  const docs = (res.docs ?? []) as Participant[];
  const picked = shuffle(docs).slice(0, Math.min(limit, docs.length));

  if (!picked.length) {
    return null;
  }

  return (
    <section className={className}>
      <Container className={styles.inner}>
        {showTitle ? (
          <Text className={styles.heading} color='inherit' tag='h2' type='h2'>
            {t('random_heading')}
          </Text>
        ) : null}
        <ul className={styles.grid}>
          {picked.map((p) => (
            <li key={p.id} className={styles.gridItem}>
              <ParticipantCard participant={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
