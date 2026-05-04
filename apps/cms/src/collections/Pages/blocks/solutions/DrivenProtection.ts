import type { Block } from 'payload';

import { link } from '@/fields/link';

export const DrivenProtectionBlock: Block = {
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
      required: true,
      localized: true,
      name: 'description',
      type: 'richText',
    },
    {
      label: 'image',
      name: 'image',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      label: 'Ready to Get Started? Request a Demo!',
      localized: true,
      name: 'descriptionViolet',
      type: 'text',
      required: true,
    },

    link({
      overrides: { label: 'Schedule a Demo', name: 'scheduleDemo' },
    }),
    link({
      overrides: { label: 'Talk to an Expert', name: 'talkToExpert' },
    }),
  ],
  imageURL: '/admin-static/products/how-works.jpg',
  interfaceName: 'DrivenProtectionBlockFields',
  labels: {
    plural: 'Driven Protection block',
    singular: 'Driven Protection block',
  },
  slug: 'driven-protection-block',
};
