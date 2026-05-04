import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/Container';
import { ExploreContentBlocks } from '@/components/ExploreBlocks/ExploreContentBlocks';
import type { ExploreNavItem } from '@/lib/exploreTree';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import type { ExplorePage as ExplorePageDoc, ExploreSection, Media } from '@monorepo/cms/src/payload-types';

import { ExploreSectionsNav } from './ExploreSectionsNav';

import styles from './ExplorePage.module.scss';

function sectionIconUrl(icon: ExploreSection['icon']): string | null {
  if (!icon || typeof icon !== 'object' || !('url' in icon)) {
    return null;
  }
  const url = (icon as Media).url;
  if (typeof url !== 'string' || !url.trim()) {
    return null;
  }
  return resolvePayloadMediaUrl(url);
}

function compact<T>(list: Array<T | null | undefined | false>): T[] {
  return list.filter(Boolean) as T[];
}

type Props = {
  activePage: ExplorePageDoc | null;
  /** Slug of the CMS Explore section for the current URL (empty when none). */
  activeSectionSlug: string;
  navTreesBySection: Record<string, ExploreNavItem[]>;
  sections: ExploreSection[];
};

export const ExplorePage = async ({ activePage, activeSectionSlug, navTreesBySection, sections }: Props) => {
  const t = await getTranslations('details');

  const sectionRows = compact(
    sections.map((s) => {
      const slug = s.slug?.trim();
      if (!slug) return null;
      return { id: s.id, iconUrl: sectionIconUrl(s.icon), slug, title: s.title };
    }),
  );
  const hasSections = sectionRows.length > 0;

  const chooseItemText = t('choose_item');
  const primaryNav = hasSections ? (
    <ExploreSectionsNav
      activePageId={activePage?.id ?? null}
      activeSectionSlug={activeSectionSlug}
      ariaLabel={t('explore_sections_nav')}
      navTreesBySection={navTreesBySection}
      sections={sectionRows}
    />
  ) : null;

  const blocks = activePage?.blocks ?? [];
  const hasContent = blocks.length > 0;

  return (
    <div className={styles.wrapper}>
      <Container wide>
        <div className={styles.layout}>
          <aside className={`${styles.sidebar} ${styles.sidebarWithSub}`}>
            {primaryNav}

            {!hasSections ? <p className={styles.empty}>{chooseItemText}</p> : null}
          </aside>

          <article className={styles.article}>
            {activePage ? (
              <>
                <h2 className={styles.articleTitle}>{activePage.title}</h2>
                <ExploreContentBlocks blocks={blocks} />
                {!hasContent ? <p className={styles.empty}>{chooseItemText}</p> : null}
              </>
            ) : (
              <p className={styles.empty}>{chooseItemText}</p>
            )}
          </article>
        </div>
      </Container>
    </div>
  );
};
