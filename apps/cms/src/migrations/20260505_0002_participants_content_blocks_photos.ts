import type { Payload } from 'payload';

type AnyDoc = Record<string, unknown>;

type MigrationArgs = { payload: Payload };

function hasDescriptionBlock(blocks: unknown): boolean {
  return (
    Array.isArray(blocks) &&
    blocks.some((b) => b && typeof b === 'object' && (b as AnyDoc).blockType === 'post-description-block')
  );
}

/** Move legacy `about` rich text into a `post-description-block` content block. */
export async function up({ payload }: MigrationArgs): Promise<void> {
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await payload.find({
      collection: 'participants',
      depth: 0,
      limit,
      page,
    });

    if (!res.docs.length) {
      break;
    }

    for (const doc of res.docs as unknown as AnyDoc[]) {
      const patch: AnyDoc = {};
      const legacyPhoto = doc.photo;
      const contentPhoto = doc.contentPhoto ?? legacyPhoto;

      if (contentPhoto && doc.contentPhoto !== contentPhoto) {
        patch.contentPhoto = contentPhoto;
      }

      if (!doc.thumbnail && contentPhoto) {
        patch.thumbnail = contentPhoto;
      }

      const about = doc.about;
      if (about) {
        const existingBlocks = Array.isArray(doc.contentBlocks) ? [...doc.contentBlocks] : [];
        if (!hasDescriptionBlock(existingBlocks)) {
          patch.contentBlocks = [
            { blockType: 'post-description-block', content: about },
            ...existingBlocks,
          ];
        }
      }

      if (Object.keys(patch).length === 0) {
        continue;
      }

      await payload.update({
        collection: 'participants',
        id: String(doc.id),
        data: patch,
        depth: 0,
      });
    }

    if (res.docs.length < limit) {
      break;
    }
    page += 1;
  }
}

export async function down(): Promise<void> {
  // No-op: keep migrated data.
}
