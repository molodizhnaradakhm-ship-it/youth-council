import { useMemo } from 'react';
import { useLocale } from 'next-intl';

import { defaultLocale } from '@/utils/config';

/**
 * Returns homepage href for the current locale.
 * - default locale => "/"
 * - other locales  => "/{locale}"
 */
export function useHomeHref(): string {
  const locale = useLocale();

  return useMemo(() => {
    const l = String(locale || '').trim();
    if (!l || l === defaultLocale) return '/';
    return `/${l}`;
  }, [locale]);
}

