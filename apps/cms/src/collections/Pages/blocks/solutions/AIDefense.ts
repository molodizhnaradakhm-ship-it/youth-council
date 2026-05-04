import type { Block } from 'payload';

export const AIDefenseBlock: Block = {
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
      fields: [
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
          ],
          type: 'row',
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
  ],
  imageURL: '/admin-static/solutions/ai-defense.jpg',
  interfaceName: 'AIDefenseBlockFields',
  labels: {
    plural: 'AI Defense block',
    singular: 'AI Defense block',
  },
  slug: 'ai-defense-block',
};
