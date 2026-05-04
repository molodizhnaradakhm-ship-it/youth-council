import type { Block } from 'payload';

export const VideoBlock: Block = {
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      name: 'videoCover',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      name: 'bgImage',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
    {
      label: 'Video (.mp4)',
      name: 'video',
      relationTo: 'media',
      localized: true,
      required: true,
      type: 'upload',
    },
  ],
  imageURL: '/admin-static/about/video.jpg',
  interfaceName: 'VideoBlockFields',
  labels: {
    plural: 'Video block',
    singular: 'Video block',
  },
  slug: 'video-about-block',
};
