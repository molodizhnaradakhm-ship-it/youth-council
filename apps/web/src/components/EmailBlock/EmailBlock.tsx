import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { EmailArrow } from '@/assets/react-icons/EmailArrow';

import { Email } from '../Email';
import { Text } from '../Text';

import styles from './EmailBlock.module.scss';

type Props = {
  className?: string;
  email: string;
  titleClassName?: string;
  variant?: 'default' | 'onLight';
};

export const EmailBlock = ({ className, email, titleClassName, variant = 'default' }: Props) => {
  const t = useTranslations('common');
  const titleClass = variant === 'onLight' ? styles.titleOnLight : styles.title;

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Text
        className={clsx(!titleClassName && titleClass, titleClassName)}
        tag={titleClassName ? 'p' : undefined}
        type={titleClassName ? undefined : 't1'}
      >
        {t('email_address')}
      </Text>
      <Email
        className={styles.email}
        color='text'
        copyActionLabel={t('copy_email')}
        email={email}
        icon={<EmailArrow />}
        surface={variant === 'onLight' ? 'onLight' : 'default'}
        type='p2'
      />
    </div>
  );
};

