import type { Block } from 'payload';

export const LaunchRegionsBlock: Block = {
  fields: [
    {
      label: 'Section title',
      localized: true,
      name: 'title',
      required: true,
      type: 'textarea',
    },
    {
      label: 'Featured region name',
      localized: true,
      name: 'featuredName',
      required: true,
      type: 'text',
    },
    {
      admin: { description: 'e.g. February 2026' },
      label: 'Launch date label',
      localized: true,
      name: 'launchDate',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description: 'Countries or regions, one line (use · between names).',
      },
      label: 'All regions line',
      localized: true,
      name: 'regionsLine',
      required: true,
      type: 'textarea',
    },
  ],
  interfaceName: 'LaunchRegionsBlockFields',
  labels: {
    plural: 'Launch regions block',
    singular: 'Launch regions block',
  },
  slug: 'launch-regions-block',
};
