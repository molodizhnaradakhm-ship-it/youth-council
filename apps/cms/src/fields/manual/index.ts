import type { DefaultValue, TextField } from 'payload';

export const manualField = (text: DefaultValue): TextField => ({
  admin: {
    readOnly: true,
  },
  defaultValue: text,
  name: 'manual',
  label: 'Manual',
  type: 'text',
});
