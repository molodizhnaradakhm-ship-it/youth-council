import { getTranslations } from 'next-intl/server';

import { CMSLink } from '@/components/CMSLink';
import { Container } from '@/components/Container';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import RichText from '@/components/RichText';
import type { Page } from '@monorepo/cms/src/payload-types';

import styles from './ExternalLinks.module.scss';

type Props = Page;

const CMS_LINK_TYPE = {
  Custom: 'custom',
  Reference: 'reference',
  Form: 'form',
} as const;

function ctaIsRenderable(
  link: NonNullable<NonNullable<Page['externalLinksPage']>['cta']>['link'],
): boolean {
  if (!link?.label?.trim()) return false;
  switch (link.type) {
    case CMS_LINK_TYPE.Custom:
      return Boolean(link.url?.trim());
    case CMS_LINK_TYPE.Reference:
      return Boolean(link.reference?.value);
    case CMS_LINK_TYPE.Form:
      return Boolean(link.form);
    default:
      return false;
  }
}

export const ExternalLinks = async ({ title, externalLinksPage }: Props) => {
  const t = await getTranslations('details');
  const items = externalLinksPage?.items ?? [];
  const intro = externalLinksPage?.intro;
  const ctaLink = externalLinksPage?.cta?.link;
  const blocks = externalLinksPage?.blocks ?? [];

  return (
    <main className={styles.wrapper}>
      <div className={styles.content}>
        <Container wide>
          <h1 className={styles.pageTitle}>{title}</h1>

          {blocks.length > 0 ? (
            <div className={styles.panel}>
              <RenderBlocks blocks={blocks as never} mapper={unifiedBlocksMapper} />
            </div>
          ) : items.length === 0 ? (
            <p className={styles.empty}>{t('external_links_empty')}</p>
          ) : (
            <div className={styles.panel}>
              {intro ? (
                <RichText
                  className={styles.intro}
                  content={intro}
                  textColor='inherit'
                  textType='p2'
                />
              ) : null}

              <ul className={styles.list}>
                {items.map((row, i) => (
                  <li key={row.id ?? `external-link-${i}`} className={styles.listItem}>
                    <CMSLink className={styles.link} {...row.link}>
                      {row.link.label}
                    </CMSLink>
                  </li>
                ))}
              </ul>

              {ctaLink && ctaIsRenderable(ctaLink) ? (
                <div className={styles.ctaWrap}>
                  <CMSLink className={styles.cta} {...ctaLink}>
                    {ctaLink.label}
                  </CMSLink>
                </div>
              ) : null}
            </div>
          )}
        </Container>
      </div>
    </main>
  );
};
