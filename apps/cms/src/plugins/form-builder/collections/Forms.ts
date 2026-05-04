import type { Block, CollectionConfig } from 'payload';

import { userOnlyField } from '@/access/userOnly';

const TextField: Block = {
  fields: [
    {
      admin: {
        placeholder: 'name',
      },
      label: 'Field name',
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Name',
      },
      label: 'Field label',
      localized: true,
      name: 'label',
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Placeholder',
      },
      label: 'Placeholder',
      localized: true,
      name: 'placeholder',
      type: 'text',
    },
    {
      defaultValue: false,
      label: 'Required field',
      name: 'isRequired',
      required: true,
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Text field',
    singular: 'Text',
  },
  slug: 'text',
};

const EmailField: Block = {
  fields: [
    {
      defaultValue: 'email',
      label: 'Field name',
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Name',
      },
      defaultValue: 'Email',
      label: 'Field label',
      localized: true,
      name: 'label',
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Placeholder',
      },
      label: 'Placeholder',
      localized: true,
      name: 'placeholder',
      type: 'text',
    },
    {
      defaultValue: false,
      label: 'Required field',
      name: 'isRequired',
      required: true,
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Email fields',
    singular: 'Email',
  },
  slug: 'email',
};

const PhoneNumberField: Block = {
  fields: [
    {
      defaultValue: 'phone',
      label: 'Field name',
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Phone',
      },
      label: 'Field label',
      localized: true,
      required: true,
      name: 'label',
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Placeholder',
      },
      label: 'Placeholder',
      localized: true,
      name: 'placeholder',
      type: 'text',
    },
    {
      defaultValue: true,
      label: 'Required field',
      name: 'isRequired',
      required: true,
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Phone fields',
    singular: 'Phone number',
  },
  slug: 'phone-number',
};

const MessageField: Block = {
  fields: [
    {
      admin: {
        placeholder: 'message',
      },
      defaultValue: 'message',
      label: 'Field name',
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Message',
      },
      label: 'Field label',
      localized: true,
      name: 'label',
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Placeholder',
      },
      label: 'Placeholder',
      localized: true,
      name: 'placeholder',
      type: 'text',
    },
    {
      defaultValue: false,
      label: 'Required field',
      name: 'isRequired',
      required: true,
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Messages fields',
    singular: 'Message',
  },
  slug: 'message',
};

const CheckboxGroupField: Block = {
  fields: [
    {
      admin: {
        placeholder: 'checkbox',
      },
      label: 'Field name',
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      admin: {
        placeholder: 'Select',
      },
      label: 'Field label',
      localized: true,
      name: 'label',
      type: 'text',
    },
    {
      fields: [
        {
          label: 'Option name',
          localized: true,
          name: 'name',
          required: true,
          type: 'text',
        },
      ],
      labels: {
        plural: 'Select list',
        singular: 'option',
      },
      name: 'selectList',
      required: true,
      type: 'array',
    },
    {
      defaultValue: false,
      label: 'Required field',
      name: 'isRequired',
      required: true,
      type: 'checkbox',
    },
  ],
  labels: {
    plural: 'Checkbox group fields',
    singular: 'Checkbox group',
  },
  slug: 'checkboxGroup',
};

export const Forms: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      label: 'Form title',
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      name: 'submissionKind',
      label: 'Submission destination',
      type: 'select',
      defaultValue: 'none',
      admin: {
        position: 'sidebar',
        description:
          'Where should submissions be duplicated to (in addition to Form submissions)?',
      },
      options: [
        { label: 'None (Form submissions only)', value: 'none' },
        { label: 'Contact submissions', value: 'contact' },
        { label: 'Newsletter subscriptions', value: 'newsletter' },
      ],
    },
    {
      blocks: [TextField, EmailField, PhoneNumberField, MessageField, CheckboxGroupField],
      label: 'Form fields',
      labels: {
        plural: 'Fields',
        singular: 'Field',
      },
      name: 'fields',
      required: true,
      type: 'blocks',
    },
    {
      admin: {
        placeholder: 'Send',
      },
      label: 'Submit button name',
      localized: true,
      name: 'submitButtonLabel',
      required: true,
      type: 'text',
    },
    {
      label: 'Success message',
      name: 'successMessage',
      required: true,
      localized: true,
      type: 'text',
    },
    {
      admin: {
        description:
          'e.g. newsletter: reject if this email already submitted this form. Configure duplicate messages below.',
      },
      defaultValue: false,
      label: 'Prevent duplicate email',
      name: 'preventDuplicateEmail',
      type: 'checkbox',
    },
    {
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.preventDuplicateEmail),
      },
      label: 'Duplicate email title (toast)',
      localized: true,
      name: 'duplicateEmailTitle',
      type: 'text',
    },
    {
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.preventDuplicateEmail),
      },
      label: 'Duplicate email message',
      localized: true,
      name: 'duplicateEmailMessage',
      type: 'textarea',
    },
    {
      admin: {
        description: 'Use for Threatscape report form',
      },
      label: 'Download Report',
      name: 'downloadReport',
      relationTo: 'media',
      type: 'upload',
    },
    {
      access: { read: userOnlyField },
      admin: {
        description: {
          en: "Send custom emails when the form submits. Use comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field's name with double curly brackets, i.e. {{firstName}}.",
          ua: "Відправляйте індивідуальні листи після відправки форми. Використовуйте розділені комами списки для відправки одного і того ж листа кільком отримувачам. Для посилання на значення з цієї форми оберніть ім'я цього поля подвійними фігурними дужками, наприклад, {{firstName}}.",
        },
      },
      fields: [
        {
          fields: [
            {
              admin: {
                description:
                  'For multiple values, separate them with a comma, for example: emailToSend1@gmail.com,emailToSend2@gmail.com',
                placeholder: '"Email Sender" <sender@email.com>',
                width: '100%',
              },
              label: 'Email To',
              name: 'emailTo',
              required: true,
              type: 'text',
            },
            {
              admin: {
                width: '50%',
              },
              label: 'CC',
              name: 'cc',
              type: 'text',
            },
            {
              admin: {
                width: '50%',
              },
              label: 'BCC',
              name: 'bcc',
              type: 'text',
            },
          ],
          type: 'row',
        },
        {
          fields: [
            {
              admin: {
                placeholder: '"Reply To" <reply-to@email.com>',
                width: '50%',
              },
              label: 'Reply To',
              name: 'replyTo',
              type: 'text',
            },
            {
              admin: {
                placeholder: '"Email From" <email-from@email.com>',
                width: '50%',
              },
              label: 'Email From',
              name: 'emailFrom',
              required: true,
              type: 'text',
            },
          ],
          type: 'row',
        },
        {
          defaultValue: 'New message received',
          label: { en: 'Subject', ua: 'Тема' },
          name: 'subject',
          required: true,
          type: 'text',
        },
        {
          label: 'Sending message',
          name: 'message',
          required: true,
          type: 'richText',
        },
      ],
      label: 'Email addresses for sending',
      name: 'emails',
      type: 'array',
    },
    {
      access: {
        read: userOnlyField,
      },
      fields: [
        {
          label: 'Chat ID',
          name: 'chatId',
          required: true,
          type: 'text',
        },
        {
          label: 'Sending message',
          name: 'message',
          required: true,
          type: 'textarea',
        },
      ],
      label: 'Telegram sending',
      name: 'telegramChatIds',
      type: 'array',
    },
  ],
  labels: {
    plural: 'Forms',
    singular: 'Form',
  },
  slug: 'forms',
};
