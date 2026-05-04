import type { CollectionConfig } from 'payload';

import { dateField } from '@/fields/date';
import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';
import { slugBeforeReadCollection } from '@/hooks/getSlugs';

import { exploreContentBlocks } from '../shared/exploreContentBlocks';

import {
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical';

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
          fields: [
            {
              admin: {
                description:
                  'Legacy body. Optional if you use Content blocks below — then blocks replace this on the site.',
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [...rootFeatures, EXPERIMENTAL_TableFeature(), UploadFeature()];
                },
              }),
              label: 'Post description (rich text)',
              localized: true,
              name: 'description',
              required: false,
              type: 'richText',
            },
            {
              admin: {
                description:
                  'Same blocks as Explore pages: titles, paragraphs, images, tables, HTML, hints. If any block is added, the article body shows these blocks instead of the rich text field.',
              },
              blocks: exploreContentBlocks,
              label: 'Content blocks',
              labels: {
                plural: 'Blocks',
                singular: 'Block',
              },
              localized: true,
              name: 'contentBlocks',
              type: 'blocks',
            },
          ],
          label: 'Content',
        },
        seoFields,
      ],
    },
    dateField(),
    {
      admin: {
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
