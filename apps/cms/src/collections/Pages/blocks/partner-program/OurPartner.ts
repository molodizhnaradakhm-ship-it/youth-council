import type { Block } from 'payload';

export const OurPartnerBlock: Block = {
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
      label: 'Logo',
      name: 'logo',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      fields: [
        {
          label: 'Icon',
          name: 'icon',
          relationTo: 'media',
          localized: true,
          required: true,
          type: 'upload',
        },
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
  imageURL: '/admin-static/partner-program/our-partner.jpg',
  interfaceName: 'OurPartnerFields',
  labels: {
    plural: 'Our Partner block',
    singular: 'Our Partner block',
  },
  slug: 'our-partner-block',
};
