import { ExploreTabsBlock } from '@/components/ExploreBlocks/ExploreTabsBlock';
import type { ExploreTabsBlockFields } from '@monorepo/cms/src/payload-types';

import { exploreTabPanelMapper } from './exploreTabPanelMapper';

export const exploreBlocksMapper = {
  ...exploreTabPanelMapper,
  'explore-tabs': (props: ExploreTabsBlockFields) => <ExploreTabsBlock {...props} />,
};
