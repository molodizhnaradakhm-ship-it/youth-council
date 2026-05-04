'use client';

import { useMemo } from 'react';

import { Faq, type FaqItem } from '@/components/Faq/Faq';
import type { DarkSectionFaqBlockFields } from '@monorepo/cms/src/payload-types';

export const WithBackgroundSectionFaq = ({
  icon,
  iconSizePx,
  title,
  items,
  footerTitle,
  footerText,
}: DarkSectionFaqBlockFields) => {
  const titleText = title?.trim() ?? '';

  const list = useMemo<FaqItem[]>(() => {
    const raw = items ?? [];
    const out: FaqItem[] = [];
    raw.forEach((item, idx) => {
      const q = item.question?.trim();
      const a = item.answer?.trim();
      if (!q || !a) return;
      out.push({
        id: item.id ?? `with-bg-faq-${idx}`,
        question: q,
        answer: a,
      });
    });
    return out;
  }, [items]);

  if (!titleText && !list.length) {
    return null;
  }

  return (
    <Faq
      tone='light'
      headingId='with-bg-faq-heading'
      icon={icon}
      iconSizePx={iconSizePx}
      title={titleText}
      items={list}
      footerTitle={footerTitle}
      footerText={footerText}
      withInViewAnimation
    />
  );
};
