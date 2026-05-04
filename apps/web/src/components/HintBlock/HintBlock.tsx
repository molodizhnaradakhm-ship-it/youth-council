import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import { Container } from '@/components/Container';
import RichText from '@/components/RichText';
import { hasLexicalContent } from '@/utils/hasLexicalContent';
import type { HintBlockFields } from '@monorepo/cms/src/payload-types';

import { HintDefaultIcon, type HintVariant } from './HintDefaultIcon';

import styles from './HintBlock.module.scss';

export type HintBlockProps = HintBlockFields & {
  /** When true, skips inner Container (use on pages that already wrap blocks in Container). */
  insideContainer?: boolean;
};

const HINT_VARIANT = {
  Primary: 'primary',
  Info: 'info',
  Warning: 'warning',
  Success: 'success',
} as const satisfies Record<string, HintVariant>;

const HINT_VARIANT_ALIAS = {
  Tip: 'tip',
} as const;

function normalizeVariant(v: unknown): HintVariant {
  if (v === HINT_VARIANT_ALIAS.Tip) return HINT_VARIANT.Primary;
  if (v === HINT_VARIANT.Primary) return HINT_VARIANT.Primary;
  if (v === HINT_VARIANT.Info) return HINT_VARIANT.Info;
  if (v === HINT_VARIANT.Warning) return HINT_VARIANT.Warning;
  if (v === HINT_VARIANT.Success) return HINT_VARIANT.Success;
  return HINT_VARIANT.Primary;
}

export const HintBlock = ({
  variant,
  title,
  content,
  customIcon,
  insideContainer = false,
}: HintBlockProps) => {
  const v = normalizeVariant(variant);
  const titleFallback = title?.trim() ?? '';
  const hasTitle = Boolean(titleFallback);
  const hasBody = hasLexicalContent(content);

  if (!hasTitle && !hasBody) {
    return null;
  }

  const showCustomIcon = customIcon && typeof customIcon === 'object';

  const inner = (
    <aside className={clsx(styles.wrapper, styles[v])} role='note'>
      <div className={styles.iconWrap}>
        {showCustomIcon ? (
          <CMSMedia className={styles.customIcon} resource={customIcon} withBlur={false} />
        ) : (
          <HintDefaultIcon variant={v} />
        )}
      </div>
      <div className={styles.body}>
        {hasTitle ? <p className={clsx(styles.title, styles[`title_${v}`])}>{titleFallback}</p> : null}
        {hasBody ? (
          <RichText
            className={styles.text}
            content={content as Record<string, unknown>}
            textColor='inherit'
            textType='p2'
          />
        ) : null}
      </div>
    </aside>
  );

  return (
    <section aria-label={hasTitle ? titleFallback : 'Notice'} className={styles.section}>
      {insideContainer ? inner : <Container>{inner}</Container>}
    </section>
  );
};
