import type { Block } from 'payload';

export const QuotesBlock: Block = {
  fields: [
    {
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },

    {
      fields: [
        {
          label: 'Quote',
          name: 'quote',
          required: true,
          localized: true,
          type: 'textarea',
        },
        {
          fields: [
            {
              label: 'Author',
              name: 'author',
              required: true,
              localized: true,
              type: 'text',
            },
            {
              label: 'Position',
              name: 'position',
              required: true,
              localized: true,
              type: 'text',
            },
          ],
          type: 'row',
        },
        {
          label: 'Logo Company',
          name: 'logo',
          relationTo: 'media',
          localized: true,
          required: true,
          type: 'upload',
        },
      ],
      label: 'Quotes',
      labels: {
        plural: 'Quotes',
        singular: 'Quote',
      },
      required: true,
      name: 'quotesList',
      type: 'array',
    },
  ],
  imageURL: '/admin-static/home-quotes.jpg',
  interfaceName: 'QuotesBlockFields',
  labels: {
    plural: 'Quotes block',
    singular: 'Quotes block',
  },
  slug: 'quotes-block',
};
