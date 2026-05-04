import type { CollectionConfig } from 'payload';

import { slugBeforeRead } from '@/hooks/getSlugs';

export const BlogCategories: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Categories',
    useAsTitle: 'title',
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
  ],
  hooks: {
    beforeRead: [slugBeforeRead] as any,
  },
  labels: {
    plural: 'Blog categories',
    singular: 'Blog categories',
  },
  orderable: true,
  slug: 'blog-categories',
};
