'use client';

import { useMemo, useRef } from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import type { CommentsBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './CommentsBlock.module.scss';

type CommentItem = CommentsBlockFields['stripes'][number]['comments'][number];

function CommentCard({ item }: { item: CommentItem }) {
  const title = (item as any).commentTitle?.trim?.() ? (item as any).commentTitle : '';
  const subtitle = (item as any).subtitle?.trim?.() ? (item as any).subtitle : '';

  return (
    <article className={styles.card}>
      {title ? <p className={styles.commentTitle}>{title}</p> : null}
      <div className={styles.cardDivider} aria-hidden />

      <div className={styles.cardFooter}>
        <div className={styles.cardFooterMeta}>
          <p className={styles.fullName}>{item.fullName}</p>
          {subtitle ? <p className={styles.nickname}>{subtitle}</p> : null}
        </div>
        <CMSMedia className={styles.avatar} resource={item.avatar} withBlur={false} />
      </div>
    </article>
  );
}

export const CommentsBlock = ({
  id,
  stripes,
  title,
  description,
  averageRating,
  reviewsLabel,
}: CommentsBlockFields & Record<string, any>) => {
  if (!stripes?.length) {
    return null;
  }

  const titleId = id ? `comments-block-title-${id}` : 'comments-block-title';
  const descriptionText = typeof description === 'string' ? description.trim() : '';
  const averageRatingSafe = typeof averageRating === 'number' ? averageRating : null;
  const reviewsLabelSafe = typeof reviewsLabel === 'string' && reviewsLabel.trim() ? reviewsLabel.trim() : 'reviews';

  const ratingClamped =
    typeof averageRatingSafe === 'number'
      ? Math.max(0, Math.min(5, Math.round(averageRatingSafe * 2) / 2))
      : null;

  const list = useMemo(() => {
    const out: CommentItem[] = [];
    (stripes ?? []).forEach((s) => {
      (s?.comments ?? []).forEach((c) => {
        if (c) out.push(c);
      });
    });
    return out;
  }, [stripes]);

  const previewAvatars = useMemo(() => list.slice(0, 4), [list]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const recompute = () => {
      // Show arrows only when content overflows horizontally.
      setShowControls(el.scrollWidth > el.clientWidth + 1);
    };

    recompute();

    const onResize = () => recompute();
    window.addEventListener('resize', onResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => recompute());
      ro.observe(el);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [list.length]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(`[data-comment-card='true']`);
    const step = (card?.offsetWidth ?? 360) + 20;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby={titleId} className={styles.wrapper}>
      <Container>
        <div className={styles.headerRow}>
          <div className={styles.leftMeta}>
            <div className={styles.metaRow}>
              {previewAvatars.length ? (
                <div className={styles.avatarStack} aria-label='People'>
                  {previewAvatars.map((c) => (
                    <span key={c.id ?? `${c.fullName}-${c.nickname}`} className={styles.avatarStackItem}>
                      <CMSMedia className={styles.avatarStackImg} resource={c.avatar} withBlur={false} />
                    </span>
                  ))}
                </div>
              ) : null}
              <div className={styles.ratingGroup} aria-label='Rating'>
                <div className={styles.ratingTopRow}>
                  <div className={styles.stars} aria-label='Stars'>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const n = ratingClamped ?? 0;
                      const fill = Math.max(0, Math.min(1, n - i));
                      const mod =
                        fill >= 1 ? styles.starFull : fill >= 0.5 ? styles.starHalf : styles.starEmpty;
                      return <span key={i} className={clsx(styles.star, mod)} aria-hidden />;
                    })}
                  </div>
                  {typeof ratingClamped === 'number' ? (
                    <p className={styles.ratingValue} aria-label='Average rating'>
                      {ratingClamped.toFixed(1)}
                    </p>
                  ) : null}
                </div>
                <p className={styles.reviewsCaption} aria-label='Reviews'>
                  {reviewsLabelSafe}
                </p>
              </div>
            </div>

            <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            </InViewAnimation>

            {descriptionText ? (
              <InViewAnimation
                className='InViewAnimation_animate'
                effect='y'
                translateAmount='medium'
                delay={0.05}
              >
                <p className={styles.blockDescription}>{descriptionText}</p>
              </InViewAnimation>
            ) : null}
          </div>

          {showControls ? (
            <div className={styles.controls} aria-label='Comments navigation'>
              <button
                type='button'
                className={clsx(styles.carouselArrow, styles.carouselArrowPrev, styles.carouselArrowInline)}
                aria-label='Scroll left'
                onClick={() => scrollByCards(-1)}
              >
                <span aria-hidden className={styles.carouselArrowIcon} />
              </button>
              <button
                type='button'
                className={clsx(styles.carouselArrow, styles.carouselArrowNext, styles.carouselArrowInline)}
                aria-label='Scroll right'
                onClick={() => scrollByCards(1)}
              >
                <span aria-hidden className={clsx(styles.carouselArrowIcon, styles.carouselArrowIconNext)} />
              </button>
            </div>
          ) : null}
        </div>

        {list.length ? (
          <div className={styles.carousel} role='region' aria-label='Reviews'>
            <div ref={scrollerRef} className={styles.carouselTrack}>
              {list.map((item, idx) => (
                <InViewAnimation
                  key={item.id ?? `${item.fullName}-${item.nickname}`}
                  className='InViewAnimation_animate'
                  effect='y'
                  translateAmount='medium'
                  delay={idx * 0.03}
                >
                  <div className={styles.carouselItem}>
                    <div data-comment-card='true'>
                      <CommentCard item={item} />
                    </div>
                  </div>
                </InViewAnimation>
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
};
