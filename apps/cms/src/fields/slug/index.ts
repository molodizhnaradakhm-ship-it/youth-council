import type { CheckboxField, TextField } from 'payload';

import { formatSlugHook } from './formatSlug';

type Overrides = {
  checkboxOverrides?: Partial<CheckboxField>;
  slugOverrides?: Partial<TextField>;
};

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField];

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const { checkboxOverrides, slugOverrides } = overrides;

  const checkBoxField: CheckboxField = {
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    defaultValue: true,
    name: 'slugLock',
    type: 'checkbox',
    ...checkboxOverrides,
  };

  // TypeScript error occurs here because `Partial<TextField>` is not assignable to `TextField`.
  // @ts-expect-error The `slugOverrides` type is intentionally `Partial<TextField>` to allow partial overrides.
  const slugField: TextField = {
    index: true,
    label: 'Slug',
    name: 'slug',
    type: 'text',
    localized: true,
    ...(slugOverrides || {}),
    admin: {
      position: 'sidebar',
      ...(slugOverrides?.admin || {}),
      components: {
        Field: {
          clientProps: {
            checkboxFieldPath: checkBoxField.name,
            fieldToUse,
          },
          path: '@/fields/slug/SlugComponent#SlugComponent',
        },
      },
    },
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
  };

  return [slugField, checkBoxField];
};
