import type { Block } from 'payload';

import { exploreContentBlocksCore } from '../../shared/exploreContentBlocksCore';

export const ExploreTabsBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Each tab has its own blocks (same types as Content blocks, except nested Tabs).',
      },
      fields: [
        {
          label: 'Tab label',
          localized: true,
          name: 'label',
          required: true,
          type: 'text',
        },
        {
          blocks: exploreContentBlocksCore,
          label: 'Blocks',
          labels: {
            plural: 'Blocks',
            singular: 'Block',
          },
          localized: true,
          name: 'blocks',
          type: 'blocks',
        },
      ],
      labels: {
        plural: 'Tabs',
        singular: 'Tab',
      },
      localized: true,
      name: 'tabs',
      required: true,
      type: 'array',
    },
  ],
  interfaceName: 'ExploreTabsBlockFields',
  labels: {
    plural: 'Tabs',
    singular: 'Tabs',
  },
  slug: 'explore-tabs',
};
