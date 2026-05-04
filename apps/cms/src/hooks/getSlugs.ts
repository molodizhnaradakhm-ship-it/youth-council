import type { BeforeReadHook } from 'node_modules/payload/dist/globals/config/types';
import type { CollectionBeforeReadHook } from 'payload';

export const slugBeforeRead: BeforeReadHook = ({ doc }) => {
  return {
    ...doc,
    slugs: doc.slug,
  };
};

export const slugBeforeReadCollection: CollectionBeforeReadHook = ({ doc }) => {
  return {
    ...doc,
    slugs: doc.slug,
  };
};
