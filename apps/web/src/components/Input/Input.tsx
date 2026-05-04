import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';
import { forwardRef } from 'react';
import type { ErrorOption } from 'react-hook-form';
import clsx from 'clsx';

import { Text } from '@/components/Text';

import styles from './Input.module.scss';

export type InputProps = {
  as?: 'input' | 'textarea';
  error?: ErrorOption;
  inputClassName?: string;
  isRequired?: boolean;
  label?: string;
  placeholder?: string;
} & ComponentPropsWithoutRef<'input'>;

const InputWithoutRef = (
  {
    as: As = 'input',
    className,
    error,
    inputClassName,
    isRequired,
    label,
    value,
    placeholder,
    ...inputHTMLAttrs
  }: InputProps,

  ref: ForwardedRef<any>,
) => {
  return (
    <div
      className={clsx(
        styles.wrapper,
        className,
        isRequired && styles.isRequired,
        error && styles.isError,
      )}
    >
      {label && (
        <Text className={styles.label} tag='span' type='p3' color='white'>
          {label}
        </Text>
      )}
      <Text type='p2' tag='div'>
        <As
          className={clsx(
            styles.input,
            value && styles.hasValue,
            error && styles.isError,
            inputClassName,
          )}
          value={value}
          {...(inputHTMLAttrs as Record<string, unknown>)}
          ref={ref}
          placeholder={placeholder}
        />
      </Text>

      {error?.message && (
        <Text tag='span' type='t1' className={styles.errorMessage}>
          {error.message}
        </Text>
      )}
    </div>
  );
};

export const Input = forwardRef(InputWithoutRef);
