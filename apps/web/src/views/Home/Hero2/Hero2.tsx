'use client';

import clsx from 'clsx';

import type { CMSLinkType } from '@/components/CMSLink';
import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import RichText from '@/components/RichText';
import type { StyleWithVars } from '@/utils/styleVars';

import styles from './Hero2.module.scss';

type Props = {
  id?: string | null;
  layout?: 'textLeft' | 'textRight' | null;
  text?: {
    title?: string | null;
    description?: Record<string, any> | null;
    buttonsTitle?: string | null;
    buttons?: {
      id?: string | null;
      label?: string | null;
      link?: CMSLinkType | null;
      variant?: 'black' | 'white' | null;
      icon?: unknown;
    }[] | null;
    reviews?: {
      enabled?: boolean | null;
      averageRating?: number | null;
      label?: string | null;
      avatars?: { id?: string | null; image?: unknown }[] | null;
    } | null;
  } | null;
  image?: {
    media?: unknown;
    layout?: {
      maxWidthPx?: number | null;
      maxHeightPx?: number | null;
      objectFit?: 'contain' | 'cover' | null;
      objectPosition?: string | null;
      offsetXPx?: number | null;
      offsetYPx?: number | null;
      offsetXPercent?: number | null;
      offsetYPercent?: number | null;
    } | null;
  } | null;
};

function clampPx(n: number | null | undefined, fallback: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) return fallback;
  return Math.max(-2000, Math.min(2000, n));
}

function clampPct(n: number | null | undefined, fallback: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) return fallback;
  return Math.max(-200, Math.min(200, n));
}

/** Supports legacy Hero 2 data where `link` was only `{ url }` (no `type`). */
function normalizeHero2ButtonLink(link: unknown): CMSLinkType | null {
  if (!link || typeof link !== 'object') return null;
  const lo = link as Record<string, unknown>;
  const urlRaw = typeof lo.url === 'string' ? lo.url.trim() : '';
  const type = lo.type as CMSLinkType['type'] | undefined;
  if (!type && urlRaw) {
    return { type: 'custom', url: urlRaw, newTab: Boolean(lo.newTab) };
  }
  if (!type) return null;
  return {
    type,
    newTab: lo.newTab as boolean | null | undefined,
    reference: lo.reference as CMSLinkType['reference'],
    url: typeof lo.url === 'string' ? lo.url : (lo.url as null | undefined),
    form: lo.form as CMSLinkType['form'],
  };
}

function isHero2LinkActionable(l: CMSLinkType | null): boolean {
  if (!l?.type) return false;
  if (l.type === 'reference') return Boolean(l.reference);
  if (l.type === 'custom') return Boolean(String(l.url ?? '').trim());
  if (l.type === 'form') return Boolean(l.form);
  return false;
}

