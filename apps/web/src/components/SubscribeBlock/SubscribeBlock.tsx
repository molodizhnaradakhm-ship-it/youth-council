'use client';

import { useEffect, useMemo, useState } from 'react';

import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { clampNumber } from '@/utils/clampCss';
import type { StyleWithVars } from '@/utils/styleVars';

import styles from './SubscribeBlock.module.scss';

type Props = {
  id?: string | null;
  image?: unknown;
  imageLayout?:
    | {
        imageMaxWidthPx?: number | null;
        imageMaxHeightPx?: number | null;
        imageOffsetXPx?: number | null;
        imageOffsetXPercent?: number | null;
        imageOffsetYPx?: number | null;
        imageOffsetYPercent?: number | null;
        imageObjectFit?: 'contain' | 'cover' | null;
        imageObjectPosition?: string | null;
      }
    | null;
  title?: string | null;
  description?: string | null;
  button?: { link?: any; icon?: unknown } | null;
  bonusesTitle?: string | null;
  bonuses?: { id?: string | null; text?: string | null }[] | null;
};

export function SubscribeBlock({
  id,
  image,
  imageLayout,
  title,
  description,
  button,
  bonusesTitle,
  bonuses,
}: Props) {
  const [visualLoaded, setVisualLoaded] = useState(false);
  const headingId = id ? `subscribe-block-title-${id}` : 'subscribe-block-title';

  const imageStableKey = useMemo(() => {
    if (image && typeof image === 'object' && image !== null && 'id' in image) {
      return String((image as { id?: unknown }).id ?? '');
    }
    if (typeof image === 'string' || typeof image === 'number') return String(image);
    return '';
  }, [image]);

  useEffect(() => {
    setVisualLoaded(false);
  }, [imageStableKey]);
  const titleText = title?.trim() ?? '';
  const descriptionText = description?.trim() ?? '';

  const buttonLink = button?.link;
  const buttonLabel = buttonLink?.label?.trim() ?? '';

  const list = (bonuses ?? [])
    .map((b, idx) => ({ id: b?.id ?? `bonus-${idx}`, text: b?.text?.trim() ?? '' }))
    .filter((b) => Boolean(b.text));

  if (!titleText && !descriptionText && !buttonLabel && list.length === 0 && !image) return null;

  const imgMaxW = clampNumber(imageLayout?.imageMaxWidthPx, { min: -2000, max: 2000, fallback: 520 }) ?? 520;
  const imgMaxH = clampNumber(imageLayout?.imageMaxHeightPx, { min: -2000, max: 2000, fallback: 520 }) ?? 520;
  const imgOffsetX = clampNumber(imageLayout?.imageOffsetXPx, { min: -2000, max: 2000, fallback: 0 }) ?? 0;
  const imgOffsetY = clampNumber(imageLayout?.imageOffsetYPx, { min: -2000, max: 2000, fallback: 0 }) ?? 0;
  const imgOffsetXPct = clampNumber(imageLayout?.imageOffsetXPercent, { min: -200, max: 200, fallback: 0 }) ?? 0;
  const imgOffsetYPct = clampNumber(imageLayout?.imageOffsetYPercent, { min: -200, max: 200, fallback: 0 }) ?? 0;
  const imgFit = imageLayout?.imageObjectFit === 'cover' ? 'cover' : 'contain';
  const imgPos = (imageLayout?.imageObjectPosition?.trim() || 'center') as string;

  const cardStyle: StyleWithVars =
    imageLayout
      ? ({
          '--right-image-max-w': `${Math.max(120, Math.min(2000, imgMaxW))}px`,
          '--right-image-max-h': `${Math.max(120, Math.min(2000, imgMaxH))}px`,
          '--right-image-offset-x': `${imgOffsetX}px`,
          '--right-image-offset-y': `${imgOffsetY}px`,
          '--right-image-offset-x-pct': `${imgOffsetXPct}%`,
          '--right-image-offset-y-pct': `${imgOffsetYPct}%`,
          '--right-image-fit': imgFit,
          '--right-image-pos': imgPos,
        })
      : ({} as StyleWithVars);

  return (
    <section className={styles.wrapper} aria-labelledby={headingId}>
      <Container wide>
        <div className={styles.card} style={cardStyle}>
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

            {buttonLabel && buttonLink ? (
              <InViewAnimation
                className='InViewAnimation_animate'
                effect='y'
                translateAmount='medium'
                delay={0.1}
              >
                <div className={styles.actions}>
                  <CMSLink {...buttonLink} className={styles.buttonLink}>
                    <span className={styles.button}>
                      {button?.icon ? (
                        <CMSMedia className={styles.buttonIcon} resource={button.icon as any} withBlur={false} />
                      ) : null}
                      <span className={styles.buttonLabel}>{buttonLabel}</span>
                    </span>
                  </CMSLink>
                </div>
              </InViewAnimation>
            ) : null}

            {bonusesTitle?.trim() || list.length ? (
              <InViewAnimation
                className='InViewAnimation_animate'
                effect='y'
                translateAmount='medium'
                delay={0.15}
              >
                <div className={styles.bonuses}>
                  {bonusesTitle?.trim() ? <p className={styles.bonusesTitle}>{bonusesTitle}</p> : null}
                  {list.length ? (
                    <ul className={styles.bonusesList}>
                      {list.map((b, idx) => (
                        <InViewAnimation
                          key={b.id}
                          className='InViewAnimation_animate'
                          effect='y'
                          translateAmount='small'
                          delay={0.02 * idx}
                        >
                          <li className={styles.bonusesItem}>
                            <span className={styles.bonusBullet} aria-hidden />
                            <span className={styles.bonusText}>{b.text}</span>
                          </li>
                        </InViewAnimation>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </InViewAnimation>
            ) : null}
          </div>

          {image ? (
            <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium' delay={0.2}>
              <div className={styles.visual} aria-hidden>
                {!visualLoaded ? <div className={styles.visualLoading} /> : null}
                <CMSMedia
                  className={styles.image}
                  loading='eager'
                  resource={image as any}
                  sizes='(max-width: 1023px) min(90vw, 520px), min(45vw, 520px)'
                  withBlur
                  onLoadingComplete={() => setVisualLoaded(true)}
                />
              </div>
            </InViewAnimation>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

