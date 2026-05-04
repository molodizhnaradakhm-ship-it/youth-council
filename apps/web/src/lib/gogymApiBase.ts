/** Base host for GoGym REST (no trailing slash, strips trailing `/api` from env). */
export function getGogymApiBase(): string {
  const raw =
    process.env.GOGYM_API_BASE_URL ??
    process.env.NEXT_PUBLIC_GOGYM_API_URL ??
    'https://api.beta.gogym.club';

  const trimmed = raw.trim();
  return trimmed.replace(/\/api\/?$/i, '').replace(/\/$/, '');
}
