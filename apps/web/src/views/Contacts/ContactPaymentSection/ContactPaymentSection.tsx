'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

import { CMSMedia } from '@/components/CMSMedia';
import RichText from '@/components/RichText';
import { hasLexicalContent } from '@/utils/hasLexicalContent';
import type { Contact, ContactsPaymentBlockFields } from '@monorepo/cms/src/payload-types';

import styles from './ContactPaymentSection.module.scss';

type PaymentCard = NonNullable<ContactsPaymentBlockFields['cards']>[number];

const PAYMENT_CARD_SPAN = {
  Full: 'full',
  Half: 'half',
} as const;

const PAYMENT_CARD_CONTENT_TYPE = {
  KV: 'kv',
} as const;

type PaymentCardSpan = (typeof PAYMENT_CARD_SPAN)[keyof typeof PAYMENT_CARD_SPAN];

function normalizeCardSpan(span: unknown): PaymentCardSpan {
  return span === PAYMENT_CARD_SPAN.Full ? PAYMENT_CARD_SPAN.Full : PAYMENT_CARD_SPAN.Half;
}

function normalizeRows(rows: unknown): Array<{ key?: string | null; value?: string | null }> {
  return Array.isArray(rows) ? (rows as Array<{ key?: string | null; value?: string | null }>) : [];
}

function PaymentInfoCard({ card, idx }: { card: PaymentCard; idx: number }) {
  const title = (card.title ?? '').trim();
  const span = normalizeCardSpan(card.span);
  const isKV = (card.contentType ?? PAYMENT_CARD_CONTENT_TYPE.KV) === PAYMENT_CARD_CONTENT_TYPE.KV;
  const rows = normalizeRows(card.rows);

  const hasKV = isKV && rows.length > 0;
  const hasRich = !isKV && hasLexicalContent(card.body as any);

  if (!hasKV && !hasRich) return null;

  const key = `${idx}-${title}`;

  return (
    <div key={key} className={clsx(styles.col, span === PAYMENT_CARD_SPAN.Full && styles.colFull)}>
      {title ? (
        <p className={styles.cardTitle}>
          {card.icon ? (
            <span className={styles.badgeIcon}>
              <CMSMedia resource={card.icon} />
            </span>
          ) : null}
          {title}
        </p>
      ) : null}

      {hasKV ? (
        <div className={styles.kvGrid}>
          {rows.map((r, rIdx) => {
            const k = (r?.key ?? '').trim();
            const v = (r?.value ?? '').trim();
            if (!k && !v) return null;
            return (
              <div key={`${rIdx}-${k}`} className={styles.kvItem}>
                {k ? <p className={styles.kvKey}>{k}</p> : null}
                {v ? <p className={styles.kvValue}>{v}</p> : null}
              </div>
            );
          })}
        </div>
      ) : (
        <RichText className={styles.rich} content={card.body as Record<string, unknown>} textColor='text' />
      )}
    </div>
  );
}

type Props = {
  className?: string;
  contacts?: Contact | null;
  headingOverride?: string | null;
  intlTitleOverride?: string | null;
  localTitleOverride?: string | null;
  cards?: PaymentCard[] | null;
};

export const ContactPaymentSection = ({
  className,
  contacts,
  headingOverride,
  intlTitleOverride,
  localTitleOverride,
  cards,
}: Props) => {
  const t = useTranslations('contacts');
  const local = hasLexicalContent(contacts?.paymentLocal);
  const intl = hasLexicalContent(contacts?.paymentInternational);

  const hasCards = Array.isArray(cards) && cards.length > 0;

  if (!hasCards && !local && !intl) {
    return null;
  }

  return (
    <section aria-labelledby='payment-info-heading' className={clsx(styles.root, className)}>
      <h2 className={styles.paymentHeading} id='payment-info-heading'>
        {(headingOverride ?? '').trim() || t('payment_heading')}
      </h2>
      <div className={styles.grid}>
        {hasCards
          ? cards!.map((card, idx) => {
              return <PaymentInfoCard key={card.id ?? `${idx}`} card={card} idx={idx} />;
            })
          : null}

        {!hasCards && local ? (
          <div className={styles.col}>
            <p className={styles.colTitle}>{(localTitleOverride ?? '').trim() || t('payment_column_local')}</p>
            <RichText className={styles.rich} content={contacts!.paymentLocal!} textColor='text' />
          </div>
        ) : null}
        {!hasCards && intl ? (
          <div className={styles.col}>
            <p className={styles.colTitle}>{(intlTitleOverride ?? '').trim() || t('payment_column_international')}</p>
            <RichText
              className={styles.rich}
              content={contacts!.paymentInternational!}
              textColor='text'
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};
