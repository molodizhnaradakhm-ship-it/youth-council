import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/Container';
import { ParticipantCard } from '@/components/ParticipantCard';
import { ParticipantsPagination } from '@/components/ParticipantsPagination';
import { ParticipantsSearchBar } from '@/components/ParticipantsSearchBar';
import { Text } from '@/components/Text';
import type { Participant } from '@monorepo/cms/src/payload-types';

import styles from './Participants.module.scss';

type Props = {
  currentPage: number;
  /** CMS page title overrides default translation for the listing heading. */
  headingTitle?: string | null;
  /** URL segment for pagination/search (no locale). Default `participants`. */
  listPath?: string;
  pageSize: number;
  participants: Participant[];
  query: string;
  totalDocs: number;
};

export async function ParticipantsView({
  currentPage,
  headingTitle,
  listPath = 'participants',
  pageSize,
  participants,
  query,
  totalDocs,
}: Props) {
  const t = await getTranslations('participants');
  const totalPages = Math.max(1, Math.ceil(totalDocs / pageSize));
  const titleText = headingTitle?.trim() || t('title');

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <Container>
          <Text className={styles.pageTitle} color='inherit' tag='h1' type='h1'>
            {titleText}
          </Text>
          <ParticipantsSearchBar className={styles.search} defaultQuery={query} />
        </Container>
      </section>
      <section className={styles.list}>
        <Container>
          {participants.length === 0 ? (
            <Text className={styles.empty} color='inherit' type='p2'>
              {t('empty')}
            </Text>
          ) : (
            <ul className={styles.grid}>
              {participants.map((p) => (
                <li key={p.id} className={styles.gridItem}>
                  <ParticipantCard participant={p} />
                </li>
              ))}
            </ul>
          )}
          <ParticipantsPagination
            currentPage={currentPage}
            listPath={listPath}
            query={query}
            totalPages={totalPages}
          />
        </Container>
      </section>
    </main>
  );
}
