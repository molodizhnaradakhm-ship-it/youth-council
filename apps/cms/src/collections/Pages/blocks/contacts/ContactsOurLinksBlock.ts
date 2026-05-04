import type { Block } from 'payload';

export const ContactsOurLinksBlock: Block = {
  fields: [
    {
      admin: {
        description:
          'Cards shown in the “Our links” section. This is page-specific (not the header/footer icons).',
      },
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
          label: 'Title',
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          label: 'Description',
          localized: true,
          name: 'description',
          required: true,
          type: 'textarea',
        },
        {
          label: 'Link',
          name: 'link',
          required: true,
          type: 'text',
        },
      ],
      label: 'Cards',
      labels: {
        plural: 'Cards',
        singular: 'Card',
      },
      minRows: 1,
      name: 'cards',
      required: true,
      type: 'array',
    },
  ],
  interfaceName: 'ContactsOurLinksBlockFields',
  labels: {
    plural: 'Contacts — Our links',
    singular: 'Contacts — Our links',
  },
  slug: 'contacts-our-links-block',
};

