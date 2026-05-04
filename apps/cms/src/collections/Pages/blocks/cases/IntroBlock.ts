import type { Block } from 'payload';

import { link } from '@/fields/link';

export const IntroCasesBlock: Block = {
  fields: [
    {
      label: 'Background image',
      name: 'bgVideo',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'description',
      required: true,
      type: 'textarea',
    },
    link(),
  ],
  imageURL: '/admin-static/cases/intro.jpg',
  interfaceName: 'IntroCasesBlockFields',
  labels: {
    plural: 'Intro block',
    singular: 'Intro block',
  },
  slug: 'intro-cases-block',
};
