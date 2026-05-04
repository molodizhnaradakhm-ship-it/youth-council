import type { Block } from 'payload';

import { link } from '@/fields/link';

export const ExploreFeatureCardBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Large visual at the top; fades into the card background.',
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
  interfaceName: 'ExploreFeatureCardBlockFields',
  labels: {
    plural: 'Feature cards',
    singular: 'Feature card',
  },
  slug: 'explore-feature-card',
};
