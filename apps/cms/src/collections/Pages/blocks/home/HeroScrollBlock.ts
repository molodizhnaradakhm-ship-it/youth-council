import type { Block } from 'payload';

const isText = (_data: unknown, sibling: { layout?: string }) =>
  sibling?.layout === 'text' || sibling?.layout === undefined;

/** Fullscreen image-only slide (includes legacy DB value `imageCenter`). */
const isImageOnlyLayout = (_data: unknown, sibling: { layout?: string }) => {
  const l = sibling?.layout;
  return l === 'image' || l === 'imageCenter';
};

export const HeroScrollBlock: Block = {
  fields: [
    {
      admin: {
        description:
          'Any number of screens: on scroll down/up, slides switch with animation (2+ slides).',
      },
      fields: [
        {
          admin: {
            description:
              'Text: title (required), optional subtitle + frame phrase(s), optional side image. Image: fullscreen centered image only.',
          },
          defaultValue: 'text',
          label: 'Layout',
          name: 'layout',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Image', value: 'image' },
          ],
          required: true,
          type: 'select',
        },
        {
          admin: {
            condition: isText,
            description: 'Required for Text layout.',
          },
          label: 'Title',
          localized: true,
          name: 'title',
          type: 'textarea',
          validate: (value: unknown, { siblingData }: { siblingData: { layout?: string } }) => {
            if (siblingData?.layout === 'image') return true;
            if (!value || !String(value).trim()) {
              return 'Title is required for text layout';
            }
            return true;
          },
        },
        {
          admin: {
            condition: isText,
          },
          defaultValue: 'gradient',
          label: 'Title style',
          name: 'titleStyle',
          options: [
            { label: 'Gradient', value: 'gradient' },
            { label: 'Plain', value: 'plain' },
          ],
          type: 'select',
          validate: (value: unknown, { siblingData }: { siblingData: { layout?: string } }) => {
            if (siblingData?.layout === 'image') return true;
            if (value !== 'plain' && value !== 'gradient') {
              return 'Title style is required for text layout';
            }
            return true;
          },
        },
        {
          admin: {
            condition: isText,
            description: 'Optional.',
          },
          label: 'Subtitle',
          localized: true,
          name: 'accent',
          type: 'text',
        },
        {
          admin: {
            condition: isText,
            description:
              'Shown next to the subtitle as an outlined pill. Add one or more phrases — multiple phrases rotate automatically.',
          },
          fields: [
            {
              label: 'Phrase',
              localized: true,
              name: 'text',
              required: true,
              type: 'text',
            },
          ],
          labels: { plural: 'Phrases', singular: 'Phrase' },
          minRows: 0,
          name: 'accentFrameItems',
          required: false,
          type: 'array',
        },
        {
          admin: {
            description:
              'Optional for Text layout (shown as the right-side card). Required for Image layout (fullscreen).',
          },
          label: 'Image',
          name: 'image',
          relationTo: 'media',
          localized: true,
          type: 'upload',
          validate: (value: unknown, { siblingData }: { siblingData: { layout?: string } }) => {
            const l = siblingData?.layout;
            const imageSlide = l === 'image' || l === 'imageCenter';
            if (imageSlide && !value) {
              return 'Image is required for image layout';
            }
            return true;
          },
        },
        {
          admin: {
            condition: isImageOnlyLayout,
          },
          defaultValue: 'cover',
          label: 'Image fit',
          name: 'imageFit',
          options: [
            { label: 'Cover (crop)', value: 'cover' },
            { label: 'Contain (fit inside)', value: 'contain' },
          ],
          required: true,
          type: 'select',
        },
      ],
      label: 'Slides',
      labels: {
        plural: 'Slides',
        singular: 'Slide',
      },
      maxRows: 12,
      minRows: 1,
      name: 'slides',
      required: true,
      type: 'array',
    },
  ],
  imageURL: '/admin-static/home-intro.jpg',
  interfaceName: 'HeroScrollBlockFields',
  labels: {
    plural: 'Hero scroll',
    singular: 'Hero scroll',
  },
  slug: 'hero-scroll-block',
};
