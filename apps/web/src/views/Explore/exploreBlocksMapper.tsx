import { ExploreTabsBlock } from '@/components/ExploreBlocks/ExploreTabsBlock';

import { exploreTabPanelMapper } from './exploreTabPanelMapper';

export const exploreBlocksMapper = {
  ...exploreTabPanelMapper,
  'explore-tabs': (props: Record<string, unknown>) => <ExploreTabsBlock {...(props as any)} />,
};
