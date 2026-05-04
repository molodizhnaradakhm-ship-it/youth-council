import type { Block } from 'payload';

export const ThreatVectorsSolutionsBlock: Block = {
  fields: [
    {
      name: 'logo',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
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
  ],
  imageURL: '/admin-static/solutions/threat-vectors.jpg',
  interfaceName: 'ThreatVectorsSolutionsFields',
  labels: {
    plural: 'Threat Vectors block',
    singular: 'Threat Vectors block',
  },
  slug: 'threat-vectors-block',
};
