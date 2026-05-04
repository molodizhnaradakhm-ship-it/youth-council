import type { Block } from 'payload';

import { link } from '@/fields/link';

export const CommentsBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Centered section title (Arimo SemiBold, up to 96px on desktop).',
      },
      label: 'Title',
      localized: true,
      name: 'title',
      required: true,
      type: 'textarea',
    },
    {
      admin: {
        description: 'Optional short paragraph below the title.',
      },
      label: 'Description',
      localized: true,
      name: 'description',
      required: false,
      type: 'textarea',
    },
    {
      admin: { description: 'Average rating shown near the stars (e.g. 4.8).' },
      label: 'Average rating',
      name: 'averageRating',
      required: false,
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        description: 'Average rating 0..5 (step 0.5).',
        step: 0.5,
      },
    },
    {
      admin: { description: 'Label shown under the stars (e.g. "reviews").' },
      label: 'Reviews label',
      localized: true,
      name: 'reviewsLabel',
      required: false,
      type: 'text',
    },
    {
      admin: {
        description:
          'At least 1 row. Each row is rendered as a horizontal carousel on the website.',
      },
      fields: [
        {
          fields: [
            {
              admin: {
                description: 'Main review text shown inside the card.',
              },
              label: 'Comment title',
              localized: true,
              name: 'commentTitle',
              required: true,
              type: 'textarea',
            },
            {
              label: 'Full name',
              localized: true,
              name: 'fullName',
              required: true,
              type: 'text',
            },
            {
              admin: {
                description: 'Small line under the name (e.g. age, city).',
              },
              label: 'Subtitle',
              localized: true,
              name: 'subtitle',
              required: false,
              type: 'text',
            },
            {
              label: 'Avatar',
              name: 'avatar',
              relationTo: 'media',
              localized: true,
              required: true,
              type: 'upload',
            },
          ],
          label: 'Comments',
          labels: {
            plural: 'Comments',
            singular: 'Comment',
          },
          minRows: 1,
          name: 'comments',
          required: true,
          type: 'array',
        },
      ],
      label: 'Animated stripes',
      labels: {
        plural: 'Stripes',
        singular: 'Stripe',
      },
      minRows: 1,
      name: 'stripes',
      required: true,
      type: 'array',
    },
  ],
  imageURL: '/admin-static/home-quotes.jpg',
  interfaceName: 'CommentsBlockFields',
  labels: {
    plural: 'Comments (marquee) block',
    singular: 'Comments (marquee) block',
  },
  slug: 'comments-block',
};
