import type { Block } from 'payload';

export const ExploreHtmlBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Trusted HTML from the CMS. Use for embeds or custom markup.',
      },
      label: 'HTML',
      localized: true,
      name: 'html',
      required: true,
      type: 'textarea',
    },
  ],
  interfaceName: 'ExploreHtmlBlockFields',
  labels: {
    plural: 'HTML',
    singular: 'HTML',
  },
  slug: 'explore-html',
};
