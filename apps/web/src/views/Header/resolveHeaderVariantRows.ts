import type { CMSLinkType } from '@/components/CMSLink';
import type { Media } from '@monorepo/cms/src/payload-types';

export type HeaderVariantBucket = {
  logo?: (string | null) | Media | null;
  menuLogo?: (string | null) | Media | null;
  browserLink?: CMSLinkType | null;
  browserIcon?: (string | null) | Media | null;
  iosAppLink?: CMSLinkType | null;
  iosAppIcon?: (string | null) | Media | null;
  androidAppLink?: CMSLinkType | null;
  androidAppIcon?: (string | null) | Media | null;
};

type VariantShape = HeaderVariantBucket & {
  mobile?: HeaderVariantBucket | null;
  desktop?: HeaderVariantBucket | null;
};

/**
 * CMS: `variants.dark|light.mobile` / `.desktop` (≥1200px = laptop у Responsive).
 * Старі записи: плоскі поля на variant — підставляються в обидва бакети.
 */
export function resolveHeaderVariantRows(
  variant: VariantShape | null | undefined,
  legacy: HeaderVariantBucket,
): { mobileRow: HeaderVariantBucket; desktopRow: HeaderVariantBucket } {
  const hasNew = Boolean(variant?.mobile || variant?.desktop);
  const legacyFlat = !hasNew && variant ? variant : null;

  const fill = (b: HeaderVariantBucket | null | undefined): HeaderVariantBucket => ({
    logo: b?.logo ?? legacyFlat?.logo ?? legacy.logo,
    menuLogo: b?.menuLogo ?? legacyFlat?.menuLogo ?? legacy.menuLogo,
    browserLink: b?.browserLink ?? legacyFlat?.browserLink ?? legacy.browserLink,
    browserIcon: b?.browserIcon ?? legacyFlat?.browserIcon ?? legacy.browserIcon,
    iosAppLink: b?.iosAppLink ?? legacyFlat?.iosAppLink ?? legacy.iosAppLink,
    iosAppIcon: b?.iosAppIcon ?? legacyFlat?.iosAppIcon ?? legacy.iosAppIcon,
    androidAppLink: b?.androidAppLink ?? legacyFlat?.androidAppLink ?? legacy.androidAppLink,
    androidAppIcon: b?.androidAppIcon ?? legacyFlat?.androidAppIcon ?? legacy.androidAppIcon,
  });

  const M = fill(variant?.mobile ?? undefined);
  const D = fill(variant?.desktop ?? undefined);

  return {
    mobileRow: {
      logo: M.logo ?? D.logo,
      menuLogo: M.menuLogo ?? M.logo ?? D.logo,
      browserLink: M.browserLink ?? D.browserLink,
      browserIcon: M.browserIcon ?? D.browserIcon,
      iosAppLink: M.iosAppLink ?? D.iosAppLink,
      iosAppIcon: M.iosAppIcon ?? D.iosAppIcon,
      androidAppLink: M.androidAppLink ?? D.androidAppLink,
      androidAppIcon: M.androidAppIcon ?? D.androidAppIcon,
    },
    desktopRow: {
      logo: D.logo ?? M.logo,
      menuLogo: D.menuLogo ?? D.logo ?? M.logo,
      browserLink: D.browserLink ?? M.browserLink,
      browserIcon: D.browserIcon ?? M.browserIcon,
      iosAppLink: D.iosAppLink ?? M.iosAppLink,
      iosAppIcon: D.iosAppIcon ?? M.iosAppIcon,
      androidAppLink: D.androidAppLink ?? M.androidAppLink,
      androidAppIcon: D.androidAppIcon ?? M.androidAppIcon,
    },
  };
}
