import type { Block } from 'payload';

import { link } from '@/fields/link';

export const ContactsOfficeBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Shown on the left with rounded corners.',
      },
      label: 'Photo',
      name: 'photo',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
    {
      admin: {
        description: 'Shown as a tel: link when filled.',
      },
      label: 'Phone',
      localized: true,
      name: 'phone',
      required: false,
      type: 'text',
    },
    {
      label: 'Email',
      localized: true,
      name: 'email',
      required: false,
      type: 'text',
    },
    {
      label: 'Address',
      localized: true,
      name: 'address',
      required: false,
      type: 'textarea',
    },
    {
      admin: {
        description: 'Optional heading above the schedule lines.',
      },
      label: 'Working hours heading',
      localized: true,
      name: 'scheduleHeading',
      required: false,
      type: 'text',
    },
    {
      fields: [
        {
          label: 'Line',
          localized: true,
          name: 'line',
          required: true,
          type: 'text',
        },
      ],
      label: 'Working hours (lines)',
      labels: { plural: 'Lines', singular: 'Line' },
      minRows: 0,
      name: 'scheduleLines',
      required: false,
      type: 'array',
    },
    {
      admin: {
        description: 'Optional block with a title and action buttons (e.g. apply online).',
      },
      fields: [
        {
          defaultValue: true,
          label: 'Show application section title',
          name: 'showApplicationHeading',
          required: true,
          type: 'checkbox',
        },
        {
          admin: {
            description: 'Hidden if “Show title” is off.',
          },
          label: 'Application section title',
          localized: true,
          name: 'applicationHeading',
          required: false,
          type: 'text',
        },
        {
          fields: [
            link({
              appearances: ['default', 'outline'],
              optional: true,
              overrides: { label: 'Button' },
            }),
          ],
          label: 'Buttons',
          labels: { plural: 'Buttons', singular: 'Button' },
          minRows: 0,
          name: 'applicationButtons',
          required: false,
          type: 'array',
        },
      ],
      label: 'Application / CTA',
      name: 'application',
      required: false,
      type: 'group',
    },
  ],
  interfaceName: 'ContactsOfficeBlockFields',
  labels: {
    plural: 'Contacts — Office & info',
    singular: 'Contacts — Office & info',
  },
  slug: 'contacts-office-block',
};
