'use client';

import type { CSSProperties } from 'react';
import clsx from 'clsx';

import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import { aspectRatioTokenToCss } from '@/utils/aspectRatioTokenToCss';
import { cssUrl } from '@/utils/cssUrl';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import type { Media } from '@monorepo/cms/src/payload-types';

import styles from './WithBackgroundFeaturesBento.module.scss';

const toneClass = {
  darkGreen: styles.toneDarkGreen,
  lightGreen: styles.toneLightGreen,
  grey: styles.toneGrey,
  // legacy
  charcoal: styles.toneCharcoal,
  purple: styles.tonePurple,
  orange: styles.toneOrange,
  dark: styles.toneDark,
} as const;

const heightPresetClass: Record<'compact' | 'medium' | 'tall' | 'extraTall' | 'square' | 'rect' | 'rectLong', string> = {
  compact: styles.cellHeightCompact,
  medium: styles.cellHeightMedium,
  tall: styles.cellHeightTall,
  extraTall: styles.cellHeightExtraTall,
  square: styles.cellHeightSquare,
  rect: styles.cellHeightRect,
  rectLong: styles.cellHeightRectLong,
};

/** Admin keys (bottom-center) → CSS background-position / object-position. */
function imagePositionToCss(pos: string): string {
  return pos.replace(/-/g, ' ');
}

function getMediaImageUrl(media: Media | null | undefined): string | null {
  if (!media || typeof media !== 'object') {
    return null;
  }
  const raw = media.url;
  if (!raw || String(raw).trim() === '') {
    return null;
  }
  const base = resolvePayloadMediaUrl(String(raw));
  const version =
    typeof media.updatedAt === 'string' && media.updatedAt.trim() !== '' ? media.updatedAt : '';
  return version ? `${base}${base.includes('?') ? '&' : '?'}v=${encodeURIComponent(version)}` : base;
}

