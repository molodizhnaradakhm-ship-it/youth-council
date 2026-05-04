import type { ArrayField, Field } from 'payload';

import deepMerge from '@/utilites/deepMerge';

import type { LinkAppearances } from './link';
import { link } from './link';

type LinkGroupType = (options?: {
  appearances?: LinkAppearances[] | false;
  overrides?: Partial<ArrayField>;
}) => Field;

export const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    fields: [
      link({
        appearances,
      }),
    ],
    name: 'links',
    type: 'array',
  };

  return deepMerge(generatedLinkGroup, overrides);
};
