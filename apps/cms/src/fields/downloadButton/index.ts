import type { GroupField } from 'payload';

export const downloadButton = (): GroupField => ({
  fields: [
    {
      fields: [
        {
          required: true,
          name: 'label',
          type: 'text',
        },
        {
          label: 'Upload file',
          name: 'media',
          relationTo: 'media',
          required: true,
          type: 'upload',
        },
      ],
      type: 'row',
    },
  ],
  name: 'dowloadButton',
  required: true,
  type: 'group',
});
