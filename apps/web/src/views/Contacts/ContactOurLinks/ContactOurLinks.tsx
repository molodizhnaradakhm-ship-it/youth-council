'use client';

import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import type { ContactsOurLinksBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ContactOurLinks.module.scss';

type OurLinkCard = NonNullable<ContactsOurLinksBlockFields['cards']>[number];

type Props = {
  cards?: OurLinkCard[] | null;
  className?: string;
};

export const ContactOurLinks = ({ cards, className }: Props) => {
  const normalizedCards = (Array.isArray(cards) && cards.length > 0 ? cards : undefined) as
    | OurLinkCard[]
    | undefined;

  if (!normalizedCards?.length) {
    return null;
  }

  return (
    <section className={clsx(styles.root, className)}>
      <ul className={styles.cards}>
        {normalizedCards.map((item) => {
          // Some editors fill "Description" thinking it's the title; support both.
          const rawTitle = (item?.title as string | undefined) ?? '';
          const rawDescription = (item?.description as string | undefined) ?? '';

          const title = rawTitle.trim() || rawDescription.trim();
          const description = rawTitle.trim() ? rawDescription.trim() : '';
          const link = (item?.link as string | undefined)?.trim();
          const icon = item?.icon;

          if (!link) return null;

          return (
            <li key={item?.id ?? link} className={styles.cardItem}>
              <a className={styles.card} href={link} rel='noopener noreferrer' target='_blank'>
                {icon ? (
                  <div className={styles.cardIconBox}>
                    <CMSMedia className={styles.cardIcon} resource={icon} />
                  </div>
                ) : null}
                {title ? (
                  <p className={styles.cardTitle}>{title}</p>
                ) : null}
                {description ? (
                  <p className={styles.cardDescription}>{description}</p>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
