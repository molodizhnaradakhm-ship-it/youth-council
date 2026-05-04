import { defaultLocale, SITE_URL } from '@/utils/config';

/** Stable slug for the User Agreement / Offer page in Payload `pages`. Configure the page in CMS with this slug. */
export const OFFER_PAGE_SLUG = 'offer' as const;

/** Public offer for trainers/coaches — static Next.js route (not CMS). */
export const PUBLIC_OFFER_COACHES_SLUG = 'public-offer-coaches' as const;

/**
 * Absolute URL to the Offer (оферта) page for deep links from the mobile app.
 * Matches URL shape used in `sitemap.ts` (default locale has no prefix).
 */
export function getOfferPageUrl(locale: string = defaultLocale): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}/${OFFER_PAGE_SLUG}`;
}

/**
 * Absolute URL to the public offer for coaches (публичная оферта для тренеров) for deep links from the mobile app.
 * Matches URL shape used elsewhere (default locale has no prefix).
 */
export function getPublicOfferCoachesPageUrl(locale: string = defaultLocale): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}/${PUBLIC_OFFER_COACHES_SLUG}`;
}
