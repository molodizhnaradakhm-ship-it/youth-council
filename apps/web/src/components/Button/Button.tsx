'use client';

import type { ComponentProps, ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '../Text';

import styles from './Button.module.scss';

type Props = {
  asDiv?: boolean;
  copyUrl?: string;
  fullWIdth?: boolean;
  icon?: ReactNode;
  isHeader?: boolean;
  isModal?: boolean;
  violet?: boolean;
  dark?: boolean;
  rounded?: boolean;
  /** Overrides default white label (e.g. language switch on light header) */
  textColor?: 'text' | 'white';
} & ComponentProps<'button'>;

export const Button = ({
  asDiv,
  children,
  className,
  dark,
  fullWIdth,
  isModal,
  isHeader,
  icon,
  violet,
  rounded,
  textColor,
  ...buttonHTMLAttrs
}: Props) => {
  const Component = asDiv ? 'div' : 'button';

  return (
    <>
      <Component
        {...(buttonHTMLAttrs as Record<string, unknown>)}
        className={clsx(
          styles.wrapper,
          fullWIdth && styles.fullWidth,
          violet && styles.violet,
          rounded && styles.rounded,
          dark && styles.dark,
          className,
        )}
      >
        <Text
          color={textColor ?? 'white'}
          type={isHeader ? 'p2' : isModal ? 't1' : 'p1'}
          tag='span'
        >
          {children}
        </Text>
        {icon && icon}
      </Component>
    </>
  );
};
