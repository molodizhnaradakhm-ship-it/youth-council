'use client';

import { useMemo } from 'react';

import { Faq, type FaqItem, type FaqTone } from '@/components/Faq';

type Props = {
  id?: string | null;
  tone?: FaqTone | null;
  icon?: unknown;
  iconSizePx?: number | null;
  title?: string | null;
  items?: { id?: string | null; question?: string | null; answer?: string | null }[] | null;
  footerTitle?: string | null;
  footerText?: string | null;
};

export function FaqBlock({ id, tone, icon, iconSizePx, title, items, footerTitle, footerText }: Props) {
  const list = useMemo<FaqItem[]>(() => {
    const raw = items ?? [];
    const out: FaqItem[] = [];
    raw.forEach((row, idx) => {
      const q = row?.question?.trim();
      const a = row?.answer?.trim();
      if (!q || !a) return;
      out.push({
        id: row.id ?? `faq-block-${idx}`,
        question: q,
        answer: a,
      });
    });
    return out;
  }, [items]);

  const safeTone: FaqTone = 'light';
  const headingId = id ? `faq-block-heading-${id}` : 'faq-block-heading';

  return (
    <Faq
      className={id ? `faq-block-${id}` : undefined}
      headingId={headingId}
      tone={safeTone}
      icon={icon}
      iconSizePx={iconSizePx}
      title={title ?? undefined}
      items={list}
      footerTitle={footerTitle}
      footerText={footerText}
    />
  );
}

