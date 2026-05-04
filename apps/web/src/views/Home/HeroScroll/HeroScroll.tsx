'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { ViewportDesktopOnly, ViewportMobileOnly } from '@/components/ViewportSplit/ViewportSplit';
import type { HeroScrollBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './HeroScroll.module.scss';

/* Crossfade + overlap: exiting fades out (z-index 1), entering fades in on top (z-index 2). */
const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? 36 : -36,
    zIndex: 2,
  }),
  center: {
    opacity: 1,
    y: 0,
    zIndex: 2,
  },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir >= 0 ? -28 : 28,
    zIndex: 1,
  }),
};

type Slide = NonNullable<HeroScrollBlockFields['slides']>[number];

/** Legacy CMS field `accentFrame` (removed); still read from API for old content. */
type SlideWithLegacyFrame = Slide & { accentFrame?: string | null };

function framePhrases(slide: Slide): string[] {
  const items = (
    ((slide as unknown as { accentFrameItems?: { text?: string | null }[] | null })?.accentFrameItems) ?? []
  )
    .map((it) => (it?.text ?? '').trim())
    .filter(Boolean);
  if (items.length > 0) return items;

  const legacy = String((slide as SlideWithLegacyFrame).accentFrame ?? '').trim();
  return legacy ? [legacy] : [];
}

function isImageLayout(slide: Slide): boolean {
  const layout = slide.layout ?? 'text';
  if (layout === 'image') return true;
  /* Legacy DB values. */
  return (layout as string) === 'imageCenter';
}

function slideTitleStyle(slide: Slide): 'gradient' | 'plain' {
  return slide.titleStyle === 'plain' ? 'plain' : 'gradient';
}

function slideImageFit(slide: Slide): 'cover' | 'contain' {
  return slide.imageFit ?? 'cover';
}

