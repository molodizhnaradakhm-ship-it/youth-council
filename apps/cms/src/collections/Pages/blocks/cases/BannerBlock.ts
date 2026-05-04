import type { Block } from 'payload';

import { link } from '@/fields/link';

export const BannerCasesBlock: Block = {
  fields: [
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
    link({
      overrides: {
        label: 'Button 1',
        name: 'button1',
      },
    }),
    link({
      overrides: {
        label: 'Button 2',
        name: 'button2',
      },
    }),
  ],
  imageURL: '/admin-static/cases/banner.jpg',
  interfaceName: 'BannerBlockFields',
  labels: {
    plural: 'Banner block',
    singular: 'Banner block',
  },
  slug: 'banner-cases-block',
};
