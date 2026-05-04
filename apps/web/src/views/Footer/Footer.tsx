'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ChromeContainer } from '@/components/ChromeContainer';
import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { SocialsBlock } from '@/components/SocialsBlock';
import { useGlobals } from '@/contexts/GlobalsContext';
import { useHomeHref } from '@/hooks/useHomeHref';
import type {
  Footer as FooterGlobal,
  Media,
} from '@monorepo/cms/src/payload-types';

import { BackToTop } from './BackToTop';

import styles from './Footer.module.scss';

type NavItem = NonNullable<FooterGlobal['navItems']>[number];
type NavLinkRow = { id?: string | null; link: any };

type SocialIconRow = {
  icon?: (string | null) | Media;
  link?: string | null;
  id?: string | null;
};

function filterFooterSocialLinks(
  list: SocialIconRow[] | null | undefined,
): { icon: string | Media; link?: string | null; id?: string | null }[] {
  if (!list?.length) return [];
  return list
    .filter(
      (item) =>
        Boolean(item.icon),
    )
    .map((item) => ({
      id: item.id,
      icon: item.icon as string | Media,
      link: typeof item.link === 'string' ? item.link.trim() : null,
    }));
}

function extractFooterNavRows(raw: unknown): NavLinkRow[] {
  if (!Array.isArray(raw)) return [];

  // New shape (flat list): [{ link }]
  const direct = raw
    .filter((x): x is { id?: string | null; link?: any } => Boolean(x && typeof x === 'object' && 'link' in (x as any)))
    .map((x, idx) => ({ id: x.id ?? `nav-${idx}`, link: (x as any).link }))
    .filter((x) => Boolean(x.link?.label));

  if (direct.length > 0) return direct;

  // Legacy shapes: [{ links: [{ link }] }] or old submenu shapes.
  const out: NavLinkRow[] = [];
  raw.forEach((item: any, idx: number) => {
    if (Array.isArray(item?.links)) {
      item.links.forEach((row: any, j: number) => {
        if (row?.link?.label) out.push({ id: row.id ?? `legacy-${idx}-${j}`, link: row.link });
      });
      return;
    }
    if (item?.isSubmenu && Array.isArray(item?.submenu)) {
      item.submenu.forEach((row: any, j: number) => {
        if (row?.link?.label) out.push({ id: row.id ?? `legacy-${idx}-${j}`, link: row.link });
      });
      return;
    }
    if (item?.link?.label) {
      out.push({ id: item.id ?? `legacy-${idx}`, link: item.link });
    }
  });

  return out;
}

export const Footer = () => {
  const t = useTranslations('footer');
  const { footer } = useGlobals();
  const homeHref = useHomeHref();

  const footerDoc = footer ?? ({} as FooterGlobal);

  const {
    copyrightText,
    developedBy,
    description,
    listPrivacyLinks: listPrivacyLinksRaw,
    logo,
    navItems: navItemsRaw,
    socialLinks: footerSocialLinks,
  } = footerDoc;

  const listPrivacyLinks = Array.isArray(listPrivacyLinksRaw) ? listPrivacyLinksRaw : [];
  const navItems = extractFooterNavRows(navItemsRaw);

  const fromFooter = filterFooterSocialLinks(footerSocialLinks ?? undefined);
  const socialList = fromFooter;

  // Single navigation list (no columns).
  const navRows = navItems;

  const copyrightDisplay =
    copyrightText?.trim() || t('copyright');

  const descriptionText = description?.trim() ?? '';

  return (
    <footer className={styles.wrapper}>
      <div className={styles.top}>
        <ChromeContainer>
          <div className={styles.topInner}>
            <div className={styles.brand}>
              <Link className={styles.logoLink} href={homeHref}>
                <CMSMedia resource={logo} className={styles.logo} />
              </Link>
              {descriptionText ? <p className={styles.footerDescription}>{descriptionText}</p> : null}
            </div>

            <div className={styles.rightCol}>
              {navRows.length > 0 ? (
                <nav className={styles.nav} aria-label='Footer navigation'>
                  <ul className={styles.navList}>
                    {navRows.map((row, i) => (
                      <li key={row.id ?? `link-${i}`}>
                        <CMSLink className={styles.navLink} {...row.link}>
                          {row.link.label}
                        </CMSLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}

              {socialList?.length ? (
                <div className={styles.socials}>
                  <SocialsBlock hideTitle socList={socialList} variant='footer' />
                </div>
              ) : null}
            </div>
          </div>
        </ChromeContainer>
      </div>

      <div className={styles.bottom}>
        <ChromeContainer>
          <div className={styles.bottomRow}>
            <p className={styles.copyright}>{copyrightDisplay}</p>

            {developedBy?.enabled ? (
              <div className={styles.developedBy}>
                {developedBy.icon && typeof developedBy.icon === 'object' ? (
                  <CMSMedia className={styles.developedIcon} resource={developedBy.icon} />
                ) : null}
                <p className={styles.developedText}>
                  <span>{developedBy.prefix}</span>{' '}
                  {developedBy.brandUrl ? (
                    <a
                      className={styles.developedBrand}
                      href={developedBy.brandUrl}
                      rel='noopener noreferrer'
                      style={{ color: developedBy.brandColor ?? '#14b8a6' }}
                      target='_blank'
                    >
                      {developedBy.brandName}
                    </a>
                  ) : (
                    <span className={styles.developedBrand} style={{ color: developedBy.brandColor ?? '#14b8a6' }}>
                      {developedBy.brandName}
                    </span>
                  )}
                </p>
              </div>
            ) : null}

            {listPrivacyLinks.length > 0 ? (
              <div className={styles.legal}>
                {listPrivacyLinks.map(({ id, link }, index) => (
                  <Fragment key={id}>
                    {index > 0 ? (
                      <span aria-hidden className={styles.legalSep}>
                        ·
                      </span>
                    ) : null}
                    <CMSLink className={styles.legalLink} {...link}>
                      {link.label}
                    </CMSLink>
                  </Fragment>
                ))}
              </div>
            ) : (
              <span aria-hidden />
            )}
          </div>
        </ChromeContainer>
      </div>
      <BackToTop />
    </footer>
  );
};
