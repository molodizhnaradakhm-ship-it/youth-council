'use client';

import type { CSSProperties } from 'react';
import { useRef } from 'react';
import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';

import styles from './PeekInsideBlock.module.scss';

type Card = {
  id?: string | null;
  title?: string | null;
  image?: unknown;
  imagePosX?: number | null;
  imagePosY?: number | null;
};

type Props = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  cards?: Card[] | null;
};

function clampPercent(n: number | null | undefined, fallback: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, n));
}

function scrollByCard(trackEl: HTMLDivElement | null, dir: -1 | 1) {
  if (!trackEl) return;
  const card = trackEl.querySelector<HTMLElement>(`[data-peek-card='true']`);
  const gap = 16;
  const step = (card?.offsetWidth ?? 320) + gap;
  trackEl.scrollBy({ left: step * dir, behavior: 'smooth' });
}

export function PeekInsideBlock({ id, title, description, cards }: Props) {
  const headingId = id ? `peek-inside-title-${id}` : 'peek-inside-title';
  const titleText = title?.trim() ?? '';
  const descriptionText = description?.trim() ?? '';
  const list = (cards ?? []).filter(Boolean);

  const trackRef = useRef<HTMLDivElement>(null);

  if (!titleText && !descriptionText && list.length === 0) return null;

  return (
    <section className={styles.wrapper} aria-labelledby={headingId}>
      <Container wide>
        <div className={styles.header}>
          <div className={styles.copy}>
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
          </div>

          <div className={styles.arrows}>
            <button
              type='button'
              className={styles.arrowBtn}
              aria-label='Previous'
              onClick={() => scrollByCard(trackRef.current, -1)}
            >
              <span aria-hidden className={styles.arrowIcon} />
            </button>
            <button
              type='button'
              className={styles.arrowBtn}
              aria-label='Next'
              onClick={() => scrollByCard(trackRef.current, 1)}
            >
              <span aria-hidden className={clsx(styles.arrowIcon, styles.arrowIconNext)} />
            </button>
          </div>
        </div>

        {list.length ? (
          <div ref={trackRef} className={styles.track} role='region' aria-label='Peek inside slider'>
            {list.map((c, idx) => {
              const cardTitle = c.title?.trim() ?? '';
              const x = clampPercent(c.imagePosX, 50);
              const y = clampPercent(c.imagePosY, 50);
              const style = {
                // Move image via translate relative to centered default.
                ['--img-shift-x' as any]: `${x - 50}%`,
                ['--img-shift-y' as any]: `${y - 50}%`,
              } as CSSProperties;

              return (
                <InViewAnimation
                  key={c.id ?? `peek-card-${idx}`}
                  className='InViewAnimation_animate'
                  effect='y'
                  translateAmount='medium'
                  delay={idx * 0.05}
                >
                  <article className={styles.card} style={style} data-peek-card='true'>
                    {cardTitle ? <h3 className={styles.cardTitle}>{cardTitle}</h3> : null}
                    {c.image ? (
                      <div className={styles.cardImageWrap} aria-hidden>
                        <div className={styles.cardImageFrame}>
                          <CMSMedia
                            className={styles.cardImage}
                            resource={c.image as any}
                            size='(max-width: 1023px) min(340px, 82vw), 360px'
                            style={{
                              width: 'auto',
                              maxWidth: '100%',
                              height: 'auto',
                              maxHeight: '100%',
                            }}
                            withBlur={false}
                          />
                        </div>
                      </div>
                    ) : null}
                  </article>
                </InViewAnimation>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

