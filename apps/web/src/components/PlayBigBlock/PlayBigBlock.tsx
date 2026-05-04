'use client';

import type { CSSProperties } from 'react';

import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';

import styles from './PlayBigBlock.module.scss';

type Pack = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  avatar?: unknown;
  showButtonLink?: boolean | null;
  link?: any;
};

type Props = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  backgroundImage?: unknown;
  backgroundPosX?: number | null;
  backgroundPosY?: number | null;
  packs?: Pack[] | null;
};

function clampPercent(n: number | null | undefined, fallback: number) {
  if (typeof n !== 'number' || Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, n));
}

function PackCard({ pack }: { pack: Pack }) {
  const title = pack.title?.trim() ?? '';
  const description = pack.description?.trim() ?? '';
  const hasLink = pack.showButtonLink !== false && Boolean(pack.link?.label?.trim());

  return (
    <article className={styles.pack}>
      <div className={styles.packHeader}>
        <div className={styles.packTitleWrap}>
          {title ? <p className={styles.packTitle}>{title}</p> : null}
          {description ? <p className={styles.packSubtitle}>{description}</p> : null}
        </div>
      </div>

      <div className={styles.packBody}>
        {pack.avatar ? (
          <div className={styles.avatarWrap} aria-hidden>
            <CMSMedia className={styles.avatar} resource={pack.avatar as any} withBlur={false} />
          </div>
        ) : null}
      </div>

      {hasLink ? (
        <CMSLink {...pack.link} className={styles.buyLink}>
          <span className={styles.buyBtn}>{pack.link.label}</span>
        </CMSLink>
      ) : null}
    </article>
  );
}

export function PlayBigBlock({
  id,
  title,
  description,
  backgroundImage,
  backgroundPosX,
  backgroundPosY,
  packs,
}: Props) {
  const headingId = id ? `play-big-title-${id}` : 'play-big-title';
  const titleText = title?.trim() ?? '';
  const descriptionText = description?.trim() ?? '';

  const list = (packs ?? []).filter(Boolean);
  if (!titleText && !descriptionText && !backgroundImage && list.length === 0) return null;

  const bgX = clampPercent(backgroundPosX, 50);
  const bgY = clampPercent(backgroundPosY, 50);

  const bgStyle: CSSProperties =
    backgroundImage
      ? ({
          ['--bg-pos-x' as any]: `${bgX}%`,
          ['--bg-pos-y' as any]: `${bgY}%`,
        } as CSSProperties)
      : {};

  return (
    <section className={styles.wrapper} aria-labelledby={headingId}>
      <Container wide>
        <div className={styles.card} style={bgStyle}>
          {backgroundImage ? (
            <div className={styles.bg} aria-hidden>
              <CMSMedia className={styles.bgImage} resource={backgroundImage as any} withBlur={false} />
            </div>
          ) : null}

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
          </div>

          {list.length ? (
            <div className={styles.packs}>
              <div className={styles.packsTrack}>
                {list.map((p, idx) => (
                  <InViewAnimation
                    key={p.id ?? `${p.title ?? 'pack'}-${idx}`}
                    className='InViewAnimation_animate'
                    effect='y'
                    translateAmount='medium'
                    delay={idx * 0.05}
                  >
                    <div className={styles.packItem}>
                      <PackCard pack={p} />
                    </div>
                  </InViewAnimation>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

