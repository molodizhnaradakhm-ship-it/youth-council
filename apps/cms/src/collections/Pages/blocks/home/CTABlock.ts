import type { Block } from 'payload';

import { link } from '@/fields/link';

export const CTABlock: Block = {
  fields: [
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description: 'Optional short paragraph below the title.',
      },
      label: 'Description',
      localized: true,
      name: 'description',
      required: false,
      type: 'textarea',
    },
    {
      admin: {
        description: 'Optional right-side image (shown on desktop).',
      },
      label: 'Image',
      name: 'image',
      relationTo: 'media',
      localized: true,
      required: false,
      type: 'upload',
    },
    {
      admin: {
        description: '1–2 CTA buttons (white pills).',
      },
      fields: [
        link({
          appearances: false,
          overrides: { label: 'Link' },
        }),
        {
          admin: {
            description: 'Optional icon shown before the label.',
          },
          label: 'Icon',
          name: 'icon',
          relationTo: 'media',
          localized: true,
          required: false,
          type: 'upload',
        },
      ],
      label: 'Buttons',
      labels: { plural: 'Buttons', singular: 'Button' },
      maxRows: 2,
      minRows: 1,
      name: 'buttons',
      required: true,
      type: 'array',
    },
  ],
  imageURL: '/admin-static/home-cta.jpg',
  interfaceName: 'CTABlockFields',
  labels: {
    plural: 'CTA block',
    singular: 'CTA block',
  },
  slug: 'cta-block',
};

