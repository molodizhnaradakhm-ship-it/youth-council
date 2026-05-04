'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { BackIcon } from '@/assets/react-icons/BackIcon';

import { Text } from '../Text';

import styles from './BackButton.module.scss';

type Props = {
  className?: string;
};

export const BackButton = ({ className }: Props) => {
  const router = useRouter();
  const t = useTranslations('common');
  return (
    <button className={clsx(styles.wrapper, className)} onClick={() => router.back()}>
      <BackIcon />
      <Text type='p2' color='inherit'>
        {t('go_back_button')}
      </Text>
    </button>
  );
};
