'use client';

import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { clampNumber } from '@/utils/clampCss';
import { cssUrl } from '@/utils/cssUrl';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import type { StyleWithVars } from '@/utils/styleVars';
import type { ChallengesBlockFields, Media } from '@monorepo/cms/src/payload-types';

import styles from './ChallengesBlock.module.scss';

function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object' || !('url' in media)) return null;
  const raw = (media as Media).url;
  if (typeof raw !== 'string' || !raw.trim()) return null;
  return resolvePayloadMediaUrl(raw);
}

export function ChallengesBlock({ id, title, description, cards }: ChallengesBlockFields) {
  const headingId = id ? `challenges-title-${id}` : 'challenges-title';
  const titleText = title?.trim() ?? '';
  const descriptionText = description?.trim() ?? '';
  const list = cards?.length ? cards : [];

  if (!titleText && !descriptionText && list.length === 0) return null;

  return (
    <section className={styles.wrapper} aria-labelledby={headingId}>
      <Container wide>
        <header className={styles.header}>
          {titleText ? (
            <h2 id={headingId} className={styles.title}>
              {titleText}
            </h2>
          ) : null}
          {descriptionText ? <p className={styles.description}>{descriptionText}</p> : null}
        </header>

        {list.length ? (
          <div className={styles.grid}>
            {list.map((card, idx) => {
              const bg = card.backgroundImage;
              const bgUrl = mediaUrl(bg);
              const bgColor =
                typeof card.backgroundColor === 'string' && card.backgroundColor.trim()
                  ? card.backgroundColor.trim()
                  : undefined;
              const side = card.imageSide === 'left' ? 'left' : 'right';
              const x = clampNumber(card.imagePosX, { min: 0, max: 100, fallback: 50 }) ?? 50;
              const y = clampNumber(card.imagePosY, { min: 0, max: 100, fallback: 50 }) ?? 50;

              const style: StyleWithVars = {
                '--img-pos-x': `${x}%`,
                '--img-pos-y': `${y}%`,
                ...(bgColor ? { backgroundColor: bgColor } : null),
                ...(bgUrl ? { backgroundImage: cssUrl(bgUrl) } : null),
              };

              return (
                <article
                  key={card.id ?? `challenge-${idx}`}
                  className={clsx(styles.card, side === 'left' ? styles.cardImgLeft : styles.cardImgRight)}
                  style={style}
                >
                  <div className={styles.cardCopy}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    {card.description?.trim() ? <p className={styles.cardDescription}>{card.description}</p> : null}
                  </div>
                  <div className={styles.cardImageWrap} aria-hidden>
                    <CMSMedia className={styles.cardImage} resource={card.image} withBlur={false} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

