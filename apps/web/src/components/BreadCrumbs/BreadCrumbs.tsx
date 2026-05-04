import clsx from 'clsx';

import { LocalizedLink } from '../LocalizedLink';
import { Text } from '../Text';

import styles from './BreadCrumbs.module.scss';

type Props = {
  className?: string;
  list: {
    title: string;
    url?: string;
  }[];
  /** Muted neutrals for light backgrounds */
  variant?: 'default' | 'onLight';
};

export const BreadCrumbs = ({ className, list, variant = 'default' }: Props) => {
  return (
    <nav aria-label='Breadcrumb' className={clsx(styles.wrapper, variant === 'onLight' && styles.onLight, className)}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <LocalizedLink href={'/'} className={clsx(styles.link, styles.text)}>
            <Text type='p2' color='inherit'>
              Home
            </Text>
          </LocalizedLink>
        </li>
        {list.map(({ title, url }, index) => (
          <li className={styles.listItem} key={index}>
            {url ? (
              <LocalizedLink href={url} className={clsx(styles.link, styles.text)}>
                <Text type='p2' color='inherit' tag='span'>
                  {title}
                </Text>
              </LocalizedLink>
            ) : (
              <Text type='p2' className={styles.text} color='inherit' tag='span'>
                {title}
              </Text>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
