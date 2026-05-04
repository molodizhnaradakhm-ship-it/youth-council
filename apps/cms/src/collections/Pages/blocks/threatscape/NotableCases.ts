import type { Block } from 'payload';

export const NotableCasesBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      label: 'Image',
      name: 'image',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      fields: [
        {
          localized: true,
          name: 'description',
          required: true,
          type: 'text',
        },
      ],
      label: 'Advantages',
      labels: {
        plural: 'Advantages',
        singular: 'Advantage',
      },
      required: true,
      name: 'list',
      type: 'array',
    },
  ],
  imageURL: '/admin-static/threatscape/notable-cases.jpg',
  interfaceName: 'NotableCasesBlockFields',
  labels: {
    plural: 'Notable Cases block',
    singular: 'Notable Cases block',
  },
  slug: 'notable-cases-block',
};
