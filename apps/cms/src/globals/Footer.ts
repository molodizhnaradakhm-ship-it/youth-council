import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';

import { revalidateFooter } from './hooks/revalidateFooter';

export const Footer: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      label: 'Logo',
      name: 'logo',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
    {
      admin: {
        description: 'Optional short text shown under the logo (footer description).',
      },
      label: 'Description',
      localized: true,
      name: 'description',
      required: false,
      type: 'textarea',
    },
    {
      admin: {
        description:
          'Optional. Icons under the logo. If empty, the website falls back to Contacts → Social Media Links (if present there).',
      },
      fields: [
        {
          fields: [
            {
              label: 'Icon',
              name: 'icon',
              relationTo: 'media',
              required: false,
              type: 'upload',
            },
            {
              label: 'Link (URL)',
              name: 'link',
              required: false,
              type: 'text',
            },
          ],
          type: 'row',
        },
      ],
      label: 'Social links',
      labels: {
        plural: 'Social links',
        singular: 'Social link',
      },
      minRows: 0,
      name: 'socialLinks',
      required: false,
      type: 'array',
    },
    {
      admin: {
        components: {
          RowLabel: '@/fields/CustomRowLabel#CustomRowLabel',
        },
        description: 'Footer navigation links (flat list).',
      },
      fields: [
        link({
          appearances: false,
          overrides: {
            label: 'Link',
          },
        }),
      ],
      label: 'Navigation List',
      labels: {
        plural: 'Navigation List',
        singular: 'Menu Item',
      },
      name: 'navItems',
      type: 'array',
    },
    {
      fields: [
        link({
          appearances: false,
          overrides: {
            label: 'Link',
          },
        }),
      ],
      label: 'Privacy Policy, Terms, etc.',
      labels: {
        plural: 'Privacy Policy Links',
        singular: 'Privacy Policy Link',
      },
      required: true,
      name: 'listPrivacyLinks',
      type: 'array',
    },
    {
      admin: {
        description:
          'Full copyright line (e.g. © 2026 Youth Council / Молодіжна рада). Leave empty to use the site translation per locale.',
      },
      defaultValue: '',
      label: 'Copyright line',
      localized: true,
      name: 'copyrightText',
      required: false,
      type: 'text',
    },
    {
      fields: [
        {
          defaultValue: false,
          label: 'Show “Developed by” block',
          name: 'enabled',
          type: 'checkbox',
        },
        {
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.enabled),
          },
          label: 'Icon',
          name: 'icon',
          relationTo: 'media',
          required: false,
          type: 'upload',
        },
        {
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.enabled),
          },
          defaultValue: 'Developed by',
          label: 'Prefix',
          localized: true,
          name: 'prefix',
          type: 'text',
        },
        {
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.enabled),
          },
          label: 'Brand name',
          localized: true,
          name: 'brandName',
          type: 'text',
        },
        {
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.enabled),
          },
          label: 'Brand link (URL)',
          name: 'brandUrl',
          type: 'text',
        },
        {
          admin: {
            condition: (_data, siblingData) => Boolean(siblingData?.enabled),
            description: 'Accent color for brand name (e.g. #14b8a6)',
          },
          defaultValue: '#14b8a6',
          label: 'Brand accent color',
          name: 'brandColor',
          type: 'text',
        },
      ],
      label: 'Developed by',
      name: 'developedBy',
      type: 'group',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
  slug: 'footer',
};
