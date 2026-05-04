'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import type { Media } from '@monorepo/cms/src/payload-types';

import { CMSMedia } from '../CMSMedia';
import { Text } from '../Text';

import styles from './SocialsBlock.module.scss';

type Props = {
  className?: string;
  hideTitle?: boolean;
  socList: {
    icon: string | Media;
    link?: string | null;
    id?: string | null;
  }[];
  variant?: 'default' | 'footer' | 'onLight';
};

export const SocialsBlock = ({ className, hideTitle, socList, variant = 'default' }: Props) => {
  const t = useTranslations('common');
  return (
    <div className={clsx(styles.wrapper, variant === 'footer' && styles.footerVariant, className)}>
      {!hideTitle && (
        <Text className={variant === 'onLight' ? styles.titleOnLight : styles.title} type='t1'>
          {t('social_media')}
        </Text>
      )}
      <ul className={styles.list}>
        {socList.map(({ id, icon, link }) => (
          <li key={id}>
            {typeof link === 'string' && link.trim() !== '' ? (
              <a href={link} rel='noopener noreferrer' target='_blank'>
                <CMSMedia className={styles.icon} resource={icon} />
              </a>
            ) : (
              <span aria-hidden>
                <CMSMedia className={styles.icon} resource={icon} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

