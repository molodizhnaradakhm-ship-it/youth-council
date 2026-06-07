import type { CMSLinkType } from '@/components/CMSLink';

/** True when a CMS link group has enough data to resolve a target. */
export function hasCmsLinkTarget(link: CMSLinkType | null | undefined): boolean {
  if (!link?.type) {
    return false;
  }
  if (link.type === 'reference') {
    const value = link.reference?.value;
    if (value == null) {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return true;
  }
  if (link.type === 'custom') {
    return Boolean(String(link.url ?? '').trim());
  }
  if (link.type === 'form') {
    return link.form != null && link.form !== '';
  }
  return false;
}
