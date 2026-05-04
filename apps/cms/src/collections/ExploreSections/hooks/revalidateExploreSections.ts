import { revalidateTag } from 'next/cache';
import type { CollectionAfterChangeHook } from 'payload';

export const revalidateExploreSections: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info(`Revalidating explore-sections: ${doc.id}`);
  revalidateTag('collection_explore_pages');
};
