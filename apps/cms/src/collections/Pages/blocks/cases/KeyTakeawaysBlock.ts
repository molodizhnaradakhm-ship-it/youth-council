import type { Block } from 'payload';

export const KeyTakeawaysBlock: Block = {
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
      type: 'richText',
    },
    {
      fields: [
        {
          fields: [
            {
              localized: true,
              name: 'value',
              required: true,
              type: 'text',
            },
            {
              localized: true,
              name: 'description',
              required: true,
              type: 'text',
            },
          ],
          type: 'row',
        },
      ],
      label: 'Table',
      labels: {
        plural: 'Table',
        singular: 'Item',
      },
      maxRows: 4,
      required: true,
      name: 'tableList',
      type: 'array',
    },
  ],
  imageURL: '/admin-static/cases/key-takeaways.jpg',
  interfaceName: 'KeyTakeawaysBlockFields',
  labels: {
    plural: 'Key Takeaways block',
    singular: 'Key Takeaways block',
  },
  slug: 'key-takeaways-cases-block',
};