export const WithBackgroundFeaturesBento = ({
  title,
  description,
  ...rest
}: any) => {
  const titleText = title?.trim() ?? '';
  const hasTitle = Boolean(titleText);
  const sectionLabelledBy = hasTitle ? 'with-bg-bento-heading' : undefined;

  return (
    <section
      className={styles.section}
      aria-label={!sectionLabelledBy ? 'Features' : undefined}
      aria-labelledby={sectionLabelledBy}
    >
      <Container>
        {hasTitle ? (
          <InViewAnimation className='InViewAnimation_animate' delay={0.06} effect='y' translateAmount='medium'>
            <Text className={styles.heading} color='text' id='with-bg-bento-heading' tag='h2' type='h2'>
              {titleText}
            </Text>
          </InViewAnimation>
        ) : null}
        {description?.trim() ? (
          <InViewAnimation
            className='InViewAnimation_animate'
            delay={hasTitle ? 0.1 : 0.06}
            effect='y'
            translateAmount='medium'
          >
            <Text className={styles.lead} color='text' tag='p' type='p1'>
              {description}
            </Text>
          </InViewAnimation>
        ) : null}
        <ul className={styles.grid}>
          {(() => {
            const cols = (rest as any)?.columns as any[] | undefined;
            return (Array.isArray(cols) ? cols : []).map((col, colIndex) => {
            const width = String(col?.width ?? '50');
            const colClass =
              width === '25'
                ? styles.col25
                : width === '75'
                  ? styles.col75
                  : width === '100'
                    ? styles.col100
                    : styles.col50;
            const cards = Array.isArray(col?.cards) ? col.cards : [];

            return (
              <li
                key={col?.id ?? `col-${colIndex}`}
                className={clsx(styles.column, colClass)}
              >
                {cards.map((card: any, cardIndex: number) => {
                  const tone = card.tone ?? 'charcoal';
                  const fitKey = card.imageObjectFit === 'cover' ? 'cover' : 'contain';
                  const posRaw = card.imageObjectPosition ?? 'bottom-center';
                  const posKey = typeof posRaw === 'string' && posRaw.length > 0 ? posRaw : 'bottom-center';
                  const widthPct = card.imageWidthPercent ?? '100';
                  const aspectRaw = card.imageAreaAspectRatio ?? 'auto';
                  const isMediaFill = aspectRaw === 'fill';
                  const aspectCss = aspectRatioTokenToCss(aspectRaw);
                  const hasFixedAspect = Boolean(aspectCss);
                  const imageLayer = card.imageLayer === 'cardBackground' ? 'cardBackground' : 'content';
                  const heightPreset = card.heightPreset ?? 'default';
                  const customPx =
                    typeof card.heightCustomPx === 'number' && Number.isFinite(card.heightCustomPx)
                      ? Math.min(1200, Math.max(80, Math.round(card.heightCustomPx)))
                      : null;
                  const heightClass =
                    heightPreset === 'custom' ||
                    heightPreset === 'default' ||
                    !heightPreset ||
                    !(heightPreset in heightPresetClass)
                      ? undefined
                      : heightPresetClass[heightPreset as keyof typeof heightPresetClass];
                  const heightStyle: CSSProperties | undefined =
                    heightPreset === 'custom' && customPx != null ? { minHeight: customPx } : undefined;
                  const cellCombinedStyle: CSSProperties | undefined = (() => {
                    if (imageLayer === 'cardBackground' && aspectCss) {
                      if (heightStyle) return { aspectRatio: aspectCss, ...heightStyle };
                      if (heightClass) return { aspectRatio: aspectCss };
                      return { aspectRatio: aspectCss, minHeight: 0 };
                    }
                    return heightStyle;
                  })();

                  const media = card.image as Media;
                  const imgUrl = getMediaImageUrl(media);
                  const altText =
                    typeof media === 'object' && media?.alt && String(media.alt).trim() !== ''
                      ? String(media.alt)
                      : 'Feature';

                  const bgStyle: CSSProperties | undefined = imgUrl
                    ? {
                        backgroundImage: cssUrl(imgUrl),
                        backgroundSize: fitKey === 'cover' ? 'cover' : 'contain',
                        backgroundPosition: imagePositionToCss(posKey),
                        backgroundRepeat: 'no-repeat',
                      }
                    : undefined;

                  const globalIndex = colIndex * 100 + cardIndex;

                  return (
                    <InViewAnimation
                      key={card?.id ?? `card-${colIndex}-${cardIndex}`}
                      className={clsx('InViewAnimation_animate', styles.cellOuter)}
                      effect='y'
                      translateAmount='medium'
                      delay={globalIndex * 0.02}
                      tagType='div'
                    >
                      <div
                        className={clsx(
                          styles.cell,
                          toneClass[tone as keyof typeof toneClass],
                          heightClass,
                          imageLayer === 'cardBackground' && styles.cellCardBg,
                        )}
                        style={cellCombinedStyle}
                      >
                        {card.image && imageLayer === 'cardBackground' && imgUrl ? (
                          <div className={styles.cellBgLayer} style={bgStyle} role='img' aria-label={altText} />
                        ) : null}
                        <div className={styles.cellText}>
                          {card.kicker?.trim() ? (
                            <Text className={styles.cellKicker} color='text' tag='p' type='p2'>
                              {card.kicker}
                            </Text>
                          ) : null}
                          {card.description?.trim() ? (
                            <Text className={styles.cellBody} color='inherit' tag='p' type='p2'>
                              {card.description}
                            </Text>
                          ) : null}
                        </div>
                        {card.image && imageLayer !== 'cardBackground' ? (
                          <div
                            className={clsx(
                              styles.cellMedia,
                              hasFixedAspect && styles.cellMediaFixedRatio,
                              isMediaFill && styles.cellMediaFillArea,
                            )}
                            style={aspectCss ? { aspectRatio: aspectCss } : undefined}
                          >
                            <div
                              className={styles.cellMediaFrame}
                              style={{ width: isMediaFill ? '100%' : `${widthPct}%` }}
                            >
                              {imgUrl ? (
                                <div className={styles.cellMediaBg} style={bgStyle} role='img' aria-label={altText} />
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </InViewAnimation>
                  );
                })}
              </li>
            );
            });
          })()}
        </ul>
      </Container>
    </section>
  );
};
