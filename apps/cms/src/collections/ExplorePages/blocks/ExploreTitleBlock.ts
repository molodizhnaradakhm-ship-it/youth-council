import type { Block } from 'payload';

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

export const ExploreTitleBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Заголовок секції: жирний текст, посилання, за потреби — рівні H2/H3 з панелі.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
      }),
      label: 'Title',
      localized: true,
      name: 'content',
      required: true,
      type: 'richText',
    },
  ],
  interfaceName: 'ExploreTitleBlockFields',
  labels: {
    plural: 'Titles',
    singular: 'Title',
  },
  slug: 'explore-title',
};
