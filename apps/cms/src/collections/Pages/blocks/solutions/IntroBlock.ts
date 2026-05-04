import type { Block } from 'payload';

import { link } from '@/fields/link';

export const IntroSolutionsBlock: Block = {
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
      required: true,
      name: 'description',
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
    link({
      overrides: { label: 'Book a Demo' },
    }),
  ],
  imageURL: '/admin-static/solutions/intro-solutions.jpg',
  interfaceName: 'IntroSolutionsAllBlockFields',
  labels: {
    plural: 'Intro block',
    singular: 'Intro block',
  },
  slug: 'intro-solutions-all-block',
};
