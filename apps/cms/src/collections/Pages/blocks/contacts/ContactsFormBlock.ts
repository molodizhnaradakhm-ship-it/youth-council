import type { Block } from 'payload';

export const ContactsFormBlock: Block = {
  fields: [
    {
      admin: {
        description:
          'Select a Payload Form Builder form for the current admin locale.',
      },
      label: 'Form',
      localized: true,
      name: 'form',
      relationTo: 'forms',
      required: true,
      type: 'relationship',
    },
    {
      admin: {
        description:
          'Optional. If empty, only the selected form is shown.',
      },
      label: 'Form heading override',
      localized: true,
      name: 'formHeading',
      required: false,
      type: 'text',
    },
    {
      label: 'Form subheading override',
      localized: true,
      name: 'formSubheading',
      required: false,
      type: 'textarea',
    },
    {
      admin: {
        description:
          'Map your Form Builder field "name" values to the Contacts layout slots. This lets you reuse different forms across the site, but keep the Contacts page layout consistent.',
      },
      fields: [
        {
          admin: {
            description: 'Form field name for “Name” (left, first row).',
          },
          label: 'Name field',
          localized: true,
          name: 'nameField',
          required: false,
          type: 'text',
        },
        {
          admin: {
            description: 'Form field name for “Surname” (right, first row).',
          },
          label: 'Surname field',
          localized: true,
          name: 'surnameField',
          required: false,
          type: 'text',
        },
        {
          admin: {
            description: 'Form field name for “Phone” (left, second row).',
          },
          label: 'Phone field',
          localized: true,
          name: 'phoneField',
          required: false,
          type: 'text',
        },
        {
          admin: {
            description: 'Form field name for “Email” (full width).',
          },
          label: 'Email field',
          localized: true,
          name: 'emailField',
          required: false,
          type: 'text',
        },
        {
          admin: {
            description: 'Form field name for “Message” (full width textarea).',
          },
          label: 'Message field',
          localized: true,
          name: 'messageField',
          required: false,
          type: 'text',
        },
        {
          admin: {
            description: 'Form field name for the “Terms” checkbox group (optional).',
          },
          label: 'Terms field',
          localized: true,
          name: 'termsField',
          required: false,
          type: 'text',
        },
      ],
      label: 'Contacts layout mapping',
      name: 'layout',
      required: false,
      type: 'group',
    },
    {
      admin: {
        description:
          'Optional Terms checkbox shown under the form on the Contacts page. Use this if your selected form does not include a terms field.',
      },
      fields: [
        {
          defaultValue: true,
          label: 'Show terms checkbox',
          name: 'enabled',
          required: true,
          type: 'checkbox',
        },
        {
          admin: {
            description: 'Submission field name saved into Form submissions (e.g. acceptTerms).',
          },
          defaultValue: 'acceptTerms',
          label: 'Field name',
          name: 'fieldName',
          required: true,
          type: 'text',
        },
        {
          label: 'Label text',
          localized: true,
          name: 'text',
          required: true,
          type: 'text',
        },
        {
          admin: {
            description:
              'URL для поточної мови: вставте шлях або повне посилання (наприклад /kk/privacy-policy або https://…). У кожній локалі може бути свій URL.',
          },
          label: 'Link URL',
          localized: true,
          name: 'href',
          required: false,
          type: 'text',
        },
        {
          label: 'Link text',
          localized: true,
          name: 'linkText',
          required: false,
          type: 'text',
        },
      ],
      label: 'Terms checkbox',
      name: 'terms',
      required: false,
      type: 'group',
    },
  ],
  interfaceName: 'ContactsFormBlockFields',
  labels: {
    plural: 'Contacts — Form',
    singular: 'Contacts — Form',
  },
  slug: 'contacts-form-block',
};

