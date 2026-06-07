import type { CollectionConfig } from 'payload';

import { articleContentFields } from '@/fields/articleContentFields';
import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';
import { slugBeforeReadCollection } from '@/hooks/getSlugs';

export const Projects: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    preview: ({ slug }) => `${process.env.WEB_URL}/projects/${slug}`,
    useAsTitle: 'title',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            {
              label: 'Title',
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              name: 'cover',
              label: 'Cover image',
              relationTo: 'media',
              required: true,
              type: 'upload',
            },
            {
              label: 'Short description',
              localized: true,
              name: 'excerpt',
              required: true,
              type: 'textarea',
            },
            {
              admin: {
                description:
                  'Email for the “Join project” button. Leave empty to use Contacts → Email.',
              },
              label: 'Join project email',
              name: 'joinEmail',
              type: 'text',
            },
            {
              defaultValue: true,
              label: 'Show “Join project” button',
              name: 'showJoinButton',
              type: 'checkbox',
            },
          ],
          label: 'Main',
        },
        {
          fields: articleContentFields,
          label: 'Content',
        },
        seoFields,
      ],
      type: 'tabs',
    },
    ...slugField(),
  ],
  hooks: {
    beforeRead: [slugBeforeReadCollection],
  },
  labels: {
    plural: 'Projects',
    singular: 'Project',
  },
  slug: 'projects',
};
