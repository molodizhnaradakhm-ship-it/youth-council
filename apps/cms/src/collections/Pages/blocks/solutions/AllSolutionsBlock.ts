import type { Block } from 'payload';

import { manualField } from '@/fields/manual';

export const AllSolutionsBlock: Block = {
  fields: [
    {
      label: 'Block title',
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'description',
      required: true,
      type: 'textarea',
    },
    manualField("The solution list is edited in the section 'Content/Solutions'"),
  ],
  imageURL: '/admin-static/solutions/all-solutions.jpg',
  interfaceName: 'AllSolutionsBlockFields',
  labels: {
    plural: 'Solutions block',
    singular: 'Solutions block',
  },
  slug: 'all-solutions-block',
};
