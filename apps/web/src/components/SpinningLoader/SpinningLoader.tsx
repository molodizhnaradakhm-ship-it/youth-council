import clsx from 'clsx';

import styles from './SpinningLoader.module.scss';

type Props = {
  className?: string;
  color?: 'primary' | 'white';
  variant?: '1' | '2';
};

export const SpinningLoader = ({ className, color = 'primary', variant = '1' }: Props) => {
  return (
    <div
      className={clsx(styles[variant === '1' ? 'lds-ring' : 'loader'], styles[color], className)}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
