'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { LocalizedLink } from '@/components/LocalizedLink';
import { RenderBlocks } from '@/components/RenderBlocks';
import { unifiedBlocksMapper } from '@/components/RenderBlocks/unifiedBlocksMapper';
import { Text } from '@/components/Text';
import type { Media,Page } from '@monorepo/cms/src/payload-types';

import { BasketballDecor } from './BasketballDecor';

import styles from './UnderDevelopment.module.scss';

type Props = {
  backgroundImage?: Media | string | null;
  ballImage?: Media | string | null;
  blocks?: Page['underDevelopmentBlocks'] | null;
  className?: string;
};

/** Placeholder for empty sections (News, FAQ, Coming soon, etc.). Same UI for `/under-development` and `/under-development/news` (optional path segments). */
export const UnderDevelopment = ({
  backgroundImage,
  ballImage,
  blocks,
  className,
}: Props) => {
  const t = useTranslations('under_development');

  return (
    <main
      className={clsx(styles.wrapper, backgroundImage && styles.hasCustomBg, className)}
    >
      {backgroundImage ? (
        <div aria-hidden className={styles.customBg}>
          <CMSMedia
            className={styles.customBgImg}
            fill
            priority
            resource={backgroundImage}
            size='100vw'
            withBlur={false}
          />
        </div>
      ) : null}
      <div aria-hidden className={styles.dotMap} />
      <div aria-hidden className={styles.vignette} />
      <Container>
        <div className={styles.inner}>
          <div className={styles.heroVisual}>
            <div className={styles.ballWrap}>
              {ballImage ? (
                <div className={styles.ballPhotoBox}>
                  <CMSMedia
                    fill
                    className={styles.ballPhoto}
                    priority
                    resource={ballImage}
                    size='(max-width: 768px) 72vw, 280px'
                    withBlur={false}
                  />
                </div>
              ) : (
                <BasketballDecor className={styles.ball} />
              )}
            </div>
          </div>
          <Text className={styles.title} tag='h1' type='h1'>
            {t('title')}
          </Text>
          {blocks?.length ? (
            <RenderBlocks blocks={blocks as never} mapper={unifiedBlocksMapper} />
          ) : (
            <Text className={styles.description} tag='p' type='p2'>
              {t('description')}
            </Text>
          )}
          <LocalizedLink className={styles.cta} href='/'>
            {t('cta')}
          </LocalizedLink>
        </div>
      </Container>
    </main>
  );
};
