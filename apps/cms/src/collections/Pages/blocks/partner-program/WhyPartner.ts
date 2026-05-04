import type { Block } from 'payload';

export const WhyPartnerBlock: Block = {
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
      type: 'textarea',
    },
    {
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
      label: 'Advantages',
      labels: {
        plural: 'Advantages',
        singular: 'Advantage',
      },
      required: true,
      name: 'list',
      type: 'array',
    },
  ],
  imageURL: '/admin-static/partner-program/why-partner.jpg',
  interfaceName: 'WhyPartnerFields',
  labels: {
    plural: 'Why Partner block',
    singular: 'Why Partner block',
  },
  slug: 'why-partner-block',
};
