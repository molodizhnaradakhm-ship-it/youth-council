import type { Block } from 'payload';

import { link } from '@/fields/link';

export const ExploreFeatureCardsGridBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Number of cards per row on tablet and desktop (mobile is always one column).',
      },
      defaultValue: '2',
      label: 'Cards per row',
      name: 'gridColumns',
      options: [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      required: true,
      type: 'select',
    },
    {
      fields: [
        {
          admin: {
            description: '330px tall area; image scales inside without cropping past the card width.',
          },
          label: 'Image',
          localized: true,
          name: 'image',
          relationTo: 'media',
          required: true,
          type: 'upload',
        },
        {
          label: 'Title',
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        link({
          disableLabel: true,
          optional: false,
        }),
      ],
      labels: { plural: 'Cards', singular: 'Card' },
      minRows: 1,
      name: 'cards',
      required: true,
      type: 'array',
    },
  ],
  interfaceName: 'ExploreFeatureCardsGridBlockFields',
  labels: {
    plural: 'Feature cards grid',
    singular: 'Feature cards grid',
  },
  slug: 'explore-feature-cards',
};
