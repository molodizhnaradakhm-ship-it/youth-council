import type { CollectionConfig } from 'payload';

import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';

export const BlogAuthors: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Categories',
    useAsTitle: 'title',
    preview: ({ slug }) => `${process.env.WEB_URL}/author/${slug}`,
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            {
              label: 'Name',
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              name: 'photo',
              relationTo: 'media',
              required: true,
              type: 'upload',
            },
            {
              localized: true,
              name: 'position',
              required: true,
              type: 'text',
            },
            {
              fields: [
                {
                  name: 'icon',
                  relationTo: 'media',
                  required: true,
                  type: 'upload',
                },
                {
                  label: 'Link',
                  name: 'link',
                  required: true,
                  type: 'text',
                },
              ],
              required: true,
              name: 'socList',
              labels: {
                plural: 'Social networks',
                singular: 'Social network',
              },
              type: 'array',
            },
            {
              name: 'email',
              required: true,
              type: 'text',
            },
            {
              label: 'Phone',
              name: 'phone',
              admin: {
                description: 'Displayed on the author page (tel: link)',
              },
              type: 'text',
            },
          ],
          label: 'Main',
        },
        {
          fields: [
            {
              label: 'About',
              localized: true,
              name: 'about',
              required: true,
              type: 'richText',
            },
          ],
          label: 'Content',
        },
        seoFields,
      ],
      type: 'tabs',
    },
    ...slugField(),
    {
      label: 'Author’s publications',
      name: 'publications',
      type: 'join',
      collection: 'blog',
      on: 'author',
    },
  ],
  labels: {
    plural: 'Blog authors',
    singular: 'Blog author',
  },
  slug: 'blog-authors',
};
