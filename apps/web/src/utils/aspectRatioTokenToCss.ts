/**
 * Maps CMS aspect-ratio select values to CSS `aspect-ratio`.
 * Values use `ratio_W_H` (GraphQL-safe). Legacy documents may still store `W:H`.
 */
export function aspectRatioTokenToCss(ratio: string | null | undefined): string | undefined {
  if (ratio == null || ratio === '' || ratio === 'auto' || ratio === 'fill') {
    return undefined;
  }
  if (ratio.includes(':')) {
    const parts = ratio.split(':').map((x) => Number(String(x).trim()));
    if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
      return `${parts[0]} / ${parts[1]}`;
    }
    return undefined;
  }
  const m = /^ratio_(\d+)_(\d+)$/.exec(ratio);
  if (m) {
    return `${m[1]} / ${m[2]}`;
  }
  return undefined;
}
