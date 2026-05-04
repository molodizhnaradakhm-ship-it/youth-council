'use client';

import clsx from 'clsx';

import { Accordion } from '@/components/Accordion';
import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import { InViewAnimation } from '@/components/InViewAnimation';
import { Text } from '@/components/Text';

import styles from './Faq.module.scss';

export type FaqTone = 'light' | 'dark';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  icon?: unknown;
  iconSizePx?: number | null;
  title?: string;
  items: FaqItem[];
  footerTitle?: string | null;
  footerText?: string | null;
  tone?: FaqTone;
  headingId?: string;
  className?: string;
  withInViewAnimation?: boolean;
};

export function Faq({
  icon,
  iconSizePx,
  title,
  items,
  footerTitle,
  footerText,
  tone = 'light',
  headingId = 'faq-heading',
  className,
  withInViewAnimation = false,
}: Props) {
  const titleText = title?.trim() ?? '';
  const safeItems = items ?? [];

  if (!titleText && safeItems.length === 0) return null;

  const content = (
    <>
      {icon || titleText ? (
        <div className={styles.headingGroup}>
          {icon ? (
            <div className={styles.headingIcon} aria-hidden>
              <CMSMedia
                resource={icon as any}
                className={styles.headingIconImg}
                withBlur={false}
                style={
                  typeof iconSizePx === 'number' && !Number.isNaN(iconSizePx)
                    ? ({ ['--faq-heading-icon-size' as any]: `${iconSizePx}px` } as any)
                    : undefined
                }
              />
            </div>
          ) : null}
          {titleText ? (
            <Text className={styles.title} color='inherit' id={headingId} tag='h2' type='h2'>
              {titleText}
            </Text>
          ) : null}
        </div>
      ) : null}

      {safeItems.length > 0 ? (
        <div className={styles.faqListCard}>
          <Accordion
            className={styles.accordion}
            classNameItem={styles.faqItem}
            classNameTrigger={styles.trigger}
            defaultValue={safeItems[0]?.id}
            list={safeItems}
            renderContent={(item) => <p className={styles.answer}>{item.answer}</p>}
            renderTrigger={(item) => (
              <>
                <span className={styles.triggerInner}>
                  <span aria-hidden className={styles.icon} />
                  <Text className={styles.question} color='inherit' tag='span' type='p1'>
                    {item.question}
                  </Text>
                </span>
                <span aria-hidden className={styles.chevron} />
              </>
            )}
          />
        </div>
      ) : null}

      {(footerTitle?.trim() || footerText?.trim()) ? (
        <div className={styles.still}>
          {footerTitle?.trim() ? (
            <Text className={styles.stillTitle} color='inherit' tag='h3' type='h4'>
              {footerTitle}
            </Text>
          ) : null}
          {footerText?.trim() ? (
            <div className={styles.stillBody}>
              <Text color='inherit' tag='p' type='p2'>
                {footerText}
              </Text>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );

  return (
    <section
      className={clsx(styles.section, styles[tone], className)}
      aria-labelledby={headingId}
    >
      <Container>
        {withInViewAnimation ? (
          <InViewAnimation className='InViewAnimation_animate' effect='y' translateAmount='medium'>
            {content}
          </InViewAnimation>
        ) : (
          content
        )}
      </Container>
    </section>
  );
}

