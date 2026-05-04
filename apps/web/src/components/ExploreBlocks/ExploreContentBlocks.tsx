import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import type { ExplorePage } from '@monorepo/cms/src/payload-types';

type Props = {
  blocks: ExplorePage['blocks'] | null | undefined;
};

/** Renders the Explore page “Content blocks” field (includes optional Tabs block). */
export const ExploreContentBlocks = ({ blocks }: Props) => {
  if (!blocks?.length) {
    return null;
  }

  return <RenderBlocks blocks={blocks as never} mapper={unifiedBlocksMapper} />;
};
