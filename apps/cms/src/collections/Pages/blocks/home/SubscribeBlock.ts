import type { Block } from 'payload';

import { link } from '@/fields/link';

export const SubscribeBlock: Block = {
  slug: 'subscribe-block',
  labels: { singular: 'Subscribe block', plural: 'Subscribe blocks' },
  interfaceName: 'SubscribeBlockFields',
  fields: [
    {
      label: 'Image',
      name: 'image',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      label: 'Right image layout',
      name: 'imageLayout',
      type: 'group',
      required: false,
      fields: [
        {
          label: 'Max width (px)',
          name: 'imageMaxWidthPx',
          type: 'number',
          required: false,
          admin: { description: 'Controls the image size on desktop.' },
        },
        {
          label: 'Max height (px)',
          name: 'imageMaxHeightPx',
          type: 'number',
          required: false,
        },
        {
          label: 'Offset X (px)',
          name: 'imageOffsetXPx',
          type: 'number',
          required: false,
        },
        {
          label: 'Offset X (%)',
          name: 'imageOffsetXPercent',
          type: 'number',
          required: false,
          min: -200,
          max: 200,
          defaultValue: 0,
        },
        {
          label: 'Offset Y (px)',
          name: 'imageOffsetYPx',
          type: 'number',
          required: false,
        },
        {
          label: 'Offset Y (%)',
          name: 'imageOffsetYPercent',
          type: 'number',
          required: false,
          min: -200,
          max: 200,
          defaultValue: 0,
        },
        {
          label: 'Object fit',
          name: 'imageObjectFit',
          type: 'select',
          required: false,
          defaultValue: 'contain',
          options: [
            { label: 'Contain', value: 'contain' },
            { label: 'Cover', value: 'cover' },
          ],
        },
        {
          label: 'Object position',
          name: 'imageObjectPosition',
          type: 'select',
          required: false,
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
      ],
    },
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
      type: 'textarea',
    },
    {
      fields: [
        link({
          appearances: false,
          overrides: { label: 'Button link' },
        }),
        {
          admin: {
            description: 'Optional icon shown inside the button (e.g. Telegram).',
          },
          label: 'Button icon',
          name: 'icon',
          relationTo: 'media',
          localized: true,
          required: false,
          type: 'upload',
        },
      ],
      label: 'Button',
      name: 'button',
      required: true,
      type: 'group',
    },
    {
      label: 'Bonuses title',
      localized: true,
      name: 'bonusesTitle',
      required: false,
      type: 'text',
    },
    {
      fields: [
        {
          label: 'Text',
          localized: true,
          name: 'text',
          required: true,
          type: 'text',
        },
      ],
      label: 'Bonuses list',
      labels: { singular: 'Bonus', plural: 'Bonuses' },
      minRows: 1,
      name: 'bonuses',
      required: true,
      type: 'array',
    },
  ],
};

