import type { Block } from 'payload';

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

export const HintBlock: Block = {
  fields: [
    {
      admin: {
        description:
          'Visual format: Primary — original blue bar; Warning — warm gold / “Important” style; Info — neutral gray “Note” style; Success — green.',
      },
      defaultValue: 'primary',
      label: 'Type',
      name: 'variant',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Success', value: 'success' },
      ],
      required: true,
      type: 'select',
    },
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description: 'Main message (supports rich formatting).',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
      }),
      label: 'Text',
      localized: true,
      name: 'content',
      required: true,
      type: 'richText',
    },
    {
      admin: {
        description: 'Optional. If empty, the built-in icon for the selected type is shown.',
      },
      label: 'Custom icon',
      name: 'customIcon',
      relationTo: 'media',
      localized: true,
      required: false,
      type: 'upload',
    },
  ],
  imageURL: '/admin-static/hint-block.png',
  interfaceName: 'HintBlockFields',
  labels: {
    plural: 'Hint / callout',
    singular: 'Hint / callout',
  },
  slug: 'hint-block',
};
