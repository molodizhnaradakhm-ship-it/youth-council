import type { Metadata } from 'next';

import type { Page } from '../payload-types';
import { getServerSideURL } from './getURL';
import { mergeOpenGraph } from './mergeOpenGraph';

export const generateMeta = async (args: { doc: Partial<Page> }): Promise<Metadata> => {
  const { doc } = (await args) || {};

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${getServerSideURL()}`;

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template';

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  };
};
