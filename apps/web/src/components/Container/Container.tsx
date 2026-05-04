import type { ComponentProps } from 'react';
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import styles from './Container.module.scss';

type ContainerProps = {
  wide?: boolean;
} & ComponentProps<'div'>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, wide = false, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx(styles.wrap, wide && styles.wide, className)} {...props}>
        {children}
      </div>
    );
  },
);

Container.displayName = 'Container';
