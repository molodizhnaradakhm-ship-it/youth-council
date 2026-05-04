'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import * as Dialog from '@radix-ui/react-dialog';

import { useGlobals } from '@/contexts/GlobalsContext';
import { defaultLocale, locales } from '@/utils/config';

import { Button } from '../Button';

import styles from './SelectLanguage.module.scss';

const localeFlags: Record<string, string> = {
  en: '🇺🇸',
  ua: '🇺🇦',
};

const localeStringMap: Record<string, string> = {
  en: 'En',
  ua: 'Ua',
};

const LOCALE_PREFIX_RE = /^\/(en|ua)(?=\/|$)/;

function normalizeLocaleKey(locale: string): string {
  return locale === 'uk' ? 'ua' : locale;
}

/** Alternate href must be absolute; bare `host:port/path` is parsed as a relative path and breaks navigation. */
function hrefToPathname(href: string, origin: string): string {
  const t = href.trim();
  if (!t) return '/';
  if (t.startsWith('/')) {
    try {
      return new URL(t, origin).pathname;
    } catch {
      return '/';
    }
  }
  let absolute = t;
  if (!/^https?:\/\//i.test(t)) {
    absolute = t.startsWith('//') ? `http:${t}` : `http://${t}`;
  }
  try {
    return new URL(absolute).pathname;
  } catch {
    try {
      return new URL(t, origin).pathname;
    } catch {
      return '/';
    }
  }
}

type SelectLanguageProps = {
  className?: string;
  /** Light text on dark header vs dark text on light header */
  tone?: 'onDark' | 'onLight';
  /** Full locale tabs vs bottom-sheet (мобільне меню) */
  variant?: 'compact' | 'tabs';
};

export const SelectLanguage = ({
  className,
  tone = 'onDark',
  variant = 'tabs',
}: SelectLanguageProps) => {
  const pathname = usePathname();
  const activeLocale = useLocale();
  const t = useTranslations('language');
  const { header } = useGlobals();

  const [localesLinks, setLocalesLinks] = useState<Record<string, string> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const languageItems = (header as { languageMenu?: { items?: unknown } } | null | undefined)?.languageMenu
    ?.items as
    | { locale?: string; label?: string; shortLabel?: string; flag?: string }[]
    | undefined;

  const languageItemByLocale = useMemo(() => {
    const map = new Map<string, { locale?: string; label?: string; shortLabel?: string; flag?: string }>();
    for (const item of languageItems ?? []) {
      const key = normalizeLocaleKey(String(item.locale ?? ''));
      if (key) map.set(key, item);
    }
    return map;
  }, [languageItems]);

  const getItem = (locale: string) => languageItemByLocale.get(locale);

  const getLocaleLabel = (locale: string): string =>
    String(getItem(locale)?.label ?? '').trim() || locale;

  const getLocaleShortLabel = (locale: string): string => {
    const short = String(getItem(locale)?.shortLabel ?? '').trim();
    if (short) return short;
    const mapFallback = localeStringMap[locale];
    if (mapFallback) return mapFallback;
    return locale.toUpperCase().slice(0, 2);
  };

  const getLocaleFlag = (locale: string): string =>
    String(getItem(locale)?.flag ?? '').trim() || localeFlags[locale] || '🌐';

  useEffect(() => {
    const localesLinks = locales.reduce(
      (acc, locale) => {
        const hreflang = locale === 'ua' ? 'uk' : locale;
        const linkEl = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);

        let alternatePathname = linkEl?.getAttribute('href') || pathname;
        alternatePathname = hrefToPathname(alternatePathname, window.location.origin);

        // Видаляємо локаль на початку шляху
        alternatePathname = alternatePathname.replace(LOCALE_PREFIX_RE, '');

        // Формуємо фінальне посилання
        const localizedPath =
          locale === defaultLocale ? alternatePathname : `/${locale}${alternatePathname}`;

        acc[locale] = localizedPath || '/';
        return acc;
      },
      {} as Record<string, string>,
    );

    setLocalesLinks(localesLinks);
  }, [pathname]);

  if (variant === 'compact') {
    return (
      <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className={clsx(
              styles.compactTrigger,
              tone === 'onLight' && styles.summaryOnLight,
              className,
            )}
          >
            <span className={styles.summaryInner}>
              <span className={styles.flag} aria-hidden>
                {getLocaleFlag(activeLocale)}
              </span>
              <span className={styles.summaryLabel}>{getLocaleShortLabel(activeLocale)}</span>
            </span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.sheetOverlay} />
          <Dialog.Content
            className={styles.sheetContent}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className={styles.sheetHeader}>
              <Dialog.Title className={styles.sheetTitle}>{t('sheet_title')}</Dialog.Title>
              <Dialog.Close
                type="button"
                className={styles.sheetClose}
                aria-label={t('close')}
              >
                <span className={styles.sheetCloseIcon} aria-hidden>
                  ×
                </span>
              </Dialog.Close>
            </div>
            <ul className={styles.sheetList} role="listbox" aria-label={t('sheet_title')}>
              {locales.map((locale) => {
                const selected = locale === activeLocale;
                return (
                  <li key={locale} role="option" aria-selected={selected}>
                    <Link
                      href={localesLinks?.[locale] ?? '/'}
                      className={clsx(styles.sheetRow, !selected && styles.sheetRowMuted)}
                      aria-current={selected ? 'true' : undefined}
                      onClick={() => setSheetOpen(false)}
                    >
                      <span className={styles.sheetFlagWrap} aria-hidden>
                        <span className={styles.sheetFlag}>{getLocaleFlag(locale)}</span>
                      </span>
                      <span className={styles.sheetLabel}>{getLocaleLabel(locale)}</span>
                      <span className={styles.sheetRadio} aria-hidden>
                        {selected ? <span className={styles.sheetRadioDot} /> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <div
      className={clsx(styles.wrapper, tone === 'onLight' && styles.wrapperToneLight, className)}
    >
      {locales.map((locale) => {
        return (
          <Link
            key={locale}
            href={localesLinks?.[locale] ?? '/'}
          >
            <Button
              asDiv
              isHeader
              textColor={tone === 'onLight' ? 'text' : 'white'}
              className={clsx(styles.wrapper__item, locale === activeLocale && styles.active)}
            >
              {getLocaleShortLabel(locale)}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
