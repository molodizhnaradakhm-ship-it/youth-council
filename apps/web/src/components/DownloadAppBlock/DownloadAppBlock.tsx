'use client';

import clsx from 'clsx';

import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { clampNumber } from '@/utils/clampCss';
import type { StyleWithVars } from '@/utils/styleVars';

import styles from './DownloadAppBlock.module.scss';

type Props = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  buttonsTitle?: string | null;
  backgroundImage?: unknown;
  backgroundFit?: 'cover' | 'contain' | null;
  backgroundPosition?: { backgroundPosX?: number | null; backgroundPosY?: number | null } | null;
  image?: unknown;
  imageLayout?: {
    imageMaxWidthPx?: number | null;
    imageMaxHeightPx?: number | null;
    imageOffsetXPx?: number | null;
    imageOffsetXPercent?: number | null;
    imageOffsetYPx?: number | null;
    imageOffsetYPercent?: number | null;
  } | null;
  iosButton?: { link?: any; icon?: unknown; variant?: 'dark' | 'light' | null } | null;
  androidButton?: { link?: any; icon?: unknown; variant?: 'dark' | 'light' | null } | null;
};

export function DownloadAppBlock({
  id,
  title,
  description,
  buttonsTitle,
  backgroundImage,
  backgroundFit,
  backgroundPosition,
  image,
  imageLayout,
  iosButton,
  androidButton,
}: Props) {
  const headingId = id ? `download-app-title-${id}` : 'download-app-title';
  const titleText = title?.trim() ?? '';
  const descriptionText = description?.trim() ?? '';
  const buttonsTitleText = buttonsTitle?.trim() ?? '';

  const iosLink = iosButton?.link;
  const androidLink = androidButton?.link;

  const iosLabel = iosLink?.label?.trim() ?? '';
  const androidLabel = androidLink?.label?.trim() ?? '';

  if (!titleText && !descriptionText && !image && !backgroundImage && !iosLabel && !androidLabel) return null;

  const bgX = clampNumber(backgroundPosition?.backgroundPosX, { min: 0, max: 100, fallback: 50 }) ?? 50;
  const bgY = clampNumber(backgroundPosition?.backgroundPosY, { min: 0, max: 100, fallback: 50 }) ?? 50;
  const bgFit = backgroundFit === 'contain' ? 'contain' : 'cover';

  const imgMaxWn = clampNumber(imageLayout?.imageMaxWidthPx, { min: -2000, max: 2000, fallback: 560 }) ?? 560;
  const imgMaxHn = clampNumber(imageLayout?.imageMaxHeightPx, { min: -2000, max: 2000, fallback: 560 }) ?? 560;
  const imgOffsetXn = clampNumber(imageLayout?.imageOffsetXPx, { min: -2000, max: 2000, fallback: 0 }) ?? 0;
  const imgOffsetYn = clampNumber(imageLayout?.imageOffsetYPx, { min: -2000, max: 2000, fallback: 0 }) ?? 0;
  const imgOffsetXPctn = clampNumber(imageLayout?.imageOffsetXPercent, { min: -200, max: 200, fallback: 0 }) ?? 0;
  const imgOffsetYPctn = clampNumber(imageLayout?.imageOffsetYPercent, { min: -200, max: 200, fallback: 0 }) ?? 0;

  const cardStyle: StyleWithVars =
    backgroundImage || imageLayout || backgroundFit || backgroundPosition
      ? ({
          '--bg-pos-x': `${bgX}%`,
          '--bg-pos-y': `${bgY}%`,
          '--bg-fit': bgFit,
          '--right-image-max-w': `${Math.max(120, Math.min(2000, imgMaxWn))}px`,
          '--right-image-max-h': `${Math.max(120, Math.min(2000, imgMaxHn))}px`,
          '--right-image-offset-x': `${imgOffsetXn}px`,
          '--right-image-offset-y': `${imgOffsetYn}px`,
          '--right-image-offset-x-pct': `${imgOffsetXPctn}%`,
          '--right-image-offset-y-pct': `${imgOffsetYPctn}%`,
        })
      : ({} as StyleWithVars);

  return (
    <section className={styles.wrapper} aria-labelledby={headingId}>
      <Container wide>
        <div className={styles.card} style={cardStyle}>
          {backgroundImage ? (
            <div className={styles.bg} aria-hidden>
              <CMSMedia className={styles.bgImage} resource={backgroundImage as any} withBlur={false} />
            </div>
          ) : null}

          <div className={styles.content}>
            {titleText ? (
              <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
                <h2 id={headingId} className={styles.title}>
                  {titleText}
                </h2>
              </InViewAnimation>
            ) : null}
            {descriptionText ? (
              <InViewAnimation
                className='InViewAnimation_animate'
                effect='y'
                translateAmount='medium'
                delay={0.05}
              >
                <p className={styles.description}>{descriptionText}</p>
              </InViewAnimation>
            ) : null}

            {(iosLabel && iosLink) || (androidLabel && androidLink) ? (
              <InViewAnimation
                className='InViewAnimation_animate'
                effect='y'
                translateAmount='medium'
                delay={0.1}
              >
                <div className={styles.actionsWrap}>
                  {buttonsTitleText ? <p className={styles.actionsTitle}>{buttonsTitleText}</p> : null}
                  <div className={styles.actions}>
                {iosLabel && iosLink ? (
                  <CMSLink {...iosLink} className={styles.actionLink}>
                    <span
                      className={clsx(
                        styles.actionBtn,
                        (iosButton?.variant ?? 'dark') === 'dark' ? styles.actionBtnDark : styles.actionBtnLight,
                      )}
                    >
                      {iosButton?.icon ? (
                        <CMSMedia className={styles.actionIcon} resource={iosButton.icon as any} withBlur={false} />
                      ) : null}
                      <span className={styles.actionLabel}>{iosLabel}</span>
                    </span>
                  </CMSLink>
                ) : null}

                {androidLabel && androidLink ? (
                  <CMSLink {...androidLink} className={styles.actionLink}>
                    <span
                      className={clsx(
                        styles.actionBtn,
                        (androidButton?.variant ?? 'light') === 'dark' ? styles.actionBtnDark : styles.actionBtnLight,
                      )}
                    >
                      {androidButton?.icon ? (
                        <CMSMedia className={styles.actionIcon} resource={androidButton.icon as any} withBlur={false} />
                      ) : null}
                      <span className={styles.actionLabel}>{androidLabel}</span>
                    </span>
                  </CMSLink>
                ) : null}
                </div>
                </div>
              </InViewAnimation>
            ) : null}
          </div>

          {image ? (
            <div className={styles.visual} aria-hidden>
              <InViewAnimation
                className={clsx('InViewAnimation_animate', styles.visualAnimate)}
                delay={0.15}
                effect='y'
                translateAmount='medium'
              >
                <div className={styles.imageWrap}>
                  <CMSMedia className={styles.image} resource={image as any} withBlur={false} />
                </div>
              </InViewAnimation>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

