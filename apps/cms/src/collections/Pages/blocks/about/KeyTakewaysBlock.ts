import type { Block } from 'payload';

export const KeyTakewaysBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'description',
      required: true,
      type: 'richText',
    },
  ],
  imageURL: '/admin-static/about/key-takeways.jpg',
  interfaceName: 'KeyTakewaysBlockFields',
  labels: {
    plural: 'Key takeways block',
    singular: 'Key takeways block',
  },
  slug: 'key-takeways-about-block',
};
