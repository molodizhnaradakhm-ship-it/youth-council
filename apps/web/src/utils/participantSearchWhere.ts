/** Keyword search across title, specialization, excerpt, and keyword labels (Payload `contains`). */
export function buildParticipantSearchWhere(q: string | undefined): Record<string, unknown> {
  const term = typeof q === 'string' ? q.trim() : '';
  if (!term) {
    return {};
  }

  return {
    or: [
      { title: { contains: term } },
      { specialization: { contains: term } },
      { excerpt: { contains: term } },
      { 'keywords.label': { contains: term } },
    ],
  };
}
