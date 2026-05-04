import type { Block } from 'payload';

import { link } from '@/fields/link';

export const HeroThreatscapeBlock: Block = {
  fields: [
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      label: 'Description',
      localized: true,
      name: 'description',
      required: true,
      type: 'textarea',
    },
    {
      label: 'Background video or image (.mp4)',
      name: 'bgVideo',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      label: 'Image',
      name: 'image',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    link({
      overrides: {
        label: 'Download Report',
      },
    }),
  ],
  imageURL: '/admin-static/threatscape/hero.jpg',
  interfaceName: 'HeroThreatscapeBlockFields',
  labels: {
    plural: 'Hero block',
    singular: 'Hero block',
  },
  slug: 'hero-threatscape-block',
};
