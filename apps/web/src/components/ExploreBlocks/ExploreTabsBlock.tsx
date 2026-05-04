'use client';

import { useId, useState } from 'react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { RenderBlocks } from '@/components/RenderBlocks';
import { exploreTabPanelMapper } from '@/views/Explore/exploreTabPanelMapper';
import type { ExploreTabsBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ExploreTabsBlock.module.scss';

export const ExploreTabsBlock = ({ tabs }: Pick<ExploreTabsBlockFields, 'tabs'>) => {
  const t = useTranslations('details');
  const baseId = useId();
  const [active, setActive] = useState(0);

  if (!tabs?.length) {
    return null;
  }

  const safeIndex = Math.min(active, tabs.length - 1);
  const activeTab = tabs[safeIndex];
  const panelBlocks = activeTab?.blocks;
  const panelId = `${baseId}-panel`;
  const activeTabId = `${baseId}-tab-${tabs[safeIndex]?.id ?? safeIndex}`;

  return (
    <div className={styles.root}>
      <div
        aria-label={t('explore_tabs_list_label')}
        className={styles.tabList}
        role='tablist'
      >
        {tabs.map((tab, index: number) => {
          const label = tab.label?.trim() || '—';
          const selected = index === safeIndex;
          const tabId = `${baseId}-tab-${tab.id ?? index}`;

          return (
            <button
              key={tab.id ?? `tab-${index}`}
              aria-controls={panelId}
              aria-selected={selected}
              className={clsx(styles.tab, selected && styles.tabActive)}
              id={tabId}
              role='tab'
              type='button'
              onClick={() => setActive(index)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={activeTabId}
        className={styles.panel}
        id={panelId}
        role='tabpanel'
        tabIndex={0}
      >
        {panelBlocks && panelBlocks.length > 0 ? (
          <RenderBlocks blocks={panelBlocks as never} mapper={exploreTabPanelMapper} />
        ) : (
          <p className={styles.empty}>{t('explore_tab_empty')}</p>
        )}
      </div>
    </div>
  );
};
