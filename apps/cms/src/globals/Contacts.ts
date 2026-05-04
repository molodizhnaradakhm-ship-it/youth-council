import type { GlobalConfig } from 'payload';

import { revalidateContacts } from './hooks/revalidateContacts';

export const Contacts: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      fields: [
        // {
        //   label: 'Phone',
        //   name: 'phone',
        //   required: true,
        //   type: 'text',
        // },
        {
          label: 'Email',
          name: 'email',
          required: true,
          type: 'text',
        },
      ],
      type: 'row',
    },
    {
      fields: [
        {
          label: 'Address',
          name: 'address',
          required: true,
          localized: true,
          type: 'text',
        },
        {
          label: 'Google Map Link',
          name: 'gMapLink',
          required: true,
          type: 'text',
        },
      ],
      type: 'row',
    },
    {
      fields: [
        {
          fields: [
            {
              label: 'Card image',
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
          type: 'row',
        },
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
              label: 'Description',
              localized: true,
              name: 'description',
              required: true,
              type: 'textarea',
            },
          ],
          type: 'row',
        },
      ],
      label: 'Social Media Links',
      labels: {
        plural: 'Social Media Links',
        singular: 'Social Media Link',
      },
      admin: {
        description:
          'Необов’язково. Якщо порожньо — блок соцмереж у футері/меню не показується (крім окремих іконок у Footer → Social links).',
      },
      minRows: 0,
      name: 'socialLinks',
      required: false,
      type: 'array',
    },
    {
      admin: {
        description: 'Optional line under the intro, e.g. @yourbrand',
      },
      label: 'Social handle (display)',
      localized: true,
      name: 'socialHandle',
      required: false,
      type: 'text',
    },
    {
      admin: {
        description: 'Optional; shown in the “Payment / legal” section (local entity).',
      },
      label: 'Payment & legal — local',
      localized: true,
      name: 'paymentLocal',
      required: false,
      type: 'richText',
    },
    {
      admin: {
        description: 'Optional; second column (e.g. international bank details).',
      },
      label: 'Payment & legal — international',
      localized: true,
      name: 'paymentInternational',
      required: false,
      type: 'richText',
    },
  ],
  hooks: {
    afterChange: [revalidateContacts],
  },
  label: 'Contacts',
  slug: 'contacts',
};
