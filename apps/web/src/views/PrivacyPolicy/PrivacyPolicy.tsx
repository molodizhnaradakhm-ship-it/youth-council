'use client';
import { useMemo } from 'react';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { CMSLink, getCMSLinkPath } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import RichText from '@/components/RichText';
import { Text } from '@/components/Text';
import { useGlobals } from '@/contexts/GlobalsContext';
import { pathsMatchLocalePath, stripLocaleFromPathname } from '@/utils/locale-path';
import type { Page } from '@monorepo/cms/src/payload-types';

import styles from './PrivacyPolicy.module.scss';

type PrivacyPolicyProps = Page & { country?: string };

export const PrivacyPolicy = ({
  privacyText,
  privacyRegions,
  informationBlocks,
  title,
  description,
  lastUpdated,
  bgImage,
  country: countryFromQuery,
}: PrivacyPolicyProps) => {
  const t = useTranslations('common');
  const tLegal = useTranslations('legal');
  const { footer } = useGlobals();
  const router = useRouter();
  const pathname = usePathname();
  useLocale();

  const pathCurrent = useMemo(() => stripLocaleFromPathname(pathname), [pathname]);
  const privacyLinks = useMemo(() => {
    const list = footer?.listPrivacyLinks;
    return Array.isArray(list) ? list : [];
  }, [footer?.listPrivacyLinks]);

  const resolvedPrivacyText = useMemo(() => {
    const code = countryFromQuery?.trim();
    if (!code || !privacyRegions?.length) return privacyText ?? [];
    const upper = code.toUpperCase();
    const variant = privacyRegions.find(
      (r) => r.countryCode?.trim().toUpperCase() === upper,
    );
    return variant?.body ?? privacyText ?? [];
  }, [countryFromQuery, privacyRegions, privacyText]);

  return (
    <main className={clsx(styles.main)}>
      {bgImage ? (
        <div className={styles.banner}>
          <CMSMedia resource={bgImage} className={styles['banner-image']} />
        </div>
      ) : null}
      <section className={clsx(styles['privacy-text-section'])}>
        <Container>
          <InViewAnimation className={styles.heading} threshold={0}>
            <div className={styles['title-block']}>
              <Text type='h1' color='text' className={styles.title}>
                {title}
              </Text>
              {lastUpdated?.trim() ? (
                <Text type='p2' className={styles['last-updated']}>
                  {tLegal('last_updated_prefix')} {lastUpdated}
                </Text>
              ) : null}
            </div>
            {description?.trim() ? (
              <Text type='p2' color='text' className={styles.description}>
                {description}
              </Text>
            ) : null}
          </InViewAnimation>
          <InViewAnimation className={styles['content-wrapper']} threshold={0}>
            {informationBlocks?.length ? (
              <RenderBlocks blocks={informationBlocks as never} mapper={unifiedBlocksMapper} />
            ) : (
              <RichText
                content={resolvedPrivacyText}
                className={styles['richText']}
                textType='p2'
                textColor='inherit'
              />
            )}
            <div className={styles['nav-wrapper']}>
              <button className={styles['go-back']} type='button' onClick={() => router.back()}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='17'
                  height='17'
                  viewBox='0 0 17 17'
                  fill='none'
                >
                  <path
                    d='M16.2021 8.90829L16.202 7.37304L0.849541 7.37246L0.849599 8.90771L16.2021 8.90829Z'
                    fill='#13485d'
                  />
                  <path
                    d='M1.0855 9.2271L9.22707 1.08554L8.14144 -8.63283e-05L-0.000123309 8.14148L1.0855 9.2271Z'
                    fill='#13485d'
                  />
                  <path
                    d='M8.14146 16.2827L9.227 15.1972L1.08482 7.05497L-0.000725885 8.14051L8.14146 16.2827Z'
                    fill='#13485d'
                  />
                </svg>
                <Text type='p2' fontWeight='600'>
                  {t('go_back_button')}
                </Text>
              </button>
              <div className={styles['list-wrapper']}>
                {privacyLinks.map(({ link, id }) => {
                  const linkPath = getCMSLinkPath(link);
                  const isActive = linkPath ? pathsMatchLocalePath(pathCurrent, linkPath) : false;

                  return (
                    <div key={id} className={styles['list-item']}>
                      <CMSLink {...link}>
                        <Text
                          type='p2'
                          className={clsx(styles['link-text'], {
                            [styles.active]: isActive,
                          })}
                        >
                          {link.label}
                        </Text>
                      </CMSLink>

                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='7'
                        height='18'
                        viewBox='0 0 7 18'
                        fill='none'
                        className={styles['slash']}
                      >
                        <path
                          opacity='0.25'
                          d='M7 0.419534L1.52353 18L0 17.5405L5.45588 0L7 0.419534Z'
                          fill='#13485d'
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </InViewAnimation>
        </Container>
      </section>
    </main>
  );
};

/** Same layout as Privacy Policy — User Agreement / Offer uses the `information` template. */
export const UserAgreement = PrivacyPolicy;