export const HeroScroll = ({ slides }: HeroScrollBlockFields) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const prevIndex = useRef(0);
  const [frameIndex, setFrameIndex] = useState(0);

  const list = slides?.length ? slides : [];
  const count = list.length;

  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end'],
    target: sectionRef,
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (reduceMotion || count < 2) return;
    const next = Math.min(Math.floor(latest * count), count - 1);
    if (next !== prevIndex.current) {
      setDirection(next > prevIndex.current ? 1 : -1);
      prevIndex.current = next;
    }
    setActiveIndex(next);
  });

  const active = useMemo(
    () => list[Math.min(activeIndex, Math.max(0, count - 1))],
    [list, activeIndex, count],
  );

  const frames = useMemo(() => (active ? framePhrases(active) : []), [active]);
  const frameCycleLen = Math.max(frames.length, 1);

  useEffect(() => {
    setFrameIndex(0);
  }, [active?.id, activeIndex]);

  useEffect(() => {
    if (reduceMotion) return;
    if (!active) return;
    if (isImageLayout(active)) return;
    if (frameCycleLen <= 1) return;
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % frameCycleLen);
    }, 3000);
    return () => window.clearInterval(id);
  }, [reduceMotion, active, frameCycleLen]);

  const transition = reduceMotion
    ? { duration: 0 }
    : {
        duration: 0.55,
        ease: [0.25, 0.1, 0.25, 1] as const,
      };

  const renderSlide = (slide: Slide, opts: { priorityImage: boolean }) => {
    const imageMode = isImageLayout(slide);
    // If an image is provided, allow showing it (split layout).
    const hasImage = Boolean(slide.image);
    const tStyle = slideTitleStyle(slide);
    const fit = slideImageFit(slide);

    const frameText =
      slide === active && frames.length > 0 ? frames[Math.min(frameIndex, frames.length - 1)] : undefined;
    const hasRotatingFrame = slide === active && frames.length > 1;

    const showAccentRow = !imageMode && (Boolean(slide.accent?.trim()) || Boolean(frameText));

    const titleText = slide.title?.trim() ?? '';
    const titleEl =
      !imageMode && titleText ? (
        <h1
          className={clsx(
            styles.title,
            tStyle === 'gradient' && styles.titleGradient,
            tStyle === 'plain' && styles.titlePlain,
          )}
        >
          {titleText}
        </h1>
      ) : null;

    const accentRow = showAccentRow ? (
      <div className={styles.accentRow}>
        {slide.accent?.trim() ? <p className={styles.accent}>{slide.accent}</p> : null}
        <ViewportMobileOnly>
          {frameText ? (
            <span
              key={hasRotatingFrame ? `m-${frameIndex}` : 'static-m'}
              className={clsx(styles.accentFrame, hasRotatingFrame && styles.accentFrameRotate)}
            >
              {frameText}
            </span>
          ) : null}
        </ViewportMobileOnly>
        <ViewportDesktopOnly>
          {frameText ? (
            <span
              key={hasRotatingFrame ? `d-${frameIndex}` : 'static-d'}
              className={clsx(styles.accentFrame, hasRotatingFrame && styles.accentFrameRotate)}
            >
              {frameText}
            </span>
          ) : null}
        </ViewportDesktopOnly>
      </div>
    ) : null;

    const copy = (
      <>
        {titleEl}
        {accentRow}
      </>
    );

    const imageClass = clsx(
      imageMode ? styles.imageHero : styles.image,
      fit === 'contain' && styles.imageFitContain,
      fit === 'cover' && styles.imageFitCover,
    );

    if (imageMode) {
      return (
        <div className={clsx(styles.inner, styles.innerStack)}>
          {hasImage ? (
            <div className={styles.visualCenter}>
              <CMSMedia
                className={imageClass}
                priority={opts.priorityImage}
                resource={slide.image ?? undefined}
              />
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <div
        className={clsx(
          styles.inner,
          !hasImage && styles.innerCopyOnly,
        )}
      >
        <div className={styles.copy}>
          {copy}
        </div>
        {hasImage ? (
          <div className={styles.visual}>
            <CMSMedia
              className={imageClass}
              priority={opts.priorityImage}
              resource={slide.image ?? undefined}
            />
          </div>
        ) : null}
      </div>
    );
  };

  if (count === 0) {
    return null;
  }

  if (reduceMotion || count < 2) {
    const first = list[0];

    return (
      <section className={styles.static}>
        <div className={styles.staticFade} />
        <Container wide>{renderSlide(first, { priorityImage: true })}</Container>
      </section>
    );
  }

  const canScrollDown = activeIndex < count - 1;
  const handleScrollDown = () => {
    const el = sectionRef.current;
    if (!el) return;
    const viewportH = window.innerHeight || 1;
    const rect = el.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollRange = Math.max(1, el.offsetHeight - viewportH);
    const nextIndex = Math.min(activeIndex + 1, count - 1);
    const targetProgress = (nextIndex + 0.01) / count;
    const targetY = sectionTop + targetProgress * scrollRange;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      aria-label='Hero'
      className={styles.hero}
      style={{ '--hero-slides': count } as CSSProperties}
    >
      <div className={styles.sticky}>
        <div className={styles.bottomFade} aria-hidden />
        {canScrollDown ? (
          <button
            type='button'
            className={styles.scrollDown}
            aria-label='Scroll to next slide'
            onClick={handleScrollDown}
          >
            <span className={styles.scrollDownIcon} aria-hidden />
          </button>
        ) : null}
        <Container className={styles.stickyContainer} wide>
          <div className={styles.slideStack}>
            <AnimatePresence custom={direction} initial={false} mode='sync'>
              <motion.div
                key={active?.id ?? activeIndex}
                animate='center'
                className={styles.slideLayer}
                custom={direction}
                exit='exit'
                initial='enter'
                transition={transition}
                variants={slideVariants}
              >
                <div className={styles.slideWrap}>
                  {active
                    ? renderSlide(active, { priorityImage: activeIndex === 0 })
                    : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </section>
  );
};
