import type { Block } from 'payload';

import {
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical';

/** Main article body rich text — use inside Content blocks (blog posts, projects). */
export const PostDescriptionBlock: Block = {
  fields: [
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, EXPERIMENTAL_TableFeature(), UploadFeature()];
        },
      }),
      label: 'Text',
      localized: true,
      name: 'content',
      required: true,
      type: 'richText',
    },
  ],
  interfaceName: 'PostDescriptionBlockFields',
  labels: {
    plural: 'Post descriptions (rich text)',
    singular: 'Post description (rich text)',
  },
  slug: 'post-description-block',
};
