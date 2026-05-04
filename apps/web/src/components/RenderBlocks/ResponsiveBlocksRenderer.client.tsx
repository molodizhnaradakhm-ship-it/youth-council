'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { ViewportDesktopOnly, ViewportMobileOnly } from '@/components/ViewportSplit/ViewportSplit';

const DESKTOP_MQ = '(min-width: 768px)';

type Props = {
  desktop: ReactNode;
  mobile: ReactNode;
};

/**
 * SSR: обидві гілки в DOM + CSS (як раніше), щоб HTML збігався з першим клієнтським кадром.
 * Після mount залишаємо лише активну гілку — дубль з display:none ламав client-блоки всередині
 * (Framer Motion, вимірювання, подвійний HeroScroll тощо).
 */
export function ResponsiveBlocksSlot({ mobile, desktop }: Props) {
  const [narrowToOneBranch, setNarrowToOneBranch] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const apply = () => {
      setIsDesktop(mq.matches);
      setNarrowToOneBranch(true);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (narrowToOneBranch) {
    return <>{isDesktop ? desktop : mobile}</>;
  }

  return (
    <>
      <ViewportMobileOnly>{mobile}</ViewportMobileOnly>
      <ViewportDesktopOnly>{desktop}</ViewportDesktopOnly>
    </>
  );
}
