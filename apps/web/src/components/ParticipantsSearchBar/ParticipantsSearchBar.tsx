'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import styles from './ParticipantsSearchBar.module.scss';

type Props = {
  className?: string;
  defaultQuery: string;
};

export function ParticipantsSearchBar({ className, defaultQuery }: Props) {
  const pathname = usePathname();
  const t = useTranslations('participants');

  return (
    <form action={pathname} className={clsx(styles.form, className)} method='get' role='search'>
      <label className={styles.visuallyHidden} htmlFor='participants-search-q'>
        {t('search_aria')}
      </label>
      <input
        className={styles.input}
        defaultValue={defaultQuery}
        id='participants-search-q'
        name='q'
        placeholder={t('search_placeholder')}
        type='search'
      />
      <button className={styles.submit} type='submit'>
        {t('search_submit')}
      </button>
    </form>
  );
}
