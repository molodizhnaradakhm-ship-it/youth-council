'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { Container } from '@/components/Container';
import { LocalizedLink } from '@/components/LocalizedLink';
import { Text } from '@/components/Text';

import styles from './NotFound.module.scss';

const HOME_HREF = '/' as const;

type Props = {
  className?: string;
};

export const NotFound = ({ className }: Props) => {
  const t = useTranslations('not_found');

  return (
    <main className={clsx(styles.wrapper, className)}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.card}>
            <Text className={styles.code} color='inherit' tag='p' type='h1'>
              404
            </Text>
            <Text color='inherit' tag='p' type='h2'>
              {t('description')}
            </Text>
          </div>
          <LocalizedLink className={styles.cta} href={HOME_HREF}>
            {t('cta')}
          </LocalizedLink>
        </div>
      </Container>
    </main>
  );
};
