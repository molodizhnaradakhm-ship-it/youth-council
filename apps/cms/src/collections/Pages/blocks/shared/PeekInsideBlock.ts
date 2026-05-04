import type { Block } from 'payload';

export const PeekInsideBlock: Block = {
  slug: 'peek-inside-block',
  labels: { singular: 'Peek inside block', plural: 'Peek inside blocks' },
  interfaceName: 'PeekInsideBlockFields',
  fields: [
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'textarea',
    },
    {
      label: 'Description',
      localized: true,
      name: 'description',
      required: false,
      type: 'textarea',
    },
    {
      fields: [
        {
          label: 'Card title',
          localized: true,
          name: 'title',
          required: true,
          type: 'textarea',
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
          admin: { description: 'Image position on X axis (0–100).' },
          defaultValue: 50,
          label: 'Image position X',
          max: 100,
          min: 0,
          name: 'imagePosX',
          required: false,
          type: 'number',
        },
        {
          admin: { description: 'Image position on Y axis (0–100).' },
          defaultValue: 50,
          label: 'Image position Y',
          max: 100,
          min: 0,
          name: 'imagePosY',
          required: false,
          type: 'number',
        },
      ],
      label: 'Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      name: 'cards',
      required: true,
      type: 'array',
    },
  ],
};

