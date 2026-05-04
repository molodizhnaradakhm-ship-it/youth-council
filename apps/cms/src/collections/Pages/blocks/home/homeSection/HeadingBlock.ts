import type { Block } from 'payload';

export const HeadingBlock: Block = {
  fields: [
    {
      admin: { description: 'First line (gradient heading).' },
      label: 'Title line 1',
      localized: true,
      name: 'titleLine1',
      required: true,
      type: 'text',
    },
    {
      admin: { description: 'Second line (optional).' },
      label: 'Title line 2',
      localized: true,
      name: 'titleLine2',
      required: false,
      type: 'text',
    },
  ],
  interfaceName: 'HeadingBlockFields',
  labels: { plural: 'Section heading', singular: 'Section heading' },
  slug: 'heading-block',
};

