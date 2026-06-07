import type { Payload } from 'payload';

type AnyDoc = Record<string, unknown>;

type MigrationArgs = { payload: Payload };

function hasDescriptionBlock(blocks: unknown): boolean {
  return (
    Array.isArray(blocks) &&
    blocks.some((b) => b && typeof b === 'object' && (b as AnyDoc).blockType === 'post-description-block')
  );
}

async function migrateCollectionDescriptionToBlock(payload: Payload, collection: 'blog' | 'projects') {
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await payload.find({
      collection,
      depth: 0,
      limit,
      page,
    });

    if (!res.docs.length) {
      break;
    }

    for (const doc of res.docs as AnyDoc[]) {
      const description = doc.description;
      if (!description) {
        continue;
      }

      const existingBlocks = Array.isArray(doc.contentBlocks) ? [...doc.contentBlocks] : [];
      if (hasDescriptionBlock(existingBlocks)) {
        continue;
      }

      await payload.update({
        collection,
        id: String(doc.id),
        data: {
          contentBlocks: [{ blockType: 'post-description-block', content: description }, ...existingBlocks],
        },
        depth: 0,
      });
    }

    if (res.docs.length < limit) {
      break;
    }
    page += 1;
  }
}

/** Move legacy `description` rich text into a `post-description-block` content block. */
export async function up({ payload }: MigrationArgs): Promise<void> {
  await migrateCollectionDescriptionToBlock(payload, 'blog');
  await migrateCollectionDescriptionToBlock(payload, 'projects');
}

export async function down(): Promise<void> {
  // No-op: keep migrated block data.
}
