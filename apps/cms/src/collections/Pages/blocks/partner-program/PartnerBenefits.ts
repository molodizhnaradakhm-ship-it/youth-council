import type { Block } from 'payload';

export const PartnerBenefitsBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
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
          type: 'textarea',
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
  imageURL: '/admin-static/partner-program/partner-benefits.jpg',
  interfaceName: 'PartnerBenefitsFields',
  labels: {
    plural: 'Partner Benefits block',
    singular: 'Partner Benefits block',
  },
  slug: 'partner-benefits-block',
};
