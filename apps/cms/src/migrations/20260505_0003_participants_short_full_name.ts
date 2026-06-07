import type { Payload } from 'payload';

type AnyDoc = Record<string, unknown>;

type MigrationArgs = { payload: Payload };

/** Copy legacy `title` into `shortName` and `fullName`. */
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
      const legacyTitle = doc.title;
      const patch: AnyDoc = {};

      if (legacyTitle && !doc.shortName) {
        patch.shortName = legacyTitle;
      }

      if (legacyTitle && !doc.fullName) {
        patch.fullName = legacyTitle;
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
