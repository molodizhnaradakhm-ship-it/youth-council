import type { Block } from 'payload';

import { ExploreFeatureCardBlock } from '../ExplorePages/blocks/ExploreFeatureCardBlock';
import { ExploreFeatureCardsGridBlock } from '../ExplorePages/blocks/ExploreFeatureCardsGridBlock';
import { ExploreHtmlBlock } from '../ExplorePages/blocks/ExploreHtmlBlock';
import { ExploreImageBlock } from '../ExplorePages/blocks/ExploreImageBlock';
import { ExploreParagraphBlock } from '../ExplorePages/blocks/ExploreParagraphBlock';
import { ExploreSubtitleBlock } from '../ExplorePages/blocks/ExploreSubtitleBlock';
import { ExploreTableBlock } from '../ExplorePages/blocks/ExploreTableBlock';
import { ExploreTitleBlock } from '../ExplorePages/blocks/ExploreTitleBlock';
import { HintBlock } from '../Pages/blocks/shared/HintBlock';
import { buildResponsiveBlocksBlock } from './ResponsiveBlocks';

/** Content blocks without `explore-tabs` — used inside tab panels to avoid circular imports. */
const exploreContentBlocksCoreBase: Block[] = [
  HintBlock,
  ExploreFeatureCardBlock,
  ExploreFeatureCardsGridBlock,
  ExploreHtmlBlock,
  ExploreImageBlock,
  ExploreTitleBlock,
  ExploreSubtitleBlock,
  ExploreParagraphBlock,
  ExploreTableBlock,
];

export const exploreContentBlocksCore: Block[] = [
  ...exploreContentBlocksCoreBase,
  buildResponsiveBlocksBlock({
    label: 'Responsive (mobile / desktop)',
    slug: 'responsive-blocks-panel',
    blocks: exploreContentBlocksCoreBase,
  }),
];