export function Hero2({
  id,
  layout,
  text,
  image,
}: Props) {
  const headingId = id ? `hero-2-title-${id}` : 'hero-2-title';

  const title = text?.title?.trim() ?? '';
  const description = text?.description ?? null;
  const buttonsTitle = text?.buttonsTitle?.trim() ?? '';
  const buttons = (text?.buttons ?? []).filter(Boolean);

  const reviewsEnabled = Boolean(text?.reviews?.enabled);
  const ratingRaw = text?.reviews?.averageRating;
  const rating =
    typeof ratingRaw === 'number'
      ? Math.max(0, Math.min(5, Math.round(ratingRaw * 2) / 2))
      : null;
  const reviewsLabel =
    typeof text?.reviews?.label === 'string' && text.reviews.label.trim()
      ? text.reviews.label.trim()
      : '';
  const avatars = (text?.reviews?.avatars ?? []).filter(Boolean).slice(0, 6);

  const img = image?.media;
  const imgLayout = image?.layout;
  const maxW = clampPx(imgLayout?.maxWidthPx, 640);
  const maxH = clampPx(imgLayout?.maxHeightPx, 640);
  const offX = clampPx(imgLayout?.offsetXPx, 0);
  const offY = clampPx(imgLayout?.offsetYPx, 0);
  const offXPct = clampPct(imgLayout?.offsetXPercent, 0);
  const offYPct = clampPct(imgLayout?.offsetYPercent, 0);
  const fit = imgLayout?.objectFit === 'cover' ? 'cover' : 'contain';
  const pos = (imgLayout?.objectPosition?.trim() || 'center') as string;

  const imageStyle: StyleWithVars = {
    '--hero2-img-max-w': `${Math.max(120, Math.min(2400, maxW))}px`,
    '--hero2-img-max-h': `${Math.max(120, Math.min(2400, maxH))}px`,
    '--hero2-img-off-x': `${offX}px`,
    '--hero2-img-off-y': `${offY}px`,
    '--hero2-img-off-x-pct': `${offXPct}%`,
    '--hero2-img-off-y-pct': `${offYPct}%`,
    '--hero2-img-fit': fit,
    '--hero2-img-pos': pos,
  };

  const swap = layout === 'textRight';

  if (!title && !description && buttons.length === 0 && !img) return null;

  return (
    <section className={styles.wrapper} aria-labelledby={headingId}>
      <Container wide>
        <div className={clsx(styles.grid, swap && styles.swap)}>
          <div className={styles.textCol}>
            {title ? (
              <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
                <h1 id={headingId} className={styles.title}>
                  {title}
                </h1>
              </InViewAnimation>
            ) : null}

            {description ? (
              <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium' delay={0.05}>
                <RichText className={styles.descriptionRich} content={description} />
              </InViewAnimation>
            ) : null}

            {buttons.length ? (
              <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium' delay={0.1}>
                <div className={styles.buttonsBlock}>
                  {buttonsTitle ? <p className={styles.buttonsTitle}>{buttonsTitle}</p> : null}
                  <div className={styles.buttonsRow}>
                    {buttons.map((b, idx) => {
                      const label = b?.label?.trim() ?? '';
                      const linkPayload = normalizeHero2ButtonLink(b?.link);
                      if (!label || !isHero2LinkActionable(linkPayload)) return null;
                      const variant = b?.variant === 'white' ? 'white' : 'black';
                      return (
                        <CMSLink
                          key={b?.id ?? `btn-${idx}`}
                          {...linkPayload}
                          className={clsx(
                            styles.button,
                            variant === 'white' ? styles.buttonWhite : styles.buttonBlack,
                          )}
                        >
                          {b?.icon ? (
                            <CMSMedia className={styles.buttonIcon} resource={b.icon as any} withBlur={false} />
                          ) : null}
                          <span className={styles.buttonLabel}>{label}</span>
                        </CMSLink>
                      );
                    })}
                  </div>
                </div>
              </InViewAnimation>
            ) : null}

            {reviewsEnabled ? (
              <InViewAnimation
                className={clsx('InViewAnimation_animate', styles.reviewsWrap)}
                effect='y'
                translateAmount='medium'
                delay={0.15}
              >
                <div className={styles.reviews}>
                  {avatars.length ? (
                    <div className={styles.avatarStack} aria-label='People'>
                      {avatars.map((a, idx) => (
                        <span key={a.id ?? `a-${idx}`} className={styles.avatarItem}>
                          <CMSMedia className={styles.avatarImg} resource={a.image as any} withBlur={false} />
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className={styles.ratingBlock} aria-label='Rating'>
                    <div className={styles.starsRow}>
                      <div className={styles.stars} aria-label='Stars'>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const n = rating ?? 0;
                          const fill = Math.max(0, Math.min(1, n - i));
                          const mod = fill >= 1 ? styles.starFull : fill >= 0.5 ? styles.starHalf : styles.starEmpty;
                          const key = `${headingId}-star-${i}`;
                          return (
                            <span key={i} className={clsx(styles.star, mod)} aria-hidden>
                              <svg viewBox='0 0 24 24' role='presentation' focusable='false'>
                                <defs>
                                  <clipPath id={`${key}-half`}>
                                    <rect x='0' y='0' width='12' height='24' />
                                  </clipPath>
                                </defs>

                                <path
                                  className={styles.starPathEmpty}
                                  d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
                                />

                                {fill >= 1 ? (
                                  <path
                                    className={styles.starPathFull}
                                    d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
                                  />
                                ) : fill >= 0.5 ? (
                                  <path
                                    className={styles.starPathFull}
                                    clipPath={`url(#${key}-half)`}
                                    d='M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
                                  />
                                ) : null}
                              </svg>
                            </span>
                          );
                        })}
                      </div>
                      {typeof rating === 'number' ? <span className={styles.ratingValue}>{rating.toFixed(1)}</span> : null}
                    </div>
                    {reviewsLabel ? <p className={styles.reviewsLabel}>{reviewsLabel}</p> : null}
                  </div>
                </div>
              </InViewAnimation>
            ) : null}
          </div>

          {img ? (
            <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium' delay={0.05}>
              <div className={styles.imageCol} style={imageStyle} aria-hidden>
                <div className={styles.imageFrame}>
                  <CMSMedia className={styles.image} resource={img as any} withBlur={false} />
                </div>
              </div>
            </InViewAnimation>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

