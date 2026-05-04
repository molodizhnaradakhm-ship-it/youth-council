import type { Block } from 'payload';

import { link } from '@/fields/link';

export const ThreatPreventionBlock: Block = {
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
      type: 'richText',
    },
    {
      label: 'Background image',
      name: 'bgImage',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      label: 'Icon Accordion',
      name: 'icon',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      fields: [
        {
          label: 'Title',
          name: 'title',
          required: true,
          localized: true,
          type: 'text',
        },
        {
          label: 'Description',
          name: 'description',
          required: true,
          localized: true,
          type: 'textarea',
        },

        {
          fields: [
            {
              label: 'Title tag',
              name: 'titleTag',
              required: true,
              localized: true,
              type: 'text',
            },
          ],
          label: 'Tags',
          labels: {
            plural: 'Tags',
            singular: 'Tag',
          },
          name: 'tagsList',
          type: 'array',
        },
      ],
      label: 'Advantages',
      labels: {
        plural: 'Advantages',
        singular: 'Advantage',
      },
      required: true,
      name: 'advantagesList',
      type: 'array',
    },
    link({
      overrides: { label: 'Book a Demo' },
    }),
  ],
  imageURL: '/admin-static/solutions/threat-prevention.jpg',
  interfaceName: 'ThreatPreventionBlockFields',
  labels: {
    plural: 'Threat Prevention block',
    singular: 'Threat Prevention block',
  },
  slug: 'threat-prevention-block',
};
