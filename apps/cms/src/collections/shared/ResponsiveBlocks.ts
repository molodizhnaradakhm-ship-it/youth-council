import type { Block, BlocksField } from 'payload';

type Opts = {
  /** Label in admin UI */
  label?: string;
  /** Block slug (must be unique within a blocks list) */
  slug?: string;
  /** Blocks allowed inside mobile/desktop variants */
  blocks: Block[];
};

/**
 * A wrapper block that lets editors build two full block lists: Mobile and Desktop.
 * Frontend chooses which list to render based on viewport.
 */
export const buildResponsiveBlocksBlock = ({ label = 'Responsive blocks', blocks, slug = 'responsive-blocks' }: Opts): Block => {
  const allowedBlocks = blocks;

  const blocksField = (name: string, adminLabel: string): BlocksField => ({
    name,
    type: 'blocks',
    label: adminLabel,
    labels: { singular: 'Block', plural: 'Blocks' },
    localized: true,
    blocks: allowedBlocks,
    required: false,
  });

  return {
    slug,
    interfaceName: 'ResponsiveBlocksBlockFields',
    labels: { singular: label, plural: label },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Mobile',
            fields: [
              {
                admin: {
                  description: 'Blocks rendered on mobile (≤767px). If empty, Desktop list is used as fallback.',
                },
                ...blocksField('mobileBlocks', 'Mobile blocks'),
              },
            ],
          },
          {
            label: 'Desktop',
            fields: [
              {
                admin: {
                  description: 'Blocks rendered on desktop (≥768px). If empty, Mobile list is used as fallback.',
                },
                ...blocksField('desktopBlocks', 'Desktop blocks'),
              },
            ],
          },
        ],
      },
    ],
  };
};

