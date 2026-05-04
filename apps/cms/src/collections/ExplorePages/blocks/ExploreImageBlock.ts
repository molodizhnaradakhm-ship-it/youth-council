import type { Block } from 'payload';

export const ExploreImageBlock: Block = {
  fields: [
    {
      label: 'Image',
      name: 'image',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      label: 'Caption',
      localized: true,
      name: 'caption',
      required: false,
      type: 'text',
    },
    {
      defaultValue: false,
      label: 'Full width',
      name: 'fullWidth',
      type: 'checkbox',
    },
    {
      admin: {
        condition: (_data, siblingData) => siblingData?.fullWidth !== true,
        description: 'Якщо «Full width» вимкнено — вирівнювання картинки в рядку (за шириною файлу).',
      },
      defaultValue: 'center',
      label: 'Image alignment',
      name: 'align',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      required: true,
      type: 'select',
    },
  ],
  interfaceName: 'ExploreImageBlockFields',
  labels: {
    plural: 'Images',
    singular: 'Image',
  },
  slug: 'explore-image',
};
