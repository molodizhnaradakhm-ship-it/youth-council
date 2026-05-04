import type { CollectionConfig } from 'payload';

import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';
import { slugBeforeReadCollection } from '@/hooks/getSlugs';

export const Participants: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    preview: ({ slug }) => `${process.env.WEB_URL}/participants/${slug}`,
    useAsTitle: 'title',
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
              label: 'Specialization',
              localized: true,
              name: 'specialization',
              required: true,
              type: 'text',
            },
            {
              label: 'Short description',
              localized: true,
              name: 'excerpt',
              required: true,
              type: 'textarea',
            },
            {
              fields: [
                {
                  localized: true,
                  name: 'label',
                  required: true,
                  type: 'text',
                },
              ],
              label: 'Keywords',
              labels: {
                plural: 'Keywords',
                singular: 'Keyword',
              },
              name: 'keywords',
              type: 'array',
            },
            {
              fields: [
                {
                  label: 'Organization',
                  localized: true,
                  name: 'organization',
                  required: true,
                  type: 'text',
                },
                {
                  admin: {
                    description: 'Optional details (address, department, etc.)',
                  },
                  localized: true,
                  name: 'note',
                  type: 'textarea',
                },
              ],
              label: 'Workplaces',
              labels: {
                plural: 'Workplaces',
                singular: 'Workplace',
              },
              name: 'workplaces',
              type: 'array',
            },
            {
              admin: {
                description: 'When the participant accepts visitors or appointments.',
              },
              label: 'Reception / appointment hours',
              localized: true,
              name: 'receptionHours',
              type: 'textarea',
            },
            {
              admin: {
                description: 'Displayed as a tel: link on the participant page.',
              },
              label: 'Phone',
              name: 'phone',
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
  ],
  hooks: {
    beforeRead: [slugBeforeReadCollection],
  },
  labels: {
    plural: 'Participants',
    singular: 'Participant',
  },
  slug: 'participants',
};
