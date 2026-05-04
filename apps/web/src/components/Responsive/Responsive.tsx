import type { ComponentProps, JSX } from 'react';
import clsx from 'clsx';

import styles from './Responsive.module.scss';

type Devices = 'desktop' | 'laptop' | 'mobile' | 'tablet';
type DevicesWithoutMobile = Exclude<Devices, 'mobile'>;

type Props = {
  as?: keyof JSX.IntrinsicElements;
  flex?: boolean;
  grid?: boolean;
  hideFrom?: DevicesWithoutMobile;
  hideOnly?: Devices | Devices[];
  showFrom?: DevicesWithoutMobile;
  showOnly?: Devices | Devices[];
} & ComponentProps<'div'>;

export const Responsive = ({
  as: Component = 'div',
  children,
  className,
  flex = false,
  grid = false,
  hideFrom,
  hideOnly,
  showFrom,
  showOnly,
  ...props
}: Props) => {
  return (
    <Component
      {...(props as Record<string, unknown>)}
      className={clsx(
        hideFrom && clsx(styles.hideFrom, styles[hideFrom]),
        showFrom && clsx(styles.showFrom, styles[showFrom]),
        hideOnly &&
          clsx(
            styles.hideOnly,
            Array.isArray(hideOnly) ? hideOnly.map((each) => styles[each]) : styles[hideOnly],
          ),
        showOnly &&
          clsx(
            styles.showOnly,
            Array.isArray(showOnly) ? showOnly.map((each) => styles[each]) : styles[showOnly],
          ),
        flex && styles.flex,
        grid && styles.grid,
        className,
      )}
    >
      {children}
    </Component>
  );
};
