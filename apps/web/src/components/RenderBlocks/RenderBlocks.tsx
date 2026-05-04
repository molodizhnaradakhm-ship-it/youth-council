import { ResponsiveBlocksSlot } from '@/components/RenderBlocks/ResponsiveBlocksRenderer.client';

import type { BlockMapper, UnifiedBlock } from './blockTypes';

type Props = {
  blocks: UnifiedBlock[];
  mapper: BlockMapper<UnifiedBlock>;
};

function sanitizeBlocks(raw: unknown): UnifiedBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((b): b is UnifiedBlock => {
    const t = (b as { blockType?: unknown } | null)?.blockType;
    return typeof t === 'string' && t.length > 0;
  });
}

export const RenderBlocks = ({ blocks, mapper }: Props) => {
  return (
    <>
      {blocks.map((block, index) => {
        if (typeof block.blockType === 'string' && block.blockType.startsWith('responsive-blocks')) {
          const mobileBlocks = sanitizeBlocks(block.mobileBlocks);
          const desktopBlocks = sanitizeBlocks(block.desktopBlocks);

          const mobileList = mobileBlocks.length ? mobileBlocks : desktopBlocks;
          const desktopList = desktopBlocks.length ? desktopBlocks : mobileBlocks;

          if (!mobileList.length && !desktopList.length) {
            return null;
          }

          return (
            <ResponsiveBlocksSlot
              key={block.id ?? `responsive-${index}`}
              desktop={<RenderBlocks blocks={desktopList} mapper={mapper} />}
              mobile={<RenderBlocks blocks={mobileList} mapper={mapper} />}
            />
          );
        }

        const BlockComponent = mapper[block.blockType];

        if (!BlockComponent) return null;

        return <BlockComponent key={block.id ?? `block-${index}`} {...block} />;
      })}
    </>
  );
};
