export type ApiErrorPayload = {
  error?: string | null;
  message?: string | string[] | null;
};

export function safeJsonParse<T>(raw: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function normalizeApiMessage(input: ApiErrorPayload | null, rawText: string, fallback: string): string {
  const raw = input?.message;
  if (Array.isArray(raw)) return raw.filter(Boolean).join(' ') || fallback;
  if (typeof raw === 'string' && raw.trim()) return raw;
  if (typeof input?.error === 'string' && input.error.trim()) return input.error;
  if (rawText.trim()) return rawText.trim().slice(0, 280);
  return fallback;
}

export function normalizeApiTitle(input: ApiErrorPayload | null, fallback: string): string {
  const t = input?.error;
  return typeof t === 'string' && t.trim() ? t : fallback;
}

