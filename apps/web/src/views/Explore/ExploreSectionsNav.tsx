'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { LocalizedLink } from '@/components/LocalizedLink';
import type { ExploreNavItem } from '@/lib/exploreTree';

import { ExploreNavTree } from './ExploreNavTree';

import styles from './ExploreSectionsNav.module.scss';

export type ExploreSectionNavRow = {
  id: string;
  slug: string;
  title: string;
  iconUrl: string | null;
};

type Props = {
  sections: ExploreSectionNavRow[];
  activeSectionSlug: string;
  navTreesBySection: Record<string, ExploreNavItem[]>;
  activePageId: string | null;
  ariaLabel: string;
};

function CaretDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill='none'
      height={16}
      viewBox='0 0 16 16'
      width={16}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M13.5306 6.53073L8.5306 11.5307C8.46092 11.6007 8.37813 11.6561 8.28696 11.694C8.1958 11.7318 8.09806 11.7513 7.99935 11.7513C7.90064 11.7513 7.8029 11.7318 7.71173 11.694C7.62057 11.6561 7.53778 11.6007 7.4681 11.5307L2.4681 6.53073C2.3272 6.38984 2.24805 6.19874 2.24805 5.99948C2.24805 5.80023 2.3272 5.60913 2.4681 5.46823C2.60899 5.32734 2.80009 5.24818 2.99935 5.24818C3.19861 5.24818 3.3897 5.32734 3.5306 5.46823L7.99997 9.93761L12.4693 5.46761C12.6102 5.32671 12.8013 5.24756 13.0006 5.24756C13.1999 5.24756 13.391 5.32671 13.5318 5.46761C13.6727 5.60851 13.7519 5.7996 13.7519 5.99886C13.7519 6.19812 13.6727 6.38921 13.5318 6.53011L13.5306 6.53073Z'
        fill='currentColor'
      />
    </svg>
  );
}

export const ExploreSectionsNav = ({
  sections,
  activeSectionSlug,
  navTreesBySection,
  activePageId,
  ariaLabel,
}: Props) => {
  const initialOpen = useMemo(() => {
    const set = new Set<string>();
    if (activeSectionSlug) {
      set.add(activeSectionSlug);
    }
    return set;
  }, [activeSectionSlug]);

  const [openSlugs, setOpenSlugs] = useState(() => initialOpen);

  useEffect(() => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (activeSectionSlug) {
        next.add(activeSectionSlug);
      }
      return next;
    });
  }, [activeSectionSlug]);

  const toggle = useCallback((slug: string) => {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  return (
    <nav aria-label={ariaLabel} className={styles.root}>
      <ul className={styles.list}>
        {sections.map((s) => {
          const tree = navTreesBySection[s.slug] ?? [];
          const hasTree = tree.length > 0;
          const isActiveSection = s.slug === activeSectionSlug;
          const isOpen = openSlugs.has(s.slug);

          return (
            <li key={s.id} className={styles.item}>
              <div
                className={clsx(
                  styles.row,
                  !isActiveSection && styles.rowMuted,
                  isActiveSection && styles.rowSectionSelected,
                  hasTree && styles.rowExpandable,
                )}
              >
                <LocalizedLink
                  className={styles.sectionLink}
                  href={`/explore/${s.slug}`}
                >
                  {s.iconUrl ? (
                    <span className={styles.iconWrap}>
                      <img
                        src={s.iconUrl}
                        alt=''
                        className={styles.iconImg}
                        width={18}
                        height={18}
                        loading='lazy'
                      />
                    </span>
                  ) : (
                    <span className={styles.iconFallback} aria-hidden />
                  )}
                  <span className={styles.sectionTitle}>{s.title}</span>
                </LocalizedLink>

                {hasTree ? (
                  <button
                    type='button'
                    className={styles.chevronBtn}
                    aria-expanded={isOpen}
                    aria-controls={`explore-section-panel-${s.slug}`}
                    onClick={() => toggle(s.slug)}
                  >
                    <CaretDownIcon
                      className={clsx(styles.caretIcon, isOpen ? styles.caretIconOpen : styles.caretIconCollapsed)}
                    />
                  </button>
                ) : null}
              </div>

              {hasTree && isOpen ? (
                <div
                  id={`explore-section-panel-${s.slug}`}
                  className={styles.panel}
                  role='region'
                >
                  <ExploreNavTree
                    activeId={isActiveSection ? activePageId : null}
                    items={tree}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
