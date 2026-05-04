import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/Container';
import { ParticipantsPagination } from '@/components/ParticipantsPagination';
import { ProjectCard } from '@/components/ProjectCard';
import { Text } from '@/components/Text';
import type { Project } from '@monorepo/cms/src/payload-types';

import styles from './Projects.module.scss';

type Props = {
  currentPage: number;
  headingTitle?: string | null;
  listPath?: string;
  pageSize: number;
  projects: Project[];
  totalDocs: number;
};

export async function ProjectsView({
  currentPage,
  headingTitle,
  listPath = 'projects',
  pageSize,
  projects,
  totalDocs,
}: Props) {
  const t = await getTranslations('projects');
  const totalPages = Math.max(1, Math.ceil(totalDocs / pageSize));
  const titleText = headingTitle?.trim() || t('title');

  return (
    <main className={styles.wrapper}>
      <section className={styles.hero}>
        <Container>
          <Text className={styles.pageTitle} color='inherit' tag='h1' type='h1'>
            {titleText}
          </Text>
        </Container>
      </section>
      <section className={styles.list}>
        <Container>
          {projects.length === 0 ? (
            <Text className={styles.empty} color='inherit' type='p2'>
              {t('empty')}
            </Text>
          ) : (
            <ul className={styles.grid}>
              {projects.map((p) => (
                <li key={p.id} className={styles.gridItem}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          )}
          <ParticipantsPagination
            currentPage={currentPage}
            listPath={listPath}
            query=''
            totalPages={totalPages}
            translationsNamespace='projects'
          />
        </Container>
      </section>
    </main>
  );
}
