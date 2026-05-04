import type { Payload } from 'payload';

type AnyDoc = Record<string, unknown>;

type MigrationArgs = { payload: Payload };

const BLOCK_TYPE_RENAMES: Record<string, string> = {
  'dark-home-section-block': 'home-section-block',
  'dark-heading-block': 'heading-block',
  'dark-features-bento-block': 'features-bento-block',
  'dark-launch-map-block': 'launch-map-block',
  'dark-section-faq-block': 'section-faq-block',
};

const BLOCK_TYPE_RENAMES_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(BLOCK_TYPE_RENAMES).map(([k, v]) => [v, k]),
);

function isBlockArray(value: unknown): value is { blockType: string }[] {
  return Array.isArray(value) && value.every((b) => b && typeof b === 'object' && typeof (b as any).blockType === 'string');
}

function migrateBlocks(value: unknown, map: Record<string, string>): { value: unknown; changed: boolean } {
  if (!isBlockArray(value)) return { value, changed: false };

  let changed = false;

  const next = value.map((b) => {
    const block = { ...(b as AnyDoc) };
    const originalType = String(block.blockType ?? '');
    const renamedType = map[originalType];
    if (renamedType) {
      block.blockType = renamedType;
      changed = true;
    }

    // Responsive wrappers recurse into mobileBlocks / desktopBlocks
    if (typeof block.blockType === 'string' && String(block.blockType).startsWith('responsive-blocks')) {
      const mobile = migrateBlocks(block.mobileBlocks, map);
      const desktop = migrateBlocks(block.desktopBlocks, map);
      if (mobile.changed) {
        block.mobileBlocks = mobile.value;
        changed = true;
      }
      if (desktop.changed) {
        block.desktopBlocks = desktop.value;
        changed = true;
      }
      return block;
    }

    // Home section wrapper: darkSectionBlocks -> sectionBlocks (after rename we always use sectionBlocks)
    if (block.blockType === 'home-section-block' || block.blockType === 'dark-home-section-block') {
      const nested = (block.sectionBlocks ?? block.darkSectionBlocks) as unknown;
      const nestedMigrated = migrateBlocks(nested, map);
      if (nestedMigrated.changed) {
        block.sectionBlocks = nestedMigrated.value;
        delete block.darkSectionBlocks;
        changed = true;
      } else if (block.darkSectionBlocks && !block.sectionBlocks) {
        block.sectionBlocks = block.darkSectionBlocks;
        delete block.darkSectionBlocks;
        changed = true;
      }
      return block;
    }

    // Hero2: migrate legacy text.button -> text.buttons[0]
    if (block.blockType === 'hero-2-block') {
      const text = (block.text && typeof block.text === 'object') ? (block.text as AnyDoc) : null;
      if (text) {
        const hasButtons = Array.isArray(text.buttons) && (text.buttons as unknown[]).length > 0;
        const legacyButton = text.button && typeof text.button === 'object' ? (text.button as AnyDoc) : null;
        if (!hasButtons && legacyButton) {
          text.buttons = [legacyButton];
          delete text.button;
          block.text = text;
          changed = true;
        } else if (text.button) {
          // If both exist, drop legacy key.
          delete text.button;
          block.text = text;
          changed = true;
        }
      }
      return block;
    }

    return block;
  });

  return { value: next, changed };
}

async function migrateCollectionBlocks(
  payload: Payload,
  args: { collection: string; fields: string[]; map: Record<string, string> },
) {
  const { collection, fields, map } = args;
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await payload.find({
      collection: collection as any,
      limit,
      page,
      depth: 0,
    });

    if (!res.docs.length) break;

    for (const doc of res.docs as AnyDoc[]) {
      const patch: AnyDoc = {};
      let changed = false;

      for (const field of fields) {
        const migrated = migrateBlocks(doc[field], map);
        if (migrated.changed) {
          patch[field] = migrated.value;
          changed = true;
        }
      }

      if (changed) {
        await payload.update({
          collection: collection as any,
          id: String(doc.id),
          data: patch as any,
          depth: 0,
        });
      }
    }

    if (res.docs.length < limit) break;
    page += 1;
  }
}

export async function up({ payload }: MigrationArgs): Promise<void> {
  // Pages: homeBlocks + informationBlocks
  await migrateCollectionBlocks(payload, {
    collection: 'pages',
    fields: ['homeBlocks', 'informationBlocks'],
    map: BLOCK_TYPE_RENAMES,
  });

  // Explore pages: blocks
  await migrateCollectionBlocks(payload, {
    collection: 'explore-pages',
    fields: ['blocks'],
    map: BLOCK_TYPE_RENAMES,
  });

  // Blog: content blocks if present
  await migrateCollectionBlocks(payload, {
    collection: 'blog',
    fields: ['blocks', 'contentBlocks', 'content', 'layoutBlocks'],
    map: BLOCK_TYPE_RENAMES,
  });
}

export async function down({ payload }: MigrationArgs): Promise<void> {
  // Best-effort reverse (mostly useful in dev).
  await migrateCollectionBlocks(payload, {
    collection: 'pages',
    fields: ['homeBlocks', 'informationBlocks'],
    map: BLOCK_TYPE_RENAMES_REVERSE,
  });
  await migrateCollectionBlocks(payload, {
    collection: 'explore-pages',
    fields: ['blocks'],
    map: BLOCK_TYPE_RENAMES_REVERSE,
  });
  await migrateCollectionBlocks(payload, {
    collection: 'blog',
    fields: ['blocks', 'contentBlocks', 'content', 'layoutBlocks'],
    map: BLOCK_TYPE_RENAMES_REVERSE,
  });
}

