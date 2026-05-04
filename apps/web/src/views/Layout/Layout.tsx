'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';

import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import { locales } from '@/utils/config';

// import { RouteChangeProgress } from '@/components/RouteChangeProgress';
import { Footer } from '../Footer';
import { Header } from '../Header';

import styles from './Layout.module.scss';

function isOpenAppGatePath(pathname: string): boolean {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  const second = segments[1];
  if (first === 'go') return true;
  if (!first || !second) return false;
  return (locales as readonly string[]).includes(first) && second === 'go';
}

export const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const hideChrome = isOpenAppGatePath(pathname);

  return (
    <SmoothScroll>
      <div className={styles.wrapper}>
        {!hideChrome ? <Header /> : null}
        {children}
        {!hideChrome ? <Footer /> : null}
      </div>
    </SmoothScroll>
  );
};
