import type { Block } from 'payload';

export const ContactsPaymentBlock: Block = {
  fields: [
    {
      admin: {
        description: 'Optional. If empty, the default translation is used.',
      },
      label: 'Heading override',
      localized: true,
      name: 'heading',
      required: false,
      type: 'text',
    },
    {
      admin: {
        description: 'Optional. If empty, the default translation is used.',
      },
      label: 'Local column title override',
      localized: true,
      name: 'localTitle',
      required: false,
      type: 'text',
    },
    {
      admin: {
        description: 'Optional. If empty, the default translation is used.',
      },
      label: 'International column title override',
      localized: true,
      name: 'intlTitle',
      required: false,
      type: 'text',
    },
    {
      admin: {
        description:
          'Payment cards to show on the Contacts page. If empty, the site falls back to Globals/Contacts (local + international columns).',
      },
      fields: [
        {
          label: 'Card badge text',
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          admin: {
            description: 'Optional icon shown inside the badge (left).',
          },
          label: 'Badge icon',
          name: 'icon',
          relationTo: 'media',
          localized: true,
          required: false,
          type: 'upload',
        },
        {
          defaultValue: 'half',
          label: 'Card width',
          name: 'span',
          options: [
            { label: 'Half (default)', value: 'half' },
            { label: 'Full (spans 2 columns)', value: 'full' },
          ],
          required: true,
          type: 'select',
        },
        {
          defaultValue: 'kv',
          label: 'Content type',
          name: 'contentType',
          options: [
            { label: 'Key / value list (recommended)', value: 'kv' },
            { label: 'Rich text', value: 'richText' },
          ],
          required: true,
          type: 'select',
        },
        {
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'kv',
            description:
              'Key/value rows rendered as a grid (supports the “Payment Information” design).',
          },
          fields: [
            {
              label: 'Key',
              localized: true,
              name: 'key',
              required: true,
              type: 'text',
            },
            {
              label: 'Value',
              localized: true,
              name: 'value',
              required: true,
              type: 'text',
            },
          ],
          label: 'Rows',
          labels: { plural: 'Rows', singular: 'Row' },
          minRows: 1,
          name: 'rows',
          required: false,
          type: 'array',
        },
        {
          label: 'Card body',
          localized: true,
          name: 'body',
          required: false,
          type: 'richText',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'richText',
          },
        },
      ],
      label: 'Cards',
      labels: {
        plural: 'Cards',
        singular: 'Card',
      },
      minRows: 1,
      name: 'cards',
      required: false,
      type: 'array',
    },
  ],
  interfaceName: 'ContactsPaymentBlockFields',
  labels: {
    plural: 'Contacts — Payment info',
    singular: 'Contacts — Payment info',
  },
  slug: 'contacts-payment-block',
};

