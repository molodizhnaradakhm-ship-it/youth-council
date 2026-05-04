import type { ReactNode } from 'react';

import styles from './ViewportSplit.module.scss';

type SlotProps = {
  children: ReactNode;
  className?: string;
};

/** Visible at max-width 767px (matches CMS “Mobile”). */
export const ViewportMobileOnly = ({ children, className }: SlotProps) => (
  <div className={[styles.mobileOnly, className].filter(Boolean).join(' ')}>{children}</div>
);

/** Visible from 768px up (matches CMS “Desktop”). */
export const ViewportDesktopOnly = ({ children, className }: SlotProps) => (
  <div className={[styles.desktopOnly, className].filter(Boolean).join(' ')}>{children}</div>
);
