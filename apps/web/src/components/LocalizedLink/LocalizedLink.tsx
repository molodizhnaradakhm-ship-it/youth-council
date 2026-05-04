import type { FC, ReactNode } from 'react';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type LocalizedLinkProps = {
  children: ReactNode;
  className?: string;
} & LinkProps;

export const LocalizedLink: FC<LocalizedLinkProps> = ({ children, className, href, ...props }) => {
  const locale = useLocale();

  const localizedHref =
    typeof href === 'string' && href.startsWith('/') ? `/${locale}${href}` : href;

  return (
    <Link className={className} href={localizedHref} {...props}>
      {children}
    </Link>
  );
};
