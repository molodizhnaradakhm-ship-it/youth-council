'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';

import styles from './OpenAppLink.module.scss';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'GoGym';
const IOS_URL = process.env.NEXT_PUBLIC_APP_STORE_IOS ?? '';
const ANDROID_URL = process.env.NEXT_PUBLIC_APP_STORE_ANDROID ?? '';
const DEEP_LINK_FALLBACK = process.env.NEXT_PUBLIC_APP_DEEP_LINK_FALLBACK ?? '';

function decodeParam(raw: string | undefined): string {
  if (!raw?.trim()) return '';
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

function isSafeRedirectUrl(url: string): boolean {
  const t = url.trim().toLowerCase();
  if (t.startsWith('javascript:') || t.startsWith('data:') || t.startsWith('vbscript:')) {
    return false;
  }
  return /^https?:\/\//i.test(t) || /^[a-z][a-z0-9+.-]*:/i.test(t);
}

type Props = {
  deepLinkParam?: string;
};

export const OpenAppLink = ({ deepLinkParam }: Props) => {
  const t = useTranslations('open_app');
  const [displayUrl, setDisplayUrl] = useState<string>('');

  const resolvedDeepLink = useMemo(() => {
    const decoded = decodeParam(deepLinkParam);
    if (decoded && isSafeRedirectUrl(decoded)) return decoded;
    return '';
  }, [deepLinkParam]);

  useEffect(() => {
    if (resolvedDeepLink) {
      setDisplayUrl(resolvedDeepLink);
      return;
    }
    if (typeof window !== 'undefined') {
      setDisplayUrl(window.location.href);
    }
  }, [resolvedDeepLink]);

  const openInApp = useCallback(() => {
    const target = resolvedDeepLink || DEEP_LINK_FALLBACK;
    if (target && isSafeRedirectUrl(target)) {
      window.location.assign(target);
    }
  }, [resolvedDeepLink]);

  const canOpen = Boolean(resolvedDeepLink || DEEP_LINK_FALLBACK);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <Text type='p2' color='text' className={styles.lead}>
          {t('lead')}
        </Text>
        <div className={styles.urlBox}>
          <Text type='p2' color='text' tag='p' className={styles.urlText}>
            {displayUrl || '—'}
          </Text>
        </div>
        <Button
          className={styles.primaryCta}
          disabled={!canOpen}
          fullWIdth
          type='button'
          violet
          onClick={openInApp}
        >
          {t('cta_open', { appName: APP_NAME })}
        </Button>
        <div className={styles.storeRow}>
          {IOS_URL ? (
            <a
              className={styles.storeLink}
              href={IOS_URL}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Text type='p2' color='inherit' tag='span'>
                {t('cta_app_store', { appName: APP_NAME })}
              </Text>
            </a>
          ) : null}
          {ANDROID_URL ? (
            <a
              className={styles.storeLink}
              href={ANDROID_URL}
              rel='noopener noreferrer'
              target='_blank'
            >
              <Text type='p2' color='inherit' tag='span'>
                {t('cta_play_store', { appName: APP_NAME })}
              </Text>
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
};
