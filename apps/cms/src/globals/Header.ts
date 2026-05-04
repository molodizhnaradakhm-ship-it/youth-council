import type { GlobalConfig } from 'payload';

import { link } from '@/fields/link';

import { revalidateHeader } from './hooks/revalidateHeader';

export const Header: GlobalConfig = {
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'languageMenu',
      label: 'Language menu',
      type: 'group',
      fields: [
        {
          name: 'items',
          label: 'Locales',
          type: 'array',
          labels: { singular: 'Locale', plural: 'Locales' },
          admin: {
            components: {
              RowLabel: '@/fields/CustomRowLabel#CustomRowLabel',
            },
          },
          fields: [
            {
              name: 'locale',
              label: 'Locale',
              type: 'select',
              required: true,
              options: [
                { label: 'Ukrainian (ua)', value: 'ua' },
                { label: 'English (en)', value: 'en' },
              ],
            },
            {
              name: 'label',
              label: 'Label (dropdown + header)',
              type: 'text',
              required: true,
            },
            {
              name: 'shortLabel',
              label: 'Short label (tabs)',
              type: 'text',
              defaultValue: '',
            },
            {
              name: 'flag',
              label: 'Flag (emoji)',
              type: 'text',
              defaultValue: '',
            },
          ],
        },
      ],
    },
    // Single header config: no appearance variants.
    {
      name: 'navEmphasis',
      type: 'select',
      label: 'Nav bar (hero)',
      defaultValue: 'bold',
      options: [
        { label: 'Default', value: 'default' },
        {
          label: 'Bold — taller bar, semibold links (GoGym-style)',
          value: 'bold',
        },
      ],
    },
    // Single header config: no variants group.
    {
      label: 'Logo',
      name: 'logo',
      relationTo: 'media',
      required: false,
      type: 'upload',
      admin: {
        hidden: false,
      },
    },
    {
      admin: {
        description: 'Optional. If empty — Logo is used.',
      },
      label: 'Mobile menu logo',
      name: 'menuLogo',
      relationTo: 'media',
      required: false,
      type: 'upload',
    },
    link({
      appearances: false,
      optional: true,
      overrides: {
        label: 'Связаться с нами',
        name: 'browserLink',
      },
    }),
    {
      label: 'Browser icon',
      name: 'browserIcon',
      relationTo: 'media',
      type: 'upload',
    },
    {
      admin: {
        components: {
          RowLabel: '@/fields/CustomRowLabel#CustomRowLabel',
        },
      },
      fields: [
        link({
          appearances: false,
          overrides: {
            label: 'Link',
          },
        }),
        {
          type: 'checkbox',
          label: 'Submenu',
          defaultValue: false,
          name: 'isSubmenu',
        },
        {
          fields: [
            {
              admin: {
                components: {
                  RowLabel: '@/fields/CustomRowLabel#CustomRowLabel',
                },
              },
              fields: [
                link({
                  appearances: false,
                  overrides: {
                    label: 'Submenu (Link)',
                  },
                }),
              ],
              type: 'array',
              name: 'submenu',
              required: true,
              label: 'Submenu',
              labels: {
                singular: 'Link',
                plural: 'Submenu',
              },
            },
            {
              type: 'checkbox',
              label: 'With all link',
              defaultValue: false,
              name: 'allLink',
            },
            link({
              appearances: false,
              overrides: {
                label: 'All link',
                admin: {
                  condition: (_data: any, siblingData: any) => siblingData.allLink,
                },
              },
            }),
          ],
          admin: {
            condition: (_data, siblingData) => siblingData.isSubmenu,
          },
          label: 'Submenu block',
          name: 'submenuGroup',
          type: 'group',
        },
      ],
      label: 'Navigation List',
      labels: {
        plural: 'Navigation List',
        singular: 'Menu Item',
      },
      name: 'navItems',
      required: true,
      type: 'array',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
  slug: 'header',
};
