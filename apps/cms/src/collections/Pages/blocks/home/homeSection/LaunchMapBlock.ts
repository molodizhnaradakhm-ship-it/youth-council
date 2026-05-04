import type { Block } from 'payload';

export const LaunchMapBlock: Block = {
  fields: [
    {
      admin: { description: 'Optional heading above the map.' },
      label: 'Section title',
      localized: true,
      name: 'sectionTitle',
      required: false,
      type: 'textarea',
    },
    {
      admin: {
        description:
          'Override default map SVG from /home/map-base.svg. Leave empty to use the bundled asset.',
      },
      label: 'Map image (optional)',
      name: 'mapImage',
      relationTo: 'media',
      localized: true,
      required: false,
      type: 'upload',
    },
    {
      fields: [
        {
          admin: { description: 'Horizontal position on the map (0–100).' },
          label: 'X %',
          max: 100,
          min: 0,
          name: 'xPercent',
          required: true,
          type: 'number',
        },
        {
          admin: { description: 'Vertical position on the map (0–100).' },
          label: 'Y %',
          max: 100,
          min: 0,
          name: 'yPercent',
          required: true,
          type: 'number',
        },
        {
          label: 'Country / region name',
          localized: true,
          name: 'countryName',
          required: true,
          type: 'text',
        },
        {
          admin: { description: 'e.g. “Launch date”' },
          label: 'Launch date label',
          localized: true,
          name: 'launchDateLabel',
          required: true,
          type: 'text',
        },
        {
          admin: { description: 'e.g. “February 2026”' },
          label: 'Launch date value',
          localized: true,
          name: 'launchDateValue',
          required: true,
          type: 'text',
        },
        {
          label: 'Flag',
          name: 'flag',
          relationTo: 'media',
          localized: true,
          required: true,
          type: 'upload',
        },
      ],
      label: 'Map pointers',
      labels: { plural: 'Pointers', singular: 'Pointer' },
      minRows: 1,
      name: 'pointers',
      required: true,
      type: 'array',
    },
  ],
  interfaceName: 'LaunchMapBlockFields',
  labels: { plural: 'Launch map', singular: 'Launch map' },
  slug: 'launch-map-block',
};

