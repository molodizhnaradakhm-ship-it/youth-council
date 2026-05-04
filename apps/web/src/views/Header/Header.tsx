'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Close } from '@radix-ui/react-dialog';

import { AllArrow } from '@/assets/react-icons/AllArrow';
import { NavArrow } from '@/assets/react-icons/NavArrow';
import { Accordion } from '@/components/Accordion';
import { ChromeContainer } from '@/components/ChromeContainer';
import { CMSLink, type CMSLinkType,getCMSLinkPath } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Modal } from '@/components/Modal';
import { Responsive } from '@/components/Responsive';
import { SelectLanguage } from '@/components/SelectLanguage';
import { Text } from '@/components/Text';
import { useGlobals } from '@/contexts/GlobalsContext';
import { useHomeHref } from '@/hooks/useHomeHref';
import { pathsMatchLocalePath, stripLocaleFromPathname } from '@/utils/locale-path';
import type { Media } from '@monorepo/cms/src/payload-types';

import styles from './Header.module.scss';

type HeaderNavItem = {
  id?: string | null;
  link: CMSLinkType;
  isSubmenu?: boolean | null;
  submenuGroup?: {
    allLink?: boolean | null;
    link?: CMSLinkType;
    submenu?: { link: CMSLinkType; id?: string | null }[];
  } | null;
};

function isNavItemActive(
  pathCurrent: string,
  item: {
    link: CMSLinkType;
    isSubmenu?: boolean | null;
    submenuGroup?: {
      submenu?: { link: CMSLinkType }[];
    } | null;
  },
): boolean {
  const p = getCMSLinkPath(item.link);
  if (p && pathsMatchLocalePath(pathCurrent, p)) return true;
  if (item.isSubmenu && item.submenuGroup?.submenu) {
    return item.submenuGroup.submenu.some((row) => {
      const sp = getCMSLinkPath(row.link);
      return sp ? pathsMatchLocalePath(pathCurrent, sp) : false;
    });
  }
  return false;
}

