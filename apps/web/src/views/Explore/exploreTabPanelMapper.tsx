/**
 * Blocks allowed inside an Explore tab panel (matches CMS `exploreContentBlocksCore` — no nested Tabs).
 * Kept separate from `exploreBlocksMapper` so `ExploreTabsBlock` does not circular-import the full mapper.
 */
import { ExploreFeatureCardBlock } from '@/components/ExploreBlocks/ExploreFeatureCardBlock';
import { ExploreFeatureCardsGridBlock } from '@/components/ExploreBlocks/ExploreFeatureCardsGridBlock';
import { ExploreHtmlBlock } from '@/components/ExploreBlocks/ExploreHtmlBlock';
import { ExploreImageBlock } from '@/components/ExploreBlocks/ExploreImageBlock';
import { ExploreParagraphBlock } from '@/components/ExploreBlocks/ExploreParagraphBlock';
import { ExploreSubtitleBlock } from '@/components/ExploreBlocks/ExploreSubtitleBlock';
import { ExploreTableBlock } from '@/components/ExploreBlocks/ExploreTableBlock';
import { ExploreTitleBlock } from '@/components/ExploreBlocks/ExploreTitleBlock';
import { HintBlock } from '@/components/HintBlock';

export const exploreTabPanelMapper = {
  'explore-feature-card': (props: Record<string, unknown>) => (
    <ExploreFeatureCardBlock {...(props as any)} />
  ),
  'explore-feature-cards': (props: Record<string, unknown>) => (
    <ExploreFeatureCardsGridBlock {...(props as any)} />
  ),
  'explore-html': (props: Record<string, unknown>) => <ExploreHtmlBlock {...(props as any)} />,
  'explore-image': (props: Record<string, unknown>) => <ExploreImageBlock {...(props as any)} />,
  'explore-paragraph': (props: Record<string, unknown>) => (
    <ExploreParagraphBlock {...(props as any)} />
  ),
  'explore-subtitle': (props: Record<string, unknown>) => (
    <ExploreSubtitleBlock {...(props as any)} />
  ),
  'explore-table': (props: Record<string, unknown>) => <ExploreTableBlock {...(props as any)} />,
  'explore-title': (props: Record<string, unknown>) => <ExploreTitleBlock {...(props as any)} />,
  'hint-block': (props: Record<string, unknown>) => (
    <HintBlock {...(props as any)} insideContainer />
  ),
};
