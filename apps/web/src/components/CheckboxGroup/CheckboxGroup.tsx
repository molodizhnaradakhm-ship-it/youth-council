import * as React from 'react';
import type { ErrorOption } from 'react-hook-form';
import clsx from 'clsx';
import * as CheckboxRadix from '@radix-ui/react-checkbox';

import { CheckboxIcon } from '@/assets/react-icons/CheckboxIcon';

import { Text } from '../Text';

import styles from './CheckboxGroup.module.scss';

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  extra?: React.ReactNode; // optional extra content rendered under the option
};

type CheckboxGroupProps = {
  options: Option[];
  value?: string[];
  label?: string;
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  className?: string;
  showExtraWhen?: 'selected' | 'always';
  error?: ErrorOption;
};

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  className,
  showExtraWhen = 'selected',
  label,
  error,
}) => {
  const [internalValues, setInternalValues] = React.useState<string[]>(defaultValue ?? []);

  const currentValues = value ?? internalValues;

  const handleChange = (val: string, checked: boolean) => {
    const newValues = checked ? [...currentValues, val] : currentValues.filter((v) => v !== val);

    if (!value) setInternalValues(newValues);
    onChange?.(newValues);
  };

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <Text type='p3' tag='span' color='white' className={styles.labelGroup}>
          {label}
        </Text>
      )}
      <div className={styles.options}>
        {options.map(({ label, value, disabled, extra }) => {
          const checked = currentValues.includes(value);
          return (
            <div key={value} className={clsx(styles.groupItem)}>
              <label className={clsx(styles.item, disabled && styles.disabled)}>
                <CheckboxRadix.Root
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={(checked) => handleChange(value, checked === true)}
                  className={styles.checkbox}
                >
                  <CheckboxRadix.Indicator className={styles.indicator}>
                    <CheckboxIcon className={styles.icon} />
                  </CheckboxRadix.Indicator>
                </CheckboxRadix.Root>
                <Text type='p1' className={styles.label}>
                  {label}
                </Text>
              </label>
              {extra && (showExtraWhen === 'always' || checked) && (
                <div className={styles.extra}>{extra}</div>
              )}
            </div>
          );
        })}
      </div>
      {error?.message && (
        <Text tag='span' type='t1' className={styles.errorMessage}>
          {error.message}
        </Text>
      )}
    </div>
  );
};
