'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { Copy } from '../Copy';
import { Responsive } from '../Responsive';
import { Text } from '../Text';

import styles from './PhoneBlock.module.scss';

type Props = {
  className?: string;
  phone: string;
  titleClassName?: string;
  variant?: 'default' | 'onLight';
};

const telHref = (raw: string) => raw.replace(/[^\d+]/g, '');

export const PhoneBlock = ({ className, phone, titleClassName, variant = 'default' }: Props) => {
  const t = useTranslations('common');
  const trimmed = phone.trim();
  const href = telHref(trimmed);
  const labelClass = variant === 'onLight' ? styles.titleOnLight : styles.title;
  const rowClass = clsx(styles.row, variant === 'onLight' && styles.rowOnLight);

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Text
        className={clsx(!titleClassName && labelClass, titleClassName)}
        tag={titleClassName ? 'p' : undefined}
        type={titleClassName ? undefined : 't1'}
      >
        {t('field_number')}
      </Text>
      {trimmed ? (
        <>
          <Responsive hideFrom='laptop'>
            {href ? (
              <a className={clsx(styles.link, rowClass)} href={`tel:${href}`}>
                <Text color='text' type='p2'>
                  {trimmed}
                </Text>
              </a>
            ) : (
              <Text color='text' type='p2'>
                {trimmed}
              </Text>
            )}
          </Responsive>
          <Responsive showFrom='laptop'>
            <Copy className={rowClass} textToCopy={trimmed}>
              <Text className={styles.phoneText} color='text' type='p2'>
                {trimmed}
              </Text>
              <span aria-hidden className={styles.copyAction}>
                {t('copy_phone')}
              </span>
            </Copy>
          </Responsive>
        </>
      ) : null}
    </div>
  );
};
