import clsx from 'clsx';
import { getTranslations } from 'next-intl/server';

import { LocalizedLink } from '@/components/LocalizedLink';

import styles from './ParticipantsPagination.module.scss';

type Props = {
  /** Path segment for this listing (no locale); default `participants`. */
  listPath?: string;
  className?: string;
  currentPage: number;
  query: string;
  totalPages: number;
  /** next-intl namespace for pagination strings (`page_status`, `prev`, …). */
  translationsNamespace?: string;
};

export async function ParticipantsPagination({
  className,
  currentPage,
  listPath = 'participants',
  query,
  totalPages,
  translationsNamespace = 'participants',
}: Props) {
  const t = await getTranslations(translationsNamespace);

  if (totalPages <= 1) {
    return null;
  }

  const base = `/${listPath.replace(/^\/+/, '')}`;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    if (page > 1) {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav aria-label={t('pagination_aria')} className={clsx(styles.nav, className)}>
      <div className={styles.controls}>
        {prev !== null ? (
          <LocalizedLink className={styles.pageLink} href={buildHref(prev)}>
            {t('prev')}
          </LocalizedLink>
        ) : (
          <span className={styles.pageLinkDisabled}>{t('prev')}</span>
        )}
        <span className={styles.status}>
          {t('page_status', { current: currentPage, total: totalPages })}
        </span>
        {next !== null ? (
          <LocalizedLink className={styles.pageLink} href={buildHref(next)}>
            {t('next')}
          </LocalizedLink>
        ) : (
          <span className={styles.pageLinkDisabled}>{t('next')}</span>
        )}
      </div>
    </nav>
  );
}
