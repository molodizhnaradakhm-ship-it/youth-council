import type { Block } from 'payload';

import { link } from '@/fields/link';

export const HeroPartnerProgramBlock: Block = {
  fields: [
    {
      label: 'Slogan',
      localized: true,
      name: 'slogan',
      required: true,
      type: 'text',
    },
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
        label: 'Join the Momentum',
      },
    }),
  ],
  imageURL: '/admin-static/partner-program/hero-partner.jpg',
  interfaceName: 'HeroPartnerProgramBlockFields',
  labels: {
    plural: 'Hero block',
    singular: 'Hero block',
  },
  slug: 'hero-partner-program-block',
};
