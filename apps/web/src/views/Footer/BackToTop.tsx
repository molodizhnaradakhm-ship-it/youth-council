'use client';

import { useCallback, useEffect, useState } from 'react';

import styles from './BackToTop.module.scss';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = useCallback(() => {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      aria-label='Back to top'
      className={styles.button}
      onClick={scrollUp}
      type='button'
    >
      <svg aria-hidden fill='none' height='20' viewBox='0 0 24 24' width='20'>
        <path
          d='M12 5l7 7h-4v7H9v-7H5l7-7z'
          fill='currentColor'
        />
      </svg>
    </button>
  );
};
