import type { Block } from 'payload';

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical';

export const ExploreParagraphBlock: Block = {
  fields: [
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
      }),
      label: 'Text',
      localized: true,
      name: 'content',
      required: true,
      type: 'richText',
    },
  ],
  interfaceName: 'ExploreParagraphBlockFields',
  labels: {
    plural: 'Paragraphs',
    singular: 'Paragraph',
  },
  slug: 'explore-paragraph',
};
