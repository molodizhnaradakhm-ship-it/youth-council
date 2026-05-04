import type { FC } from 'react';

import type { Page } from '@monorepo/cms/src/payload-types';

export type UnifiedBlock = NonNullable<Page['homeBlocks']>[number];

export type BlockComponentProps<U extends { blockType: string }, K extends U['blockType']> = Extract<
  U,
  { blockType: K }
>;

export type BlockMapper<U extends { blockType: string }> = Partial<{
  [K in U['blockType']]: FC<BlockComponentProps<U, K>>;
}>;

