import type { Block } from 'payload';

import { link } from '@/fields/link';

export const BlogBlock: Block = {
  fields: [
    {
      label: 'Block title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description:
          'Overrides the “Read more” label on blog cards in this block only. Leave empty to use the website default translation.',
      },
      label: 'Card CTA label (“Read more”)',
      localized: true,
      name: 'readMoreLabel',
      required: false,
      type: 'text',
    },
    link({
      overrides: {
        label: 'All posts link',
      },
    }),
    {
      label: 'Blog posts',
      hasMany: true,
      required: true,
      name: 'posts',
      relationTo: 'blog',
      type: 'relationship',
      maxRows: 4,
    },
  ],
  imageURL: '/admin-static/home-news.jpg',
  interfaceName: 'BlogBlockFields',
  labels: {
    plural: 'Blog block',
    singular: 'Blog block',
  },
  slug: 'blog-home-block',
};
