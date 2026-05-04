import clsx from 'clsx';

import { Text } from '../Text';

import styles from './Tag.module.scss';

type Props = {
  className?: string;
  title: string;
};

export const Tag = ({ className, title }: Props) => {
  return (
    <Text className={clsx(styles.wrapper, className)} type='p2' tag='span'>
      {title}
    </Text>
  );
};
