import clsx from 'clsx';

import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import type { HeadingBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './WithBackgroundHeading.module.scss';

export const WithBackgroundHeading = ({ titleLine1, titleLine2 }: HeadingBlockFields) => {
  const line1 = titleLine1?.trim() ?? '';
  const line2 = titleLine2?.trim() ?? '';

  if (!line1 && !line2) return null;

  return (
    <div className={styles.wrap}>
      <Container>
        <InViewAnimation className={clsx('InViewAnimation_animate', styles.inner)} effect='y'>
          <h2 className={styles.title}>
            {line1 ? <span className={styles.line}>{line1}</span> : null}
            {line2 ? <span className={styles.line}>{line2}</span> : null}
          </h2>
        </InViewAnimation>
      </Container>
    </div>
  );
};
