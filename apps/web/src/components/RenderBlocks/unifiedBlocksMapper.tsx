import { HintBlock } from '@/components/HintBlock';
import { contactsBlocksMapper } from '@/views/Contacts/contactsBlocksMapper';
import { exploreBlocksMapper } from '@/views/Explore/exploreBlocksMapper';
import { homeBlocksMapper } from '@/views/Home/homeBlocksMapper';

import type { BlockMapper, UnifiedBlock } from './blockTypes';

/**
 * All blockTypes from CMS `unifiedPageBlocks` / `exploreContentBlocks` for Home, Explore,
 * Contacts, Privacy (information) and other pages that share the same block set.
 * `hint-block` is the same for all contexts (the parent already has Container, or `insideContainer` is used).
 */
export const unifiedBlocksMapper = {
  ...homeBlocksMapper,
  ...exploreBlocksMapper,
  ...contactsBlocksMapper,
  'hint-block': (props: Record<string, unknown>) => <HintBlock {...(props as any)} insideContainer />,
} satisfies BlockMapper<UnifiedBlock>;
