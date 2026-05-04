'use client';

import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';

import styles from './ForgetQuizzesBlock.module.scss';

type Tone = 'light' | 'colored';

type Card = {
  id?: string | null;
  tone?: Tone | null;
  icon?: unknown;
  title?: string | null;
  description?: string | null;
};

type Props = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  cards?: Card[] | null;
};

export function ForgetQuizzesBlock({ id, title, description, cards }: Props) {
  const headingId = id ? `forget-quizzes-title-${id}` : 'forget-quizzes-title';
  const titleText = title?.trim() ?? '';
  const descriptionText = description?.trim() ?? '';
  const list = (cards ?? []).filter(Boolean);

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
        </div>

        {list.length ? (
          <div className={styles.grid}>
            {list.map((c, idx) => {
              const cardTitle = c.title?.trim() ?? '';
              const cardDesc = c.description?.trim() ?? '';
              const safeTone: Tone = c.tone === 'light' ? 'light' : 'colored';
              return (
                <InViewAnimation
                  key={c.id ?? `fq-${idx}`}
                  className={clsx('InViewAnimation_animate', styles.gridCell)}
                  effect='y'
                  translateAmount='medium'
                  delay={idx * 0.05}
                >
                  <article className={clsx(styles.card, styles[`cardTone_${safeTone}`])}>
                    {c.icon ? (
                      <span className={styles.iconWrap} aria-hidden>
                        <CMSMedia className={styles.icon} resource={c.icon as any} withBlur={false} />
                      </span>
                    ) : null}
                    {cardTitle ? <h3 className={styles.cardTitle}>{cardTitle}</h3> : null}
                    {cardDesc ? <p className={styles.cardDescription}>{cardDesc}</p> : null}
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

