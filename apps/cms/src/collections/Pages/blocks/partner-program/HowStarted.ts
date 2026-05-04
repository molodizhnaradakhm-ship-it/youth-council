import type { Block } from 'payload';

import { link } from '@/fields/link';

export const HowStartedBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'description',
      required: true,
      type: 'textarea',
    },

    {
      fields: [
        {
          fields: [
            {
              localized: true,
              name: 'title',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'description',
              required: true,
              type: 'textarea',
            },
          ],
          type: 'row',
        },
      ],
      label: 'Steps',
      labels: {
        plural: 'Steps',
        singular: 'Step',
      },
      required: true,
      name: 'list',
      type: 'array',
    },
    link({
      overrides: { label: 'Schedule a Demo', name: 'scheduleDemo' },
    }),
    link({
      overrides: { label: 'Talk to an Expert', name: 'talkToExpert' },
    }),
  ],
  imageURL: '/admin-static/partner-program/how-started.jpg',
  interfaceName: 'HowStartedFields',
  labels: {
    plural: 'How Started block',
    singular: 'How Started block',
  },
  slug: 'how-started-block',
};
