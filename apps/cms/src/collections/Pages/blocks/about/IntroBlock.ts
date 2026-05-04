import type { Block } from 'payload';

export const IntroAboutBlock: Block = {
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
  imageURL: '/admin-static/about/intro.jpg',
  interfaceName: 'IntroAboutBlockFields',
  labels: {
    plural: 'Intro block',
    singular: 'Intro block',
  },
  slug: 'intro-about-block',
};
