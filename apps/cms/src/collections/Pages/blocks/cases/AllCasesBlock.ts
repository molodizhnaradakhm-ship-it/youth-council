import type { Block } from 'payload';

import { manualField } from '@/fields/manual';

export const AllCasesBlock: Block = {
  fields: [
    {
      label: 'Block title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    manualField("The cases list is edited in the section 'Content/Use Cases'"),
  ],
  imageURL: '/admin-static/cases/all-cases.jpg',
  interfaceName: 'AllCasesBlockFields',
  labels: {
    plural: 'Cases block',
    singular: 'Cases block',
  },
  slug: 'all-cases-block',
};
