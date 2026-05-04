import clsx from 'clsx';

import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import type { LaunchRegionsBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './LaunchRegions.module.scss';

export const LaunchRegions = ({
  title,
  featuredName,
  launchDate,
  regionsLine,
}: LaunchRegionsBlockFields) => {
  return (
    <section className={styles.wrapper}>
      <Container>
        <InViewAnimation effect='y' translateAmount='medium' className={clsx('InViewAnimation_animate', styles.heading)}>
          <Text type='h2' tag='h2' color='white' align='center'>
            {title}
          </Text>
        </InViewAnimation>
        <InViewAnimation delay={0.12} effect='y' translateAmount='medium' className={clsx('InViewAnimation_animate', styles.card)}>
          <div className={styles.featured}>
            <Text type='h3' tag='h3' color='light-violet' className={styles.featuredName}>
              {featuredName}
            </Text>
            <Text type='p2' color='text' className={styles.dateLabel}>
              {launchDate}
            </Text>
          </div>
        </InViewAnimation>
        <InViewAnimation delay={0.2} effect='y' translateAmount='medium' className={clsx('InViewAnimation_animate', styles.line)}>
          <Text type='p1' color='text' align='center'>
            {regionsLine}
          </Text>
        </InViewAnimation>
      </Container>
    </section>
  );
};
