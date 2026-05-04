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
import type {
  ExploreFeatureCardBlockFields,
  ExploreFeatureCardsGridBlockFields,
  ExploreHtmlBlockFields,
  ExploreImageBlockFields,
  ExploreParagraphBlockFields,
  ExploreSubtitleBlockFields,
  ExploreTableBlockFields,
  ExploreTitleBlockFields,
  HintBlockFields,
} from '@monorepo/cms/src/payload-types';

export const exploreTabPanelMapper = {
  'explore-feature-card': (props: ExploreFeatureCardBlockFields) => <ExploreFeatureCardBlock {...props} />,
  'explore-feature-cards': (props: ExploreFeatureCardsGridBlockFields) => (
    <ExploreFeatureCardsGridBlock {...props} />
  ),
  'explore-html': (props: ExploreHtmlBlockFields) => <ExploreHtmlBlock {...props} />,
  'explore-image': (props: ExploreImageBlockFields) => <ExploreImageBlock {...props} />,
  'explore-paragraph': (props: ExploreParagraphBlockFields) => <ExploreParagraphBlock {...props} />,
  'explore-subtitle': (props: ExploreSubtitleBlockFields) => <ExploreSubtitleBlock {...props} />,
  'explore-table': (props: ExploreTableBlockFields) => <ExploreTableBlock {...props} />,
  'explore-title': (props: ExploreTitleBlockFields) => <ExploreTitleBlock {...props} />,
  'hint-block': (props: HintBlockFields) => <HintBlock {...props} insideContainer />,
};
