export function clampNumber(
  value: unknown,
  opts: { min: number; max: number; fallback?: number },
): number | undefined {
  if (value === null || value === undefined || value === '') return opts.fallback;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return opts.fallback;
  return Math.min(opts.max, Math.max(opts.min, n));
}

export function clampPxCss(
  value: unknown,
  opts: { min?: number; max?: number; fallback?: number } = {},
): string | undefined {
  const n = clampNumber(value, {
    min: opts.min ?? -2000,
    max: opts.max ?? 2000,
    fallback: opts.fallback,
  });
  return typeof n === 'number' ? `${n}px` : undefined;
}

export function clampPctCss(
  value: unknown,
  opts: { min?: number; max?: number; fallback?: number } = {},
): string | undefined {
  const n = clampNumber(value, {
    min: opts.min ?? -200,
    max: opts.max ?? 200,
    fallback: opts.fallback,
  });
  return typeof n === 'number' ? `${n}%` : undefined;
}

