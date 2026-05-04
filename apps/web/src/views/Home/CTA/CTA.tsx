'use client';

import clsx from 'clsx';

import { CMSLink } from '@/components/CMSLink';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';

import styles from './CTA.module.scss';

type CTABlockFields = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  image?: unknown;
  buttons?: { id?: string | null; link?: any; icon?: unknown }[] | null;
};

export const CTA = ({ id, title, description, image, buttons }: CTABlockFields) => {
  const titleId = id ? `cta-block-title-${id}` : 'cta-block-title';
  const list = (buttons ?? []).filter((b) => b?.link?.label);

  return (
    <section aria-labelledby={titleId} className={styles.wrapper}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.copy}>
            {title?.trim() ? (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            ) : null}
            {description?.trim() ? <p className={styles.description}>{description}</p> : null}

            {list.length ? (
              <div className={styles.actions}>
                {list.slice(0, 2).map((b, idx) => (
                  <CMSLink key={b.id ?? b.link.label ?? `cta-${idx}`} {...b.link} className={styles.actionLink}>
                    <span className={clsx(styles.actionBtn, idx === 0 && styles.actionBtnPrimary)}>
                      {b.icon ? (
                        <CMSMedia className={styles.actionIcon} resource={b.icon as any} withBlur={false} />
                      ) : null}
                      <span className={styles.actionLabel}>{b.link.label}</span>
                    </span>
                  </CMSLink>
                ))}
              </div>
            ) : null}
          </div>

          {image ? (
            <div className={styles.visual} aria-hidden>
              <CMSMedia className={styles.image} resource={image as any} withBlur={false} />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
};

