/** Keyword search across names, specialization, excerpt, and keyword labels (Payload `contains`). */
export function buildParticipantSearchWhere(q: string | undefined): Record<string, unknown> {
  const term = typeof q === 'string' ? q.trim() : '';
  if (!term) {
    return {};
  }

  return {
    or: [
      { shortName: { contains: term } },
      { fullName: { contains: term } },
      { title: { contains: term } },
      { specialization: { contains: term } },
      { excerpt: { contains: term } },
      { 'keywords.label': { contains: term } },
    ],
  };
}
