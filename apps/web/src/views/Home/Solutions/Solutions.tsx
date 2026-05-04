import React from 'react';
import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';
import { clampPctCss, clampPxCss } from '@/utils/clampCss';
import type { StyleWithVars } from '@/utils/styleVars';
import type { SolutionsBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './Solutions.module.scss';

const ratioToCss = (ratio?: string | null): string | undefined => {
  if (!ratio || ratio === 'auto') return undefined;
  const parts = ratio.split(':').map((x) => Number(x));
  if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) return undefined;
  return `${parts[0]} / ${parts[1]}`;
};

function CardCopy({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <>
      <div className={styles.cardNumber}>{number}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </>
  );
}

export const Solutions = ({ title, cards }: SolutionsBlockFields) => {
  const list = cards?.length ? cards : [];
  if (list.length === 0) return null;

  return (
    <section aria-label={title?.trim() || 'Key points'} className={styles.wrapper}>
      <Container>
        {title?.trim() ? (
          <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
            <Text className={styles.title} tag='h2' type='h2' color='text'>
              {title}
            </Text>
          </InViewAnimation>
        ) : null}

        <ul className={styles.rows}>
          {list.map((card, index) => {
            const textRight = (card.textPosition ?? 'left') === 'right';
            const cssRatio = ratioToCss(card.imageAspectRatio);
            const visualFg = card.foregroundImage ?? card.image;
            const visualBg = card.backgroundImage ?? null;
            const bgLayout = card.backgroundLayout;
            const fgLayout = card.imageLayout;

            const imageBlockStyle: StyleWithVars = {
              '--sol-bg-fit': bgLayout.bgObjectFit ?? undefined,
              '--sol-bg-pos': bgLayout.bgObjectPosition ?? undefined,
              '--sol-bg-off-x': clampPxCss(bgLayout.bgOffsetXPx),
              '--sol-bg-off-y': clampPxCss(bgLayout.bgOffsetYPx),
              '--sol-bg-off-x-pct': clampPctCss(bgLayout.bgOffsetXPercent),
              '--sol-bg-off-y-pct': clampPctCss(bgLayout.bgOffsetYPercent),

              '--sol-fg-max-w': clampPxCss(fgLayout.imageMaxWidthPx, { min: 0, max: 5000 }),
              '--sol-fg-max-h': clampPxCss(fgLayout.imageMaxHeightPx, { min: 0, max: 5000 }),
              '--sol-fg-fit': fgLayout.imageObjectFit ?? undefined,
              '--sol-fg-pos': fgLayout.imageObjectPosition ?? undefined,
              '--sol-fg-off-x': clampPxCss(fgLayout.imageOffsetXPx),
              '--sol-fg-off-y': clampPxCss(fgLayout.imageOffsetYPx),
              '--sol-fg-off-x-pct': clampPctCss(fgLayout.imageOffsetXPercent),
              '--sol-fg-off-y-pct': clampPctCss(fgLayout.imageOffsetYPercent),
            };

            return (
              <li key={card.id} className={styles.row}>
                <div className={styles.rowGrid}>
                  <div className={clsx(styles.textCol, textRight && styles.textColRight)}>
                    <InViewAnimation
                      className='InViewAnimation_animate'
                      effect='y'
                      translateAmount='medium'
                      delay={index * 0.05}
                    >
                      <article className={styles.copyCard}>
                        <CardCopy number={index + 1} description={card.description} title={card.title} />
                      </article>
                    </InViewAnimation>
                  </div>

                  <div className={clsx(styles.imageCol, textRight && styles.imageColLeft)}>
                    <InViewAnimation
                      className='InViewAnimation_animate'
                      effect='y'
                      translateAmount='medium'
                      delay={index * 0.05 + 0.05}
                    >
                      <div
                        className={clsx(styles.imageFrame, cssRatio && styles.imageFrameFixed)}
                        style={cssRatio ? ({ aspectRatio: cssRatio } as React.CSSProperties) : undefined}
                      >
                        <div className={styles.imageBlock} style={imageBlockStyle}>
                          {visualBg ? (
                            <div className={styles.bgMedia} aria-hidden>
                              <CMSMedia fill resource={visualBg} className={styles.imageBg} withBlur={false} />
                            </div>
                          ) : null}
                          {visualFg ? (
                            <div className={styles.fgMedia} aria-hidden>
                              <CMSMedia fill resource={visualFg} className={styles.imageFg} withBlur={false} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </InViewAnimation>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
};
