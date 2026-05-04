import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ErrorOption } from 'react-hook-form';
import clsx from 'clsx';

import { Input } from '@/components/Input';

import styles from './Textarea.module.scss';

type Props = {
  error?: ErrorOption;
  isRequired?: boolean;
  label?: string;
  textareaClassName?: string;
} & ComponentPropsWithoutRef<'textarea'>;

const TextareaWithoutRef = (
  { className, error, isRequired, label, textareaClassName, ...props }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) => {
  return (
    <Input
      {...(props as Record<string, unknown>)}
      as='textarea'
      className={clsx(styles.wrapper, className)}
      error={error}
      inputClassName={clsx(styles.textarea, textareaClassName)}
      isRequired={isRequired}
      label={label}
      ref={ref}
    />
  );
};

export const Textarea = forwardRef(TextareaWithoutRef);
