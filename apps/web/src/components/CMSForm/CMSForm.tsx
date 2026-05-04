'use client';

// import type { Form } from '@monorepo/cms';
// import { Text } from '../Text';
import { useMemo, useState } from 'react';
// import type { Form } from 'payload-types';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

// import { sendForm } from '@/actions/sendForm';
import { sendForm } from '@/actions/createFormSubmission';
import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import type { Form } from '@monorepo/cms/src/payload-types';

import { Button } from '../Button';
import { CheckboxGroup } from '../CheckboxGroup';
// import { createFormSubmission } from '@/actions/createFormSubmission';
// import { useGlobals } from '@/contexts/GlobalsContext';
// import { Link } from '@/utils/navigation';
import { Input } from '../Input';
import { Text } from '../Text';
// import { PhoneInput } from '../PhoneInput';
import { Textarea } from '../Textarea';

import styles from './CMSForm.module.scss';

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_PATTERN = /^\+?(\d{1,3})?[-. (]?(\d{3})[-. )]?(\d{3})[-. ]?(\d{4})$/;

const CMS_FORM_BLOCK_TYPE = {
  Text: 'text',
  Email: 'email',
  PhoneNumber: 'phone-number',
  Message: 'message',
  CheckboxGroup: 'checkboxGroup',
} as const;

type Props = {
  additionalField?: {
    field: string;
    value: string;
  };
  className?: string;
  isModal?: boolean;
  // setIsOpenConfirmationMessage: React.Dispatch<React.SetStateAction<boolean>>;
} & Form;

async function downloadReportFile(downloadReport: Props['downloadReport']) {
  if (downloadReport == null || typeof downloadReport !== 'object' || !downloadReport.url) return;

  const fileUrl = resolvePayloadMediaUrl(String(downloadReport.url));
  const filename = downloadReport.filename || 'report';

  // Try to download via blob for same-origin requests
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: direct link download (works for CORS-restricted files)
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const CMSForm = ({
  className,
  fields,
  id,
  submitButtonLabel,
  isModal,
  successMessage,
  downloadReport,
}: Props) => {
  const t = useTranslations('form');
  const [isSuccessSubmitted, setSuccessSubmitted] = useState(false);
  const defaultValues = useMemo(() => {
    return fields.reduce<Record<string, string | string[]>>((acc, field) => {
      acc[field.name] = field.blockType === CMS_FORM_BLOCK_TYPE.CheckboxGroup ? [] : '';
      return acc;
    }, {});
  }, [fields]);

  const {
    control,
    // formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<Record<string, string | string[]>>({
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    const submissionData = Object.entries(data).map(([field, value]) => ({
      field,
      value: Array.isArray(value) ? value.join(', ') : value,
    }));

    const result = await sendForm({ form: id, submissionData });

    if (!result.ok) {
      return;
    }

    setSuccessSubmitted(true);
    // setIsOpenConfirmationMessage(true);
    // setTimeout(() => setIsOpenConfirmationMessage(false), 3000);
    reset();

    try {
      await downloadReportFile(downloadReport);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  });

  const requiredRule = (isRequired: boolean) => ({
    message: t('required_filed'),
    value: isRequired,
  });

  const renderTextField = ({
    id,
    isRequired,
    label,
    placeholder,
    name,
  }: {
    id?: string | null;
    isRequired: boolean;
    label?: string | null;
    placeholder?: string | null;
    name: string;
  }) => (
    <Controller
      control={control}
      key={id ?? name}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <Input
          error={error}
          isRequired={isRequired}
          label={label ?? name}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          placeholder={placeholder ?? ''}
        />
      )}
      rules={{
        required: requiredRule(isRequired),
        minLength: {
          value: 10,
          message: 'Минимум 10 символов',
        },
        maxLength: {
          value: 1000,
          message: 'Максимум 1000 символов',
        },
      }}
    />
  );

  const renderEmailField = ({
    id,
    isRequired,
    label,
    placeholder,
    name,
  }: {
    id?: string | null;
    isRequired: boolean;
    label?: string | null;
    placeholder?: string | null;
    name: string;
  }) => (
    <Controller
      control={control}
      key={id ?? name}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <Input
          className={styles.email}
          error={error}
          isRequired={isRequired}
          label={label ?? name}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          type='email'
          placeholder={placeholder ?? ''}
        />
      )}
      rules={{
        pattern: {
          message: t('incorrect_email'),
          value: EMAIL_PATTERN,
        },
        required: requiredRule(isRequired),
      }}
    />
  );

  const renderPhoneNumberField = ({
    id,
    isRequired,
    label,
    placeholder,
    name,
  }: {
    id?: string | null;
    isRequired: boolean;
    label?: string | null;
    placeholder?: string | null;
    name: string;
  }) => (
    <Controller
      control={control}
      key={id ?? name}
      name={name}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <Input
          className={styles.email}
          error={error}
          isRequired={isRequired}
          label={label ?? name}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          type='tel'
          placeholder={placeholder ?? ''}
        />
      )}
      rules={{
        pattern: {
          message: t('incorrect_phone'),
          value: PHONE_PATTERN,
        },
        maxLength: {
          message: t('incorrect_phone'),
          value: 15,
        },
        minLength: {
          message: t('incorrect_phone'),
          value: 8,
        },
        required: requiredRule(isRequired),
      }}
    />
  );

  const renderMessageField = ({
    id,
    isRequired,
    label,
    placeholder,
    name,
  }: {
    id?: string | null;
    isRequired: boolean;
    label?: string | null;
    placeholder?: string | null;
    name: string;
  }) => (
    <Controller
      control={control}
      key={id ?? name}
      name={name}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { error } }) => (
        <Textarea
          className={styles.textarea}
          error={error}
          label={label ?? ''}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          placeholder={placeholder ?? ''}
        />
      )}
      rules={{
        required: requiredRule(isRequired),
      }}
    />
  );

  const renderCheckboxGroupField = ({
    id,
    isRequired,
    label,
    selectList,
    name,
  }: {
    id?: string | null;
    isRequired: boolean;
    label?: string | null;
    selectList: Array<{ name: string; id?: string | null }>;
    name: string;
  }) => (
    <Controller
      control={control}
      key={id ?? name}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CheckboxGroup
          label={(label ?? name) as string}
          error={error}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          options={selectList.map(({ name }) => ({ label: name, value: name }))}
        />
      )}
      rules={{
        required: requiredRule(isRequired),
      }}
    />
  );

  return (
    <>
      {isSuccessSubmitted ? (
        <Text type='p1'>{successMessage}</Text>
      ) : (
        <form className={clsx(styles.wrapper, className)} id='form' onSubmit={onSubmit}>
          <div className={styles.fields}>
            <div className={clsx(styles.fieldsWrapper, isModal && styles.isModal)}>
              {fields.map((field) =>
                match(field)
                  .with({ blockType: CMS_FORM_BLOCK_TYPE.Text }, renderTextField)
                  .with({ blockType: CMS_FORM_BLOCK_TYPE.Email }, renderEmailField)
                  .with(
                    { blockType: CMS_FORM_BLOCK_TYPE.PhoneNumber },
                    renderPhoneNumberField,
                  )
                  .with({ blockType: CMS_FORM_BLOCK_TYPE.Message }, renderMessageField)
                  .with(
                    { blockType: CMS_FORM_BLOCK_TYPE.CheckboxGroup },
                    renderCheckboxGroupField,
                  )
                  .exhaustive(),
              )}
            </div>
            <div className={styles.submitBtnWrapper}>
              <Button type='submit' violet className={styles.button} isHeader>
                {submitButtonLabel}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};
