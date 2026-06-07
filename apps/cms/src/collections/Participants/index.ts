import type { CollectionConfig } from 'payload';

import { articleContentFields } from '@/fields/articleContentFields';
import { link } from '@/fields/link';
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
              admin: {
                description: 'Large photo on the participant profile page (left column).',
              },
              label: 'Content photo',
              name: 'contentPhoto',
              relationTo: 'media',
              required: true,
              type: 'upload',
            },
            {
              admin: {
                description:
                  'Used in participant cards on the listing. Recommended: 1200×900 px (4:3 aspect ratio). JPG or WebP, under 500 KB.',
              },
              label: 'Thumbnail',
              name: 'thumbnail',
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
                link({
                  appearances: false,
                  disableLabel: true,
                  optional: true,
                  overrides: {
                    admin: {
                      description:
                        'Optional. Internal page, custom URL, or form — the organization name becomes clickable when set.',
                    },
                    label: 'Organization link',
                    name: 'organizationLink',
                  },
                }),
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
            {
              fields: [
                {
                  label: 'Icon',
                  name: 'icon',
                  relationTo: 'media',
                  required: true,
                  type: 'upload',
                },
                {
                  admin: {
                    description: 'Full URL to the social profile (opens in a new tab).',
                  },
                  label: 'Link',
                  name: 'link',
                  required: true,
                  type: 'text',
                },
              ],
              labels: {
                plural: 'Social networks',
                singular: 'Social network',
              },
              name: 'socList',
              type: 'array',
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
    plural: 'Participants',
    singular: 'Participant',
  },
  slug: 'participants',
};
