import { locales } from '@/utils/config';

const LOCALE_PREFIX_RE = new RegExp(`^\\/(${locales.join('|')})(?=\\/|$)`);

/** Path without `/{locale}` prefix (for comparing with CMS link paths). */
export function stripLocaleFromPathname(pathname: string): string {
  let rest = pathname.replace(LOCALE_PREFIX_RE, '');
  if (!rest) rest = '/';
  if (!rest.startsWith('/')) rest = `/${rest}`;
  return rest;
}

/** True if current route matches a CMS nav path (home or nested under it). */
export function pathsMatchLocalePath(current: string, linkPath: string): boolean {
  if (linkPath === '/') return current === '/' || current === '';
  return current === linkPath || current.startsWith(`${linkPath}/`);
}
