import type { Block } from 'payload';

import { link } from '@/fields/link';

export const PlayBigBlock: Block = {
  slug: 'our-team-block',
  labels: { singular: 'Our team block', plural: 'Our team blocks' },
  interfaceName: 'PlayBigBlockFields',
  fields: [
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'textarea',
    },
    {
      label: 'Description',
      localized: true,
      name: 'description',
      required: false,
      type: 'textarea',
    },
    {
      admin: {
        description: 'Background image for the section.',
      },
      label: 'Background image',
      name: 'backgroundImage',
      relationTo: 'media',
      localized: true,
      required: false,
      type: 'upload',
    },
    {
      admin: {
        description: 'Background image position on X axis (0–100).',
      },
      defaultValue: 50,
      label: 'Background position X',
      max: 100,
      min: 0,
      name: 'backgroundPosX',
      required: false,
      type: 'number',
    },
    {
      admin: {
        description: 'Background image position on Y axis (0–100).',
      },
      defaultValue: 50,
      label: 'Background position Y',
      max: 100,
      min: 0,
      name: 'backgroundPosY',
      required: false,
      type: 'number',
    },
    {
      fields: [
        {
          label: 'Pack title',
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          label: 'Pack description',
          localized: true,
          name: 'description',
          required: false,
          type: 'text',
        },
        {
          admin: { description: 'Round avatar shown in the center of the card.' },
          label: 'Avatar',
          name: 'avatar',
          relationTo: 'media',
          localized: true,
          required: false,
          type: 'upload',
        },
        {
          admin: { description: 'Show or hide button link for this card.' },
          defaultValue: true,
          label: 'Show button link',
          name: 'showButtonLink',
          required: false,
          type: 'checkbox',
        },
        link({
          appearances: false,
          overrides: { label: 'Button link' },
        }),
      ],
      label: 'Packs',
      labels: { singular: 'Pack', plural: 'Packs' },
      minRows: 1,
      name: 'packs',
      required: true,
      type: 'array',
    },
  ],
};

