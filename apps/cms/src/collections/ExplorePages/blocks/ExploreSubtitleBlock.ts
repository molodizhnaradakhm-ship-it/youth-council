import type { Block } from 'payload';

export const ExploreSubtitleBlock: Block = {
  fields: [
    {
      label: 'Subtitle',
      localized: true,
      name: 'text',
      required: true,
      type: 'text',
    },
  ],
  interfaceName: 'ExploreSubtitleBlockFields',
  labels: {
    plural: 'Subtitles',
    singular: 'Subtitle',
  },
  slug: 'explore-subtitle',
};
