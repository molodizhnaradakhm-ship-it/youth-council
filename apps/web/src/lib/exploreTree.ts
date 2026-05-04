import type { ExplorePage } from '@monorepo/cms/src/payload-types';

const EXPLORE_BASE_PATH = '/explore' as const;

export function parentRefId(parent: ExplorePage['parent']): string | null {
  if (parent == null) {
    return null;
  }

  return typeof parent === 'string' ? parent : parent.id;
}

export type ExploreNavItem = {
  id: string;
  label: string;
  slug: string;
  href: string;
  children?: ExploreNavItem[];
};

function navLabel(p: ExplorePage): string {
  return p.navLabel?.trim() || p.title;
}

function pageSlug(p: ExplorePage): string {
  return p.slug ?? '';
}

function exploreHref(sectionSlug: string, ...parts: string[]): string {
  return [EXPLORE_BASE_PATH, sectionSlug, ...parts].join('/');
}

/** `sectionSlug` is the first URL segment under /explore/ (from Explore section slug). */
export function buildExploreNav(docs: ExplorePage[] | null | undefined, sectionSlug: string): ExploreNavItem[] {
  const list = Array.isArray(docs) ? docs : [];
  const roots = list
    .filter((d) => !parentRefId(d.parent))
    .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0));

  return roots.map((root) => {
    const children = list
      .filter((d) => parentRefId(d.parent) === root.id)
      .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0))
      .map((ch) => ({
        id: ch.id,
        href: exploreHref(sectionSlug, pageSlug(root), pageSlug(ch)),
        label: navLabel(ch),
        slug: pageSlug(ch),
      }));

    return {
      children: children.length ? children : undefined,
      href: exploreHref(sectionSlug, pageSlug(root)),
      id: root.id,
      label: navLabel(root),
      slug: pageSlug(root),
    };
  });
}

/** `segments` is the full path after /explore/, e.g. ['my-section','page-slug']. */
export function resolveExplorePageFromSegments(
  docs: ExplorePage[] | null | undefined,
  segments: string[],
): ExplorePage | null {
  const list = Array.isArray(docs) ? docs : [];
  if (segments.length < 2) {
    return null;
  }

  if (segments.length === 2) {
    const slug = segments[1];

    return list.find((d) => !parentRefId(d.parent) && d.slug === slug) ?? null;
  }

  if (segments.length === 3) {
    const parentSlug = segments[1];
    const childSlug = segments[2];
    const parent = list.find((d) => !parentRefId(d.parent) && d.slug === parentSlug);

    if (!parent) {
      return null;
    }

    return list.find((d) => parentRefId(d.parent) === parent.id && d.slug === childSlug) ?? null;
  }

  return null;
}

export function firstExplorePageHref(docs: ExplorePage[] | null | undefined, sectionSlug: string): string | null {
  const list = Array.isArray(docs) ? docs : [];
  const roots = list
    .filter((d) => !parentRefId(d.parent))
    .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0));

  const first = roots[0];
  if (!first?.slug) {
    return null;
  }

  return exploreHref(sectionSlug, pageSlug(first));
}
