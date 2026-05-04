'use client';

import type { ComponentPropsWithoutRef, ComponentType, CSSProperties, JSX,ReactNode } from 'react';
import React, { useRef } from 'react';
import clsx from 'clsx';
import { useInView } from 'framer-motion';

import styles from './InViewAnimation.module.scss';

const TRANSLATE_AMOUNT_KEY = {
  Char: 'char',
  Large: 'large',
  Max: 'max',
  Medium: 'medium',
  Small: 'small',
} as const;

const translateAmountValueMap = {
  [TRANSLATE_AMOUNT_KEY.Char]: 6,
  [TRANSLATE_AMOUNT_KEY.Large]: 30,
  [TRANSLATE_AMOUNT_KEY.Max]: 50,
  [TRANSLATE_AMOUNT_KEY.Medium]: 20,
  [TRANSLATE_AMOUNT_KEY.Small]: 10,
};

type Effects =
  | '-x'
  | '-x-y'
  | '-xy'
  | '-y'
  | 'fade'
  | 'x'
  | 'x-y'
  | 'xy'
  | 'y'
  | 'scale'
  | 'scaleOut';

type Props = {
  animateWords?: 'char' | boolean;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  effect?: Effects;
  elementProps?: ComponentPropsWithoutRef<'div'>;
  isOnce?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  tagType?: keyof JSX.IntrinsicElements;
  textIndexCoefficient?: number;
  threshold?: number;
  animateImage?: boolean;
  translateAmount?: 'large' | 'max' | 'medium' | 'small';
};

export const InViewAnimation = ({
  animateWords,
  children,
  className,
  delay = 0,
  duration = 1200,
  effect = 'fade',
  elementProps,
  isOnce = true,
  onClick,
  style,
  tagType,
  textIndexCoefficient = 0.1,
  threshold = 0,
  translateAmount,
  animateImage,
}: Props) => {
  const ref = useRef(null);

  /** `amount: 0.3` requires ~30% of the node to intersect — hero/fold content often stays “invisible” until a tiny scroll. Use `"some"` when any intersection counts (see PrivacyPolicy `threshold={0}` pattern). */
  const inViewAmount =
    animateImage || threshold === 0
      ? ('some' as const)
      : threshold >= 1
        ? ('all' as const)
        : threshold;

  const isInView = useInView(ref, { amount: inViewAmount, once: isOnce });

  const getTranslateAmountValueKey = () => {
    if (translateAmount) return translateAmount;
    if (animateWords === TRANSLATE_AMOUNT_KEY.Char) return TRANSLATE_AMOUNT_KEY.Char;

    return TRANSLATE_AMOUNT_KEY.Large;
  };

  const translateValue = `${translateAmountValueMap[getTranslateAmountValueKey()]}px`;

  const effects: Record<Effects, CSSProperties> = {
    '-x': {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translateX(-${translateValue})`,
    },
    '-x-y': {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translate(-${translateValue}, -30px)`,
    },
    '-xy': {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translate(-${translateValue}, 30px)`,
    },
    '-y': {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translateY(-${translateValue})`,
    },
    fade: {
      opacity: isInView ? 1 : 0.001,
    },
    x: {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translateX(${translateValue})`,
    },
    'x-y': {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translate(${translateValue}, -30px)`,
    },
    xy: {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translate(${translateValue}, ${translateValue})`,
    },
    y: {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? 'none' : `translateY(${translateValue})`,
    },
    scale: {
      opacity: isInView ? 1 : 0.001,
      transform: isInView
        ? `scaleY(1) translateY(0)`
        : `scaleY(1.5) translateY(-${translateValue})`,
    },
    scaleOut: {
      opacity: isInView ? 1 : 0.001,
      transform: isInView ? `scale(1)` : `scale(0)`,
    },
  };

  const getTag = () => {
    if (tagType) return tagType;
    if (animateWords) return 'span';

    return 'div';
  };

  const Component = getTag() as unknown as ComponentType<any>;

  if (animateWords && typeof children === 'string') {
    const componentProps = { className, ref, style, ...elementProps };

    return (
      <Component {...componentProps}>
        {children
          .replace(/<\/?[^>]+(>|$)/g, '')
          .split(animateWords === 'char' ? '' : ' ')
          .map((wordOrChar, index) => (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  wordOrChar === ' '
                    ? '&nbsp;'
                    : `${wordOrChar}${animateWords === 'char' ? '' : '&nbsp;'}`,
              }}
              key={index}
              style={{
                ...effects[effect],
                display: 'inline-block',
                transition: `transform ${duration}ms, opacity ${duration}ms`,
                transitionDelay: `${delay + index * textIndexCoefficient}s`,
                willChange: 'transform',
              }}
            />
          ))}
      </Component>
    );
  }

  const componentProps = {
    className: clsx(
      className,
      animateImage && styles.animateImage,
      isInView && styles.animateImageInView,
    ),
    onClick,
    ref,
    style: {
      ...effects[effect],
      transition: `transform ${duration}ms, opacity ${duration}ms`,
      transitionDelay: `${delay}s`,
      ...style,
    },
    ...elementProps,
  };

  return <Component {...componentProps}>{children}</Component>;
};
