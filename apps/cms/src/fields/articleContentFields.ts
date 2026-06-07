import type { Field } from 'payload';

import { exploreContentBlocks } from '@/collections/shared/exploreContentBlocks';

/** Block layout for blog posts, project pages, and participant profiles (no standalone rich-text field). */
export const articleContentFields: Field[] = [
  {
    admin: {
      description:
        'Page body. Add «Post description (rich text)» for the main text, plus images, headings, tables, etc.',
    },
    blocks: exploreContentBlocks,
    label: 'Content blocks',
    labels: {
      plural: 'Blocks',
      singular: 'Block',
    },
    localized: true,
    name: 'contentBlocks',
    type: 'blocks',
  },
];
