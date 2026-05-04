import type { Block } from 'payload';

/** FAQ inside the home section wrapper. */
export const SectionFaqBlock: Block = {
  fields: [
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
      label: 'Section title',
      localized: true,
      name: 'title',
      required: true,
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
  interfaceName: 'SectionFaqBlockFields',
  labels: { plural: 'Section FAQ', singular: 'Section FAQ' },
  slug: 'section-faq-block',
};

