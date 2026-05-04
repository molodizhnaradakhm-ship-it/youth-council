import type { Block } from 'payload';

export const FaqBlock: Block = {
  slug: 'faq-block',
  labels: { singular: 'FAQ block', plural: 'FAQ blocks' },
  interfaceName: 'FaqBlockFields',
  fields: [
    {
      admin: {
        hidden: true,
      },
      defaultValue: 'light',
      label: 'Tone',
      name: 'tone',
      options: [
        { label: 'Light', value: 'light' },
      ],
      required: true,
      type: 'select',
    },
    {
      label: 'Icon',
      name: 'icon',
      relationTo: 'media',
      localized: true,
      required: false,
      type: 'upload',
    },
    {
      label: 'Icon size (px)',
      name: 'iconSizePx',
      type: 'number',
      required: false,
      admin: { description: 'Size of the icon shown above the title.' },
    },
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: false,
      type: 'textarea',
    },
    {
      fields: [
        {
          label: 'Question',
          localized: true,
          name: 'question',
          required: true,
          type: 'text',
        },
        {
          label: 'Answer',
          localized: true,
          name: 'answer',
          required: true,
          type: 'textarea',
        },
      ],
      label: 'Questions & answers',
      labels: { plural: 'Items', singular: 'Item' },
      minRows: 1,
      name: 'items',
      required: true,
      type: 'array',
    },
  ],
};

