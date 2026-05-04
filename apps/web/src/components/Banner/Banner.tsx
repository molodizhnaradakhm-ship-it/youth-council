'use client';
import clsx from 'clsx';

import styles from './Banner.module.scss';

type Props = {
  className?: string;
};

export const Banner = ({ className }: Props) => {
  // Banner global was removed from app-wide globals.
  // Keep the component as a no-op to avoid breaking imports in case it's referenced.
  return <section className={clsx(styles.wrapper, className)} />;
};
