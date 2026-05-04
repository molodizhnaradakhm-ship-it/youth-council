'use client';

import React from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { scrollToAnchor } from '@/utils/common';
import type { Form, Page } from '@monorepo/cms/src/payload-types';

import { FeedbackModal } from '../FeedbackModal';
import { LocalizedLink } from '../LocalizedLink';

const HOME_PAGE_SLUG = 'home' as const;

export type CMSLinkType = {
  appearance?: 'inline';
  children?: React.ReactNode;
  className?: string;
  label?: null | string;
  newTab?: boolean | null;
  reference?: {
    relationTo: 'pages' | 'posts' | 'forms';
    value: Page | number | string;
  } | null;
  form?: (string | null) | Form;
  type?: 'custom' | 'reference' | 'form' | null;
  url?: null | string;
};

function hasSlug(value: unknown): value is { slug: string } {
  return Boolean(value && typeof value === 'object' && 'slug' in value && typeof (value as any).slug === 'string');
}

function normalizeInternalPath(path: string): string {
  const normalized = path.replace(/\/+/g, '/');
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function getReferenceHref(reference: CMSLinkType['reference']): string | null {
  if (!reference || !hasSlug(reference.value)) return null;

  const prefix = reference.relationTo !== 'pages' ? `/${reference.relationTo}` : '';
  const slugPart = reference.value.slug === HOME_PAGE_SLUG ? '' : reference.value.slug;
  return normalizeInternalPath(`${prefix}/${slugPart}`) || '/';
}

/** Path without locale prefix, for active-state matching (mirrors href resolution below). */
export function getCMSLinkPath(
  props: Pick<CMSLinkType, 'type' | 'reference' | 'url'>,
): string | null {
  const { reference, type, url } = props;
  if (type === 'reference') return getReferenceHref(reference);

  if (url) {
    const base = url.split('#')[0];
    if (!base || /^https?:\/\//i.test(base)) return null;
    return normalizeInternalPath(base);
  }
  return null;
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const { appearance = 'inline', children, className, newTab, reference, type, url } = props;

  const pathname = usePathname();

  const href = type === 'reference' ? getReferenceHref(reference) : url ?? null;

  if (type === 'form') {
    return (
      <FeedbackModal
        trigger={<div className={className}>{children}</div>}
        form={props.form as Form}
      />
    );
  }

  if (!href) return <div className={className}>{children}</div>;

  const anchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const [basePathRaw, anchorId] = href.split('#');
    const basePath = basePathRaw ? normalizeInternalPath(basePathRaw) : '/';

    if (pathname === basePath) {
      e.preventDefault();
      scrollToAnchor(anchorId);
    }
  };

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {};

  return (
    <LocalizedLink
      onClick={appearance === 'inline' ? anchorClick : undefined}
      className={clsx(className)}
      href={href}
      {...newTabProps}
    >
      {children}
    </LocalizedLink>
  );
};
