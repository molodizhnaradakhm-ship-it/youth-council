import type { CollectionConfig } from 'payload';

import { slugField } from '@/fields/slug';

import { revalidateExploreSections } from './hooks/revalidateExploreSections';

export const ExploreSections: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'icon', 'navOrder'],
    group: 'Content',
    useAsTitle: 'title',
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
      defaultValue: 0,
      label: 'Order in top menu',
      min: 0,
      name: 'navOrder',
      required: true,
      type: 'number',
    },
    {
      admin: {
        description: 'Optional. Shown in the Explore sidebar next to the section name (SVG or PNG).',
      },
      label: 'Icon',
      name: 'icon',
      relationTo: 'media',
      required: false,
      type: 'upload',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateExploreSections],
  },
  labels: {
    plural: 'Explore sections',
    singular: 'Explore section',
  },
  slug: 'explore-sections',
};
