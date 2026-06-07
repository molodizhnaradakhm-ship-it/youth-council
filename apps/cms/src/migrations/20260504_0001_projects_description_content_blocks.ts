import type { Payload } from 'payload';

type AnyDoc = Record<string, unknown>;

type MigrationArgs = { payload: Payload };

/** Copy legacy `about` rich text into `description` for existing projects. */
export async function up({ payload }: MigrationArgs): Promise<void> {
  let page = 1;
  const limit = 50;

  while (true) {
    const res = await payload.find({
      collection: 'projects',
      depth: 0,
      limit,
      page,
    });

    if (!res.docs.length) {
      break;
    }

    for (const doc of res.docs as unknown as AnyDoc[]) {
      const about = doc.about;
      const description = doc.description;
      if (about && !description) {
        await payload.update({
          collection: 'projects',
          id: String(doc.id),
          data: { description: about } as Record<string, unknown>,
          depth: 0,
        });
      }
    }

    if (res.docs.length < limit) {
      break;
    }
    page += 1;
  }
}

export async function down(): Promise<void> {
  // No-op: keep migrated description data.
}
