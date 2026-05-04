import type { Block } from 'payload';

export const ForgetQuizzesBlock: Block = {
  slug: 'forget-quizzes-block',
  labels: { singular: 'Forget quizzes block', plural: 'Forget quizzes blocks' },
  interfaceName: 'ForgetQuizzesBlockFields',
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
      type: 'textarea',
    },
    {
      fields: [
        {
          admin: { description: 'Controls visual style of the card.' },
          defaultValue: 'colored',
          label: 'Tone',
          name: 'tone',
          options: [
            { label: 'Colored', value: 'colored' },
            { label: 'Light', value: 'light' },
          ],
          required: true,
          type: 'select',
        },
        {
          label: 'Icon',
          name: 'icon',
          relationTo: 'media',
          localized: true,
          required: true,
          type: 'upload',
        },
        {
          label: 'Card title',
          localized: true,
          name: 'title',
          required: true,
          type: 'text',
        },
        {
          label: 'Card description',
          localized: true,
          name: 'description',
          required: true,
          type: 'textarea',
        },
      ],
      label: 'Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      name: 'cards',
      required: true,
      type: 'array',
    },
  ],
};

