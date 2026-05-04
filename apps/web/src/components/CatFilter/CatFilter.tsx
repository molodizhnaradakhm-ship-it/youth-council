'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import styles from './CatFilter.module.scss';

type Option = {
  id: string;
  title: string;
};

type Props = {
  className?: string;
  categories?: Option[];
  authors?: Option[];
  years?: number[];
  /** Light UI (blog hero) vs dark text on dark strip (e.g. author publications) */
  tone: 'light' | 'dark';
  /** Default: light = centered, dark = end. Override row alignment of filter dropdowns. */
  filterAlign?: 'start' | 'end';
};

type ParamKey = 'year' | 'category' | 'author';

type DropdownOption = { value: string; label: string };

function Chevron({ open, tone }: { open: boolean; tone: 'light' | 'dark' }) {
  return (
    <span
      className={clsx(styles.chevron, open && styles.chevronOpen, tone === 'light' ? styles.chevronLight : styles.chevronDark)}
      aria-hidden
    />
  );
}

function FilterDropdown({
  label,
  tone,
  value,
  options,
  isOpen,
  onOpenChange,
  onSelect,
}: {
  label: string;
  tone: 'light' | 'dark';
  value: string;
  options: DropdownOption[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
}) {
  const baseId = useId();
  const listId = `${baseId}-list`;
  const labelId = `${baseId}-label`;

  const selectedLabel = options.find((o) => o.value === value)?.label ?? options[0]?.label ?? '';

  const handlePick = (next: string) => {
    onSelect(next);
    onOpenChange(false);
  };

  return (
    <div className={styles.field}>
      <span id={labelId} className={clsx(styles.fieldLabel, tone === 'light' ? styles.fieldLabelLight : styles.fieldLabelDark)}>
        {label}
      </span>
      <div className={styles.dropdown}>
        <button
          type='button'
          className={clsx(
            styles.trigger,
            tone === 'light' ? styles.triggerLight : styles.triggerDark,
            isOpen && styles.triggerOpen,
          )}
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-controls={listId}
          aria-labelledby={labelId}
          onClick={() => onOpenChange(!isOpen)}
        >
          <span className={styles.triggerValue}>{selectedLabel}</span>
          <Chevron open={isOpen} tone={tone} />
        </button>
        {isOpen ? (
          <div
            id={listId}
            className={clsx(styles.menu, tone === 'light' ? styles.menuLight : styles.menuDark)}
            role='listbox'
            aria-labelledby={labelId}
          >
            {options.map((opt) => (
              <button
                key={opt.value || '__all'}
                type='button'
                role='option'
                aria-selected={value === opt.value}
                className={clsx(
                  styles.menuOption,
                  tone === 'light' ? styles.menuOptionLight : styles.menuOptionDark,
                  value === opt.value && styles.menuOptionActive,
                )}
                onClick={() => handlePick(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const CatFilter = ({ className, categories, authors, years, tone, filterAlign }: Props) => {
  const t = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openKey, setOpenKey] = useState<ParamKey | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentValues = {
    category: searchParams.get('category') || '',
    author: searchParams.get('author') || '',
    year: searchParams.get('year') || '',
  };

  const handleChange = useCallback(
    (key: string, next: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next) {
        params.set(key, next);
      } else {
        params.delete(key);
      }

      params.delete('loadMore');
      router.push(`?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (!openKey) return;

    const onDocMouseDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpenKey(null);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };

    document.addEventListener('mousedown', onDocMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey]);

  const showYears = Boolean(years?.length);
  const showAuthors = Boolean(authors?.length);
  const showCategories = Boolean(categories?.length);

  if (!showYears && !showAuthors && !showCategories) {
    return null;
  }

  const allLabel = t('all');

  const yearOptions: DropdownOption[] = [
    { value: '', label: allLabel },
    ...(years ?? []).map((y) => ({ value: String(y), label: String(y) })),
  ];

  const authorOptions: DropdownOption[] = [
    { value: '', label: allLabel },
    ...(authors ?? []).map((opt) => ({ value: opt.id, label: opt.title })),
  ];

  const categoryOptions: DropdownOption[] = [
    { value: '', label: allLabel },
    ...(categories ?? []).map((opt) => ({ value: opt.id, label: opt.title })),
  ];

  return (
    <div
      ref={rootRef}
      className={clsx(
        styles.root,
        tone === 'light' ? styles.rootLight : styles.rootDark,
        filterAlign === 'start' && styles.rootAlignStart,
        filterAlign === 'end' && styles.rootAlignEnd,
        className,
      )}
    >
      {showYears ? (
        <FilterDropdown
          label={t('filter_year')}
          tone={tone}
          value={currentValues.year}
          options={yearOptions}
          isOpen={openKey === 'year'}
          onOpenChange={(open) => setOpenKey(open ? 'year' : null)}
          onSelect={(v) => handleChange('year', v)}
        />
      ) : null}
      {showAuthors ? (
        <FilterDropdown
          label={t('filter_author')}
          tone={tone}
          value={currentValues.author}
          options={authorOptions}
          isOpen={openKey === 'author'}
          onOpenChange={(open) => setOpenKey(open ? 'author' : null)}
          onSelect={(v) => handleChange('author', v)}
        />
      ) : null}
      {showCategories ? (
        <FilterDropdown
          label={t('filter_theme')}
          tone={tone}
          value={currentValues.category}
          options={categoryOptions}
          isOpen={openKey === 'category'}
          onOpenChange={(open) => setOpenKey(open ? 'category' : null)}
          onSelect={(v) => handleChange('category', v)}
        />
      ) : null}
    </div>
  );
};
