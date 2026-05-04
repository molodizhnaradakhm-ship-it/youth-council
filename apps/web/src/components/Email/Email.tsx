import type { ReactNode } from 'react';
import clsx from 'clsx';

import { Copy } from '../Copy';
import { Responsive } from '../Responsive';
import type { TextType } from '../Text';
import { Text } from '../Text';

import styles from './Email.module.scss';

type Props = {
  className?: string;
  color?: 'error' | 'white' | 'text' | 'light-violet' | 'main-violet' | 'blue-23' | 'inherit';
  copyActionLabel?: string;
  email: string;
  surface?: 'default' | 'onLight';
  type?: TextType;
  icon?: ReactNode;
};

export const Email = ({ className, color, copyActionLabel, email, surface = 'default', type, icon }: Props) => {
  const rowClass = clsx(styles.wrapper, surface === 'onLight' && styles.wrapperOnLight, className);

  return (
    <>
      <Responsive hideFrom='laptop'>
        <a className={rowClass} href={`mailto:${email}`}>
          <Text color={color} type={type}>
            {email}
          </Text>
          {icon && <span className={styles.icon}>{icon}</span>}
        </a>
      </Responsive>
      <Responsive showFrom='laptop'>
        <Copy className={rowClass} textToCopy={email}>
          <Text color={color} type={type} className={styles['email-text']}>
            {email}
          </Text>
          {copyActionLabel ? (
            <span className={styles.copyAction} aria-hidden>
              {copyActionLabel}
            </span>
          ) : null}
          {icon && <span className={styles.icon}>{icon}</span>}
        </Copy>
      </Responsive>
    </>
  );
};