function HeaderNavDesktopItem({
  item,
  isBoldNav,
  isLightHeader,
  openSubmenuId,
  pathCurrent,
  setOpenSubmenuId,
  onSubmenuItemClick,
}: {
  item: HeaderNavItem;
  isBoldNav: boolean;
  isLightHeader: boolean;
  openSubmenuId: string | null;
  pathCurrent: string;
  setOpenSubmenuId: (id: string | null) => void;
  onSubmenuItemClick: () => void;
}) {
  const { id, isSubmenu, link, submenuGroup } = item;
  const allLink = submenuGroup?.link;
  const withAllLink = submenuGroup?.allLink;

  const isActive = isNavItemActive(pathCurrent, { link, isSubmenu, submenuGroup });

  const isOpen = Boolean(id && openSubmenuId === id);

  const textColor = isActive ? (isLightHeader ? 'text' : 'white') : isLightHeader ? 'text' : 'white';

  return (
    <div
      key={id ?? link.label}
      className={clsx(styles.listItem, isSubmenu && styles.withSubMenu, isOpen && styles.open)}
      onMouseEnter={() => isSubmenu && id && setOpenSubmenuId(id)}
      onMouseLeave={() => setOpenSubmenuId(null)}
    >
      <CMSLink {...link} className={clsx(styles.link, !isSubmenu && styles.linkWithoutSubMenu)}>
        <span className={clsx(styles.navLinkInner, isActive && styles.navLinkInnerActive)}>
          <Text
            className={clsx(styles.text, !isActive && !isLightHeader && styles.navTextMuted)}
            fontWeight={isBoldNav ? '600' : undefined}
            type='p2'
            color={textColor}
          >
            {link.label}
          </Text>
        </span>
      </CMSLink>

      {isSubmenu ? (
        <>
          <NavArrow
            className={clsx(
              styles.iconDown,
              isActive && (isLightHeader ? styles.iconDownOnActiveLight : styles.iconDownOnActive),
            )}
          />
          <div className={styles['custom-wrapper']}>
            <ul className={styles.subMenu}>
              {submenuGroup?.submenu?.map(({ link, id }) => (
                <li key={id ?? link.label} className={styles.subMenuItem} onClick={onSubmenuItemClick}>
                  <CMSLink {...link} className={styles.subMenuLink}>
                    <Text type='p2' color='white' className={styles.subMenuText}>
                      {link.label}
                    </Text>
                  </CMSLink>
                </li>
              ))}
              {withAllLink && allLink ? (
                <div className={styles['all-wrapper']} onClick={onSubmenuItemClick}>
                  <CMSLink {...allLink}>
                    <Text type='p2' color='text'>
                      {allLink.label}
                    </Text>
                  </CMSLink>
                  <AllArrow />
                </div>
              ) : null}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}

export const Header = () => {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);
  const [isScrolled, setScroll] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<string | null>(null);

  const tFooter = useTranslations('footer');
  const { header, footer } = useGlobals();
  const homeHref = useHomeHref();

  const listPrivacyLinks = Array.isArray(footer?.listPrivacyLinks) ? footer.listPrivacyLinks : [];
  const copyrightDisplay =
    footer?.copyrightText?.trim() || tFooter('copyright');

  /** Social links used in the mobile menu modal (Footer global only). */
  const socialLinksForModal = useMemo(() => {
    const filterSocial = (
      list: { id?: string | null; icon?: unknown; link?: string | null }[] | null | undefined,
    ) =>
      (list ?? []).filter(
        (s): s is typeof s & { link: string } =>
          Boolean(s.icon) && typeof s.link === 'string' && s.link.trim() !== '',
      );

    const fromFooter = filterSocial(footer?.socialLinks);
    return fromFooter.map((s) => ({
      id: s.id,
      icon: s.icon as string | Media,
      link: s.link.trim(),
    }));
  }, [footer?.socialLinks]);

  const {
    navItems: navItemsRaw,
    navEmphasis,
    // legacy fallbacks (hidden in admin, but might exist in existing data)
    browserIcon: contactUsIcon,
    browserLink: contactUsLink,
    logo: legacyLogo,
  } = header ?? {};
  const navItems = Array.isArray(navItemsRaw) ? navItemsRaw : [];
  // Single header config: always light, no variants/appearance.
  const isLightHeader = true;
  const isBoldNav = navEmphasis === 'bold';
  const pathCurrent = stripLocaleFromPathname(pathname);

  const menuLogo = (header as any)?.menuLogo as Media | string | null | undefined;

  const resolvedMobileLogo = legacyLogo ?? undefined;
  const resolvedDesktopLogo = legacyLogo ?? undefined;

  const contactUsLinkResolved =
    contactUsLink && !contactUsLink.label ? { ...contactUsLink, label: 'Связаться с нами' } : contactUsLink;

  const handleSubmenuClick = () => {
    setOpenSubmenuId(null);
  };

  const hasContactUsDesktop = Boolean(contactUsLinkResolved);
  const hasContactUsMobile = Boolean(contactUsLink?.label?.trim());
  const hasStoreDesktop = hasContactUsDesktop;
  const hasStoreMobile = hasContactUsMobile;

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <InViewAnimation className={clsx('InViewAnimation_animate', styles.headerWrapper)} effect='-y'>
      <header
        className={clsx(styles.wrapper, {
          [styles.light]: isLightHeader,
          [styles.boldNav]: isBoldNav,
          [styles.modalOpen]: openModal,
          [styles.scrolled]: isScrolled,
        })}
      >
        <ChromeContainer>
          <div className={styles['content-wrapper']}>
            <div className={styles['left']}>
              <Responsive hideFrom='laptop'>
                <Link href={homeHref}>
                  <CMSMedia
                    resource={resolvedMobileLogo}
                    className={styles['logo']}
                    withBlur={false}
                  />
                </Link>
              </Responsive>
              <Responsive showFrom='laptop'>
                <nav className={clsx(styles.list, isBoldNav && styles.navBold)}>
                  {navItems?.map((item) => (
                    <HeaderNavDesktopItem
                      key={item.id ?? item.link.label}
                      item={item as HeaderNavItem}
                      isBoldNav={isBoldNav}
                      isLightHeader={isLightHeader}
                      openSubmenuId={openSubmenuId}
                      pathCurrent={pathCurrent}
                      setOpenSubmenuId={setOpenSubmenuId}
                      onSubmenuItemClick={handleSubmenuClick}
                    />
                  ))}
                </nav>
              </Responsive>
            </div>

            <Responsive showFrom='laptop'>
              <div className={styles.center}>
                <Link href={homeHref}>
                  <CMSMedia resource={resolvedDesktopLogo} className={styles['logo']} withBlur={false} />
                </Link>
              </div>
            </Responsive>

            <div className={styles['right']}>
              <Responsive showFrom='laptop'>
                <div className={styles.trailing}>
                  <SelectLanguage variant='tabs' tone='onDark' className={styles.headerLangDesktop} />
                  {hasStoreDesktop ? (
                    <div className={styles.storeButtons}>
                      {hasContactUsDesktop && contactUsLinkResolved ? (
                        <CMSLink {...contactUsLinkResolved} className={styles.ctaLink}>
                          <span
                            className={clsx(
                              styles.storePill,
                              isLightHeader && styles.storePillSecondary,
                              styles.contactPulse,
                            )}
                          >
                            {contactUsIcon ? (
                              <CMSMedia
                                resource={contactUsIcon}
                                className={styles.storePillIcon}
                                withBlur={false}
                              />
                            ) : null}
                            <span className={styles.storePillLabel}>{contactUsLinkResolved.label}</span>
                          </span>
                        </CMSLink>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </Responsive>
              {hasStoreMobile ? (
                <Responsive hideFrom='laptop'>
                  <div className={styles.storeButtonsMobile}>
                    {hasContactUsMobile && contactUsLink ? (
                      <CMSLink {...contactUsLink} className={styles.ctaLinkMobile}>
                        <span
                          className={clsx(
                            styles.storePillMobile,
                            isLightHeader && styles.storePillMobileSecondary,
                            styles.contactPulse,
                          )}
                        >
                          {contactUsIcon ? (
                            <CMSMedia
                              resource={contactUsIcon}
                              className={styles.storePillIconMobile}
                              withBlur={false}
                            />
                          ) : null}
                          <span className={styles.storePillLabelMobile}>{contactUsLink.label}</span>
                        </span>
                      </CMSLink>
                    ) : null}
                  </div>
                </Responsive>
              ) : null}
              <Responsive hideFrom='laptop'>
                <div
                  className={clsx(styles['btn-menu'], { [styles.active]: openModal })}
                  onClick={() => setOpenModal((prev) => !prev)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </Responsive>
            </div>
          </div>
        </ChromeContainer>
        <Modal
          open={openModal}
          onOpenChange={setOpenModal}
          className={styles['modal']}
          contentClassName={styles['modal-content']}
          centeredContent={false}
        >
          <div className={styles['modal-top-bar']}>
            <div className={styles['content-wrapper']}>
              <div className={styles['left']}>
                <Link href={homeHref}>
                  <CMSMedia
                    resource={(menuLogo ?? legacyLogo) ?? undefined}
                    className={styles['logo']}
                    withBlur={false}
                  />
                </Link>
              </div>
              <div className={styles['right']}>
                <div className={styles['modal-header-trailing']}>
                  <SelectLanguage variant='compact' tone='onLight' className={styles.headerLangMobile} />
                  <button
                    type='button'
                    className={styles.modalClose}
                    aria-label='Close menu'
                    onClick={() => setOpenModal(false)}
                  >
                    <span aria-hidden className={styles.modalCloseIcon} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['menu-modal-wrapper']}>
            <Accordion
              list={navItems.filter((item) => item.isSubmenu && item.id)}
              className={styles.accordionWrapper}
              classNameTrigger={styles.accordionTrigger}
              renderTrigger={(item) => {
                const isActive = isNavItemActive(pathCurrent, {
                  link: item.link,
                  isSubmenu: item.isSubmenu,
                  submenuGroup: item.submenuGroup,
                });
                return (
                  <div className={styles['modal-title-wrapper']}>
                    <Text
                      className={clsx(styles.menuModalLink, !isActive && styles.menuModalLinkMuted)}
                      type='h1'
                      tag='span'
                      color='inherit'
                    >
                      {item.link.label}
                    </Text>
                    <NavArrow className={styles.arrowIcon} />
                  </div>
                );
              }}
              renderContent={(item) => (
                <div className={styles['menu-modal-inner-wrapper']}>
                  {item.submenuGroup?.submenu?.map(({ link, id }) => {
                    const subPath = getCMSLinkPath(link);
                    const subActive = subPath ? pathsMatchLocalePath(pathCurrent, subPath) : false;
                    return (
                      <CMSLink key={id} {...link}>
                        <Close asChild>
                          <Text
                            className={clsx(styles.menuModalSubLink, !subActive && styles.menuModalLinkMuted)}
                            type='h4'
                            color='inherit'
                            tag='span'
                          >
                            {link.label}
                          </Text>
                        </Close>
                      </CMSLink>
                    );
                  })}
                </div>
              )}
            />
            {navItems
              .filter((item) => !item.isSubmenu)
              .map(({ link, id }) => {
                const isActive = isNavItemActive(pathCurrent, {
                  link,
                  isSubmenu: false,
                });
                return (
                  <CMSLink {...link} className={styles['menu-modal-item']} key={id}>
                    <Close asChild>
                      <Text
                        className={clsx(styles.menuModalLink, !isActive && styles.menuModalLinkMuted)}
                        color='inherit'
                        type='h1'
                        tag='h2'
                      >
                        {link.label}
                      </Text>
                    </Close>
                  </CMSLink>
                );
              })}
          </div>
          {hasStoreMobile ? (
            <div className={styles.modalCtas}>
              {hasContactUsMobile && contactUsLink ? (
                <CMSLink {...contactUsLink} className={styles.modalCtaLink}>
                  <span className={clsx(styles.modalCtaPill, styles.modalCtaPillSecondary, styles.contactPulse)}>
                    {contactUsIcon ? (
                      <CMSMedia className={styles.modalCtaIcon} resource={contactUsIcon} withBlur={false} />
                    ) : null}
                    <span className={styles.modalCtaLabel}>{contactUsLink.label}</span>
                  </span>
                </CMSLink>
              ) : null}
            </div>
          ) : null}
          {socialLinksForModal.length > 0 ? (
            <div className={styles['socials-links']}>
              {socialLinksForModal.map(({ link, id, icon }) => (
                <Link href={link} key={id ?? link} className={styles['socials-link']} target='_blank' rel='noopener noreferrer'>
                  <CMSMedia className={styles['social-logo']} resource={icon} withBlur={false} />
                </Link>
              ))}
            </div>
          ) : null}
          <div className={styles.modalLegalBar}>
            <p className={styles.modalCopyright}>{copyrightDisplay}</p>
            {listPrivacyLinks.length > 0 ? (
              <div className={styles.modalLegalLinks}>
                {listPrivacyLinks.map(({ id, link }, index) => (
                  <Fragment key={id ?? `legal-${index}`}>
                    {index > 0 ? (
                      <span aria-hidden className={styles.modalLegalSep}>
                        ·
                      </span>
                    ) : null}
                    <Close asChild>
                      <CMSLink className={styles.modalLegalLink} {...link}>
                        {link.label}
                      </CMSLink>
                    </Close>
                  </Fragment>
                ))}
              </div>
            ) : null}
          </div>
        </Modal>
      </header>
    </InViewAnimation>
  );
};
