import type { Payload } from 'payload';

type AnyDoc = Record<string, unknown>;

type MigrationArgs = { payload: Payload };

function sortKey(doc: AnyDoc): string {
  const shortName = String(doc.shortName ?? '').trim();
  const title = String(doc.title ?? '').trim();
  const fullName = String(doc.fullName ?? '').trim();

  return (shortName || title || fullName).toLocaleLowerCase();
}

/** Assign initial `_order` for existing participants (alphabetical by name). */
export async function up({ payload }: MigrationArgs): Promise<void> {
  let page = 1;
  const limit = 100;
  const docs: AnyDoc[] = [];

  while (true) {
    const res = await payload.find({
      collection: 'participants',
      depth: 0,
      limit,
      page,
    });

    docs.push(...(res.docs as AnyDoc[]));

    if (res.docs.length < limit) {
      break;
    }
    page += 1;
  }

  const sorted = docs.sort((a, b) => sortKey(a).localeCompare(sortKey(b), 'uk'));

  for (let index = 0; index < sorted.length; index += 1) {
    const doc = sorted[index];
    if (doc._order) {
      continue;
    }

    await payload.update({
      collection: 'participants',
      id: String(doc.id),
      data: {
        _order: String(index).padStart(6, '0'),
      },
      depth: 0,
    });
  }
}

export async function down(): Promise<void> {
  // No-op: keep order values.
}
