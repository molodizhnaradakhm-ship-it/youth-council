'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/Button';
import { InViewAnimation } from '@/components/InViewAnimation';
import { locales } from '@/utils/config';

import { LocalizedLink } from '../LocalizedLink';

import styles from './Cookies.module.scss';

function isOpenAppGatePath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'go') return true;
  return (
    segments.length >= 2 &&
    (locales as readonly string[]).includes(segments[0]) &&
    segments[1] === 'go'
  );
}

type Props = {
  className?: string;
};

const CookiesContent = ({ className }: Props) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const t = useTranslations('cookies');

  const accept = () => {
    setIsAccepted(true);
    localStorage.setItem('accepted', 'true');
  };

  const reject = () => {
    setIsAccepted(true);
    // Persist rejection so banner does not reappear
    localStorage.setItem('accepted', 'false');
  };

  if (isAccepted) return null;

  return (
    <InViewAnimation className={clsx('InViewAnimation_animate', styles.wrapper, className)} delay={1} effect='y'>
      <p className={styles.description}>
        {t('description')} <LocalizedLink href={'/cookies'}>{t('link')}</LocalizedLink>
      </p>
      <div className={styles['btn-wrapper']}>
        <Button className={styles.btnAccept} isHeader onClick={accept}>
          {t('accept')}
        </Button>
        <Button className={styles.btnDecline} rounded isHeader onClick={reject}>
          {t('decline')}
        </Button>
      </div>
    </InViewAnimation>
  );
};

export const Cookies = () => {
  const pathname = usePathname();
  const [ssrLoad, setSsrLoad] = useState(false);

  useEffect(() => {
    setSsrLoad(true);
  }, []);

  if (!ssrLoad) return null;

  if (isOpenAppGatePath(pathname)) return null;

  return !localStorage.getItem('accepted') && <CookiesContent />;
};
