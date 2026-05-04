import type { Block } from 'payload';

export const ExploreTableBlock: Block = {
  fields: [
    {
      label: 'Caption',
      localized: true,
      name: 'caption',
      required: false,
      type: 'text',
    },
    {
      defaultValue: true,
      label: 'First row is header',
      name: 'headerRow',
      type: 'checkbox',
    },
    {
      admin: {
        description: 'Add rows; each row has cells left to right.',
      },
      fields: [
        {
          fields: [
            {
              label: 'Cell',
              localized: true,
              name: 'value',
              required: true,
              type: 'text',
            },
          ],
          label: 'Cells',
          labels: {
            plural: 'Cells',
            singular: 'Cell',
          },
          minRows: 1,
          name: 'cells',
          type: 'array',
        },
      ],
      label: 'Rows',
      labels: {
        plural: 'Rows',
        singular: 'Row',
      },
      minRows: 1,
      name: 'rows',
      type: 'array',
    },
  ],
  interfaceName: 'ExploreTableBlockFields',
  labels: {
    plural: 'Tables',
    singular: 'Table',
  },
  slug: 'explore-table',
};
