import type { Block } from 'payload';

import { defaultLexical } from '@/fields/defaultLexical';
import { link } from '@/fields/link';

function plainTextToLexical(value: unknown) {
  if (typeof value !== 'string') return value;

  const normalized = value.replace(/\r\n/g, '\n').trim();
  if (!normalized) return null;

  const paragraphs = normalized
    .split(/\n\s*\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => ({
      type: 'paragraph',
      children: [{ type: 'text', text: chunk }],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
      textFormat: 0,
      textStyle: '',
    }));

  return {
    root: {
      type: 'root',
      children: paragraphs,
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  };
}

export const Hero2Block: Block = {
  slug: 'hero-2-block',
  labels: { singular: 'Hero 2', plural: 'Hero 2' },
  interfaceName: 'Hero2BlockFields',
  fields: [
    {
      admin: { description: 'Swap left/right blocks on desktop.' },
      defaultValue: 'textLeft',
      label: 'Layout',
      name: 'layout',
      options: [
        { label: 'Text left, image right', value: 'textLeft' },
        { label: 'Image left, text right', value: 'textRight' },
      ],
      required: true,
      type: 'select',
    },
    {
      label: 'Text block',
      name: 'text',
      type: 'group',
      fields: [
        {
          label: 'Title',
          localized: true,
          name: 'title',
          required: true,
          type: 'textarea',
        },
        {
          label: 'Description',
          localized: true,
          name: 'description',
          required: false,
          type: 'richText',
          editor: defaultLexical,
          hooks: {
            afterRead: [
              ({ value }) => {
                return plainTextToLexical(value);
              },
            ],
            beforeValidate: [
              ({ value }) => {
                return plainTextToLexical(value);
              },
            ],
          },
        },
        {
          label: 'Buttons title',
          localized: true,
          name: 'buttonsTitle',
          required: false,
          type: 'text',
        },
        {
          label: 'Buttons',
          labels: { singular: 'Button', plural: 'Buttons' },
          name: 'buttons',
          type: 'array',
          minRows: 0,
          fields: [
            {
              label: 'Label',
              localized: true,
              name: 'label',
              required: true,
              type: 'text',
            },
            link({
              appearances: false,
              disableLabel: true,
            }),
            {
              label: 'Variant',
              name: 'variant',
              type: 'select',
              required: true,
              defaultValue: 'black',
              options: [
                { label: 'Black', value: 'black' },
                { label: 'White', value: 'white' },
              ],
            },
            {
              admin: { description: 'Optional icon shown inside the button.' },
              label: 'Icon',
              name: 'icon',
              relationTo: 'media',
              localized: true,
              required: false,
              type: 'upload',
            },
          ],
        },
        {
          label: 'Reviews (optional)',
          name: 'reviews',
          type: 'group',
          fields: [
            {
              defaultValue: true,
              label: 'Enabled',
              name: 'enabled',
              type: 'checkbox',
            },
            {
              admin: { condition: (_: any, s: any) => Boolean(s?.enabled) },
              label: 'Average rating',
              name: 'averageRating',
              type: 'number',
              min: 0,
              max: 5,
              step: 0.5,
              required: false,
            },
            {
              admin: { condition: (_: any, s: any) => Boolean(s?.enabled) },
              label: 'Reviews label',
              localized: true,
              name: 'label',
              type: 'text',
              required: false,
            },
            {
              admin: {
                condition: (_: any, s: any) => Boolean(s?.enabled),
                description: 'Optional avatars shown as small circles.',
              },
              fields: [
                {
                  label: 'Avatar',
                  name: 'image',
                  relationTo: 'media',
                  localized: true,
                  required: true,
                  type: 'upload',
                },
              ],
              labels: { singular: 'Avatar', plural: 'Avatars' },
              minRows: 0,
              name: 'avatars',
              required: false,
              type: 'array',
            },
          ],
        },
      ],
    },
    {
      label: 'Image block',
      name: 'image',
      type: 'group',
      fields: [
        {
          label: 'Image',
          name: 'media',
          relationTo: 'media',
          localized: true,
          required: true,
          type: 'upload',
        },
        {
          label: 'Layout',
          name: 'layout',
          type: 'group',
          fields: [
            { label: 'Max width (px)', name: 'maxWidthPx', type: 'number', required: false },
            { label: 'Max height (px)', name: 'maxHeightPx', type: 'number', required: false },
            {
              label: 'Object fit',
              name: 'objectFit',
              type: 'select',
              required: true,
              defaultValue: 'contain',
              options: [
                { label: 'Contain', value: 'contain' },
                { label: 'Cover', value: 'cover' },
              ],
            },
            {
              label: 'Object position',
              name: 'objectPosition',
              type: 'select',
              required: true,
              defaultValue: 'center',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top left', value: 'top left' },
                { label: 'Top right', value: 'top right' },
                { label: 'Bottom left', value: 'bottom left' },
                { label: 'Bottom right', value: 'bottom right' },
              ],
            },
            { label: 'Offset X (px)', name: 'offsetXPx', type: 'number', required: false, defaultValue: 0 },
            { label: 'Offset Y (px)', name: 'offsetYPx', type: 'number', required: false, defaultValue: 0 },
            { label: 'Offset X (%)', name: 'offsetXPercent', type: 'number', required: false, defaultValue: 0 },
            { label: 'Offset Y (%)', name: 'offsetYPercent', type: 'number', required: false, defaultValue: 0 },
          ],
        },
      ],
    },
  ],
};

