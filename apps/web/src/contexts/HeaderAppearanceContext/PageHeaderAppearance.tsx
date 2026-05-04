'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

import type { Page } from '@monorepo/cms/src/payload-types';

import { useHeaderAppearanceSetter } from './HeaderAppearanceContext';

const HEADER_APPEARANCE = {
  Light: 'light',
  Dark: 'dark',
} as const;

type Props = {
  value?: Page['headerAppearance'] | null;
};

/**
 * Sets per-page header appearance (from CMS) for the current route; resets on unmount.
 * useLayoutEffect so the Header updates before paint (useEffect ran too late — mode looked ignored).
 */
export function PageHeaderAppearance({ value }: Props) {
  const setOverride = useHeaderAppearanceSetter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (value === HEADER_APPEARANCE.Light || value === HEADER_APPEARANCE.Dark) {
      setOverride(value, pathname);
    } else {
      setOverride(null, pathname);
    }
    return () => setOverride(null, pathname);
  }, [pathname, setOverride, value]);

  return null;
}
