import type { Block } from 'payload';

export const ManagmentBlock: Block = {
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
          label: 'Team photo',
          name: 'photo',
          relationTo: 'media',
          localized: true,
          required: true,
          type: 'upload',
        },
      ],
      label: 'All team',
      name: 'allTeam',
      type: 'group',
    },
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
        {
          fields: [
            {
              name: 'photo',
              relationTo: 'media',
              localized: true,
              required: true,
              type: 'upload',
            },
            {
              fields: [
                {
                  localized: true,
                  name: 'name',
                  required: true,
                  type: 'text',
                },
                {
                  localized: true,
                  name: 'position',
                  required: true,
                  type: 'text',
                },
              ],
              type: 'row',
            },
            {
              label: 'linkedin link',
              name: 'link',
              required: true,
              type: 'text',
            },
          ],
          required: true,
          name: 'teamList',
          labels: {
            plural: 'Team list',
            singular: 'Employee',
          },
          type: 'array',
        },
      ],
      required: true,
      name: 'list',
      label: 'Team blocks',
      labels: {
        plural: 'Blocks',
        singular: 'Block',
      },
      type: 'array',
    },
  ],
  imageURL: '/admin-static/about/managment.jpg',
  interfaceName: 'ManagmentBlockFields',
  labels: {
    plural: 'Managment block',
    singular: 'Managment block',
  },
  slug: 'managment-about-block',
};
