import type { Field, FieldHook } from 'payload';

const dateBeforeChangeHook: FieldHook = ({ value }) => {
  if (!value) {
    return new Date();
  }
  return value;
};

export const dateField = (): Field => ({
  name: 'publishedOn',
  type: 'date',
  label: 'Publication date',
  admin: {
    position: 'sidebar',
    description: 'Automatically generated or edit manually',
    date: {
      displayFormat: 'dd/MM/yyyy p',
      pickerAppearance: 'dayAndTime',
      timeFormat: 'p',
    },
  },
  hooks: {
    beforeChange: [dateBeforeChangeHook],
  },
});
