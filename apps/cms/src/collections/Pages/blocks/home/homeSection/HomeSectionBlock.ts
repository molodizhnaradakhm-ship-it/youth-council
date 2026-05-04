import type { Block } from 'payload';

import { buildResponsiveBlocksBlock } from '../../../../shared/ResponsiveBlocks';
import { FeaturesBentoBlock } from './FeaturesBentoBlock';
import { HeadingBlock } from './HeadingBlock';
import { LaunchMapBlock } from './LaunchMapBlock';
import { SectionFaqBlock } from './SectionFaqBlock';

export const HomeSectionBlock: Block = {
  fields: [
    {
      admin: {
        description:
          'Add at least one block. You can add any number of nested blocks: heading, features grid, launch map, FAQ.',
      },
      blocks: [
        HeadingBlock,
        FeaturesBentoBlock,
        LaunchMapBlock,
        SectionFaqBlock,
        buildResponsiveBlocksBlock({
          label: 'Responsive (mobile / desktop)',
          slug: 'responsive-blocks-section',
          blocks: [HeadingBlock, FeaturesBentoBlock, LaunchMapBlock, SectionFaqBlock],
        }),
      ],
      label: 'Blocks inside section (with background)',
      labels: { plural: 'Blocks', singular: 'Block' },
      minRows: 1,
      name: 'sectionBlocks',
      required: true,
      type: 'blocks',
    },
  ],
  interfaceName: 'HomeSectionBlockFields',
  labels: { plural: 'Section (with background)', singular: 'Section (with background)' },
  slug: 'home-section-block',
};

