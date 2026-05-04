/**
 * Публічний origin CMS (без завершального `/`).
 * Потрібен для server actions, які ходять у Payload REST (form-submissions тощо).
 */
export function getCmsBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_CMS_URL?.trim();
  if (!url) {
    throw new Error('NEXT_PUBLIC_CMS_URL is not set');
  }
  return url.replace(/\/$/, '');
}
