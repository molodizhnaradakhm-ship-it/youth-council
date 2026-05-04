import { revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook } from 'payload';

export const revalidateExplorePages: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating explore-pages: ${doc.id}`);
  revalidateTag('collection_explore_pages');
};
