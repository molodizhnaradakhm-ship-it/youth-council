import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';

import { revalidateTopBanner } from './hooks/revalidateTopBanner';

export const TopBanner: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      label: 'Description',
      localized: true,
      name: 'description',
      required: true,
      type: 'richText',
    },
    {
      label: 'Description (mobile)',
      localized: true,
      name: 'descriptionMob',
      required: true,
      type: 'text',
    },
    link({
      overrides: {
        label: 'Explore Report',
      },
    }),
    {
      label: 'Hide top banner',
      name: 'hide',
      defaultValue: false,
      type: 'checkbox',
    },
  ],
  hooks: {
    afterChange: [revalidateTopBanner],
  },
  slug: 'top-banner',
};
