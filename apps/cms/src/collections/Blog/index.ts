import type { CollectionConfig } from 'payload';

import { dateField } from '@/fields/date';
import { articleContentFields } from '@/fields/articleContentFields';
import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';
import { slugBeforeReadCollection } from '@/hooks/getSlugs';

export const Blog: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    preview: ({ slug }) => `${process.env.WEB_URL}/blog/${slug}`,
  },
  fields: [
    {
      type: 'tabs',
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
              label: 'Short description',
              localized: true,
              name: 'shortDescription',
              required: true,
              type: 'textarea',
            },
            {
              label: 'Read time (min)',
              name: 'readTime',
              required: true,
              type: 'number',
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
    },
    dateField(),
    {
      admin: {
        description:
          'Used in blog lists and cards. Recommended: 1200×900 px (4:3 aspect ratio). JPG or WebP, under 500 KB.',
        position: 'sidebar',
      },
      name: 'thumbnail',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'category',
      label: 'Choose category',
      relationTo: 'blog-categories',
      required: true,
      type: 'relationship',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'author',
      label: 'Choose author',
      relationTo: 'blog-authors',
      required: true,
      type: 'relationship',
    },
    {
      admin: {
        description: 'Optional: link this post to a council participant profile.',
        position: 'sidebar',
      },
      label: 'Related participant',
      name: 'relatedParticipant',
      relationTo: 'participants',
      required: false,
      type: 'relationship',
    },
    {
      admin: {
        description: 'Optional: link this post to a project profile.',
        position: 'sidebar',
      },
      label: 'Related project',
      name: 'relatedProject',
      relationTo: 'projects',
      required: false,
      type: 'relationship',
    },
    ...slugField(),
  ],
  hooks: {
    beforeRead: [slugBeforeReadCollection],
  },
  labels: {
    plural: 'Blog',
    singular: 'Post',
  },
  orderable: false,
  versions: {
    drafts: {
      schedulePublish: { timeFormat: 'HH:mm' },
    },
  },
  slug: 'blog',
};
