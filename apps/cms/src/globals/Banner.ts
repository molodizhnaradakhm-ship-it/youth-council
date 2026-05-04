import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';

import { revalidateBanner } from './hooks//revalidateBanner';

export const Banner: GlobalConfig = {
  access: {
    read: () => true,
  },
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
      localized: true,
      name: 'description',
      required: true,
      type: 'textarea',
    },
    {
      label: 'Image',
      name: 'image',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
    link({
      appearances: false,
      overrides: {
        label: 'Download Report',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateBanner],
  },
  slug: 'banner',
};
