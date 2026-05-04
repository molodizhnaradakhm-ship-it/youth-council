import type { ComponentProps, PropsWithChildren } from 'react';
import clsx from 'clsx';

import styles from './Text.module.scss';

type TextTag =
  | 'a'
  | 'article'
  | 'blockquote'
  | 'button'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'ol'
  | 'p'
  | 'span'
  | 'ul';

export type TextType =
  | 'button'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'd1'
  | 'd2'
  | 't1';

const textTypeTagMapper: Record<TextType, TextTag> = {
  button: 'span',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  p3: 'p',
  p2: 'p',
  p1: 'p',
  d1: 'p',
  d2: 'p',
  t1: 'p',
};

export type TextProps = {
  align?: 'center' | 'end' | 'start';
  className?: string;
  color?: 'error' | 'white' | 'text' | 'light-violet' | 'main-violet' | 'blue-23' | 'inherit';
  fontWeight?: '300' | '400' | '600';
  html?: string;
  tag?: TextTag;
  type?: TextType;
} & ComponentProps<'h1'>;

export const Text = ({
  align,
  children,
  className,
  color = 'text',
  fontWeight,
  html,
  tag,
  type,
  ...props
}: PropsWithChildren<TextProps>) => {
  const ComponentTag: TextTag =
    tag ?? textTypeTagMapper[type as keyof typeof textTypeTagMapper] ?? 'span';

  return (
    <ComponentTag
      {...(props as Record<string, unknown>)}
      className={clsx(
        styles.wrapper,
        type && styles[type],
        color && styles[`color-${color}`],
        align && styles[`align-${align}`],
        fontWeight && styles[`fontWeight-${fontWeight}`],
        className,
      )}
      {...(html && {
        dangerouslySetInnerHTML: {
          __html: html,
        },
      })}
    >
      {children}
    </ComponentTag>
  );
};
