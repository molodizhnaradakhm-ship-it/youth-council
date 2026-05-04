'use client';

import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { sendForm } from '@/actions/createFormSubmission';
import { submitLandingFeedback } from '@/actions/submitLandingFeedback';
import type { Form } from '@monorepo/cms/src/payload-types';

import styles from './ContactsForm.module.scss';

type Layout = {
  emailField?: string | null;
  messageField?: string | null;
  nameField?: string | null;
  phoneField?: string | null;
  surnameField?: string | null;
  termsField?: string | null;
} | null;

type FieldSlot = 'email' | 'message' | 'name' | 'other' | 'phone' | 'surname' | 'terms';

const DEFAULT_TERMS_FIELD_NAME = 'acceptTerms' as const;

const MIN_NAME_LENGTH = 3 as const;
const MAX_NAME_LENGTH = 50 as const;

/** API: phone matches ^[0-9]{1,15}$ */
const PHONE_DIGITS_REGEX = /^[0-9]{1,15}$/;
const MAX_PHONE_DIGITS = 15 as const;

const MIN_DESCRIPTION_LENGTH = 10 as const;

function slotFor(name: string, layout: Layout): FieldSlot {
  const n = name.trim();
  if (!n) return 'other';
  if (layout?.nameField?.trim() === n) return 'name';
  if (layout?.surnameField?.trim() === n) return 'surname';
  if (layout?.phoneField?.trim() === n) return 'phone';
  if (layout?.emailField?.trim() === n) return 'email';
  if (layout?.messageField?.trim() === n) return 'message';
  if (layout?.termsField?.trim() === n) return 'terms';
  return 'other';
}

/** Payload form-submissions очікують string у value; чекбокси дають boolean */
function valueToSubmissionString(value: unknown): string {
  if (value == null) {
    return '';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}

function valueForLayoutField(
  data: Record<string, unknown>,
  layout: Layout,
  key: 'emailField' | 'messageField' | 'nameField' | 'phoneField' | 'surnameField',
): string {
  const fieldName = layout?.[key]?.trim();
  if (!fieldName) {
    return '';
  }
  const v = data[fieldName];
  if (v === undefined || v === null) {
    return '';
  }

  return String(Array.isArray(v) ? v.join(', ') : v).trim();
}

export function ContactsForm({
  className,
  form,
  layout,
  terms,
}: {
  className?: string;
  form: Form;
  layout: Layout;
  terms?: {
    enabled?: boolean | null;
    fieldName?: string | null;
    href?: string | null;
    linkText?: string | null;
    text?: string | null;
  } | null;
}) {
  const t = useTranslations('form');
  const tContacts = useTranslations('contacts');

  const fields = form.fields ?? [];
  const termsFieldName = (terms?.fieldName ?? DEFAULT_TERMS_FIELD_NAME).trim() || DEFAULT_TERMS_FIELD_NAME;

  const {
    control,
    formState: { isSubmitting, isValid },
    handleSubmit,
    reset,
  } = useForm<Record<string, any>>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      ...fields.reduce<Record<string, any>>((acc, field) => {
        if (field.blockType === 'checkboxGroup') {
          acc[field.name] = [];
        } else {
          acc[field.name] = '';
        }
        return acc;
      }, {}),
      ...(terms?.enabled ? { [termsFieldName]: false } : {}),
    },
  });

  const requiredRule = (isRequired: boolean) => ({
    message: t('required_filed'),
    value: isRequired,
  });

  const validateNameOrSurname = (raw: unknown) => {
    const value = String(raw ?? '').trim();
    if (!value) return true;
    if (value.length < MIN_NAME_LENGTH) return t('name_min_length', { min: MIN_NAME_LENGTH });
    if (value.length > MAX_NAME_LENGTH) return t('name_max_length', { max: MAX_NAME_LENGTH });
    return true;
  };

  const validatePhoneDigits = (raw: unknown) => {
    const value = String(raw ?? '');
    if (!value) return true;
    return PHONE_DIGITS_REGEX.test(value) || t('incorrect_phone');
  };

  const validateDescription = (raw: unknown) => {
    const value = String(raw ?? '').trim();
    if (!value) return true;
    if (value.length < MIN_DESCRIPTION_LENGTH) return t('description_min_length', { min: MIN_DESCRIPTION_LENGTH });
    return true;
  };

  const onSubmit = handleSubmit(async (data) => {
    const formId = form.id;
    if (formId === undefined || formId === null || String(formId).trim() === '') {
      toast.error(tContacts('form_not_configured'));
      return;
    }

    const submissionData = Object.entries(data).map(([field, value]) => ({
      field,
      value: valueToSubmissionString(value),
    }));

    const result = await sendForm({ form: formId, submissionData });
    if (!result.ok) {
      toast.error(result.title, { description: result.message });
    }

    const api = await submitLandingFeedback({
      description: valueForLayoutField(data, layout, 'messageField'),
      email: valueForLayoutField(data, layout, 'emailField'),
      firstName: valueForLayoutField(data, layout, 'nameField') || undefined,
      lastName: valueForLayoutField(data, layout, 'surnameField') || undefined,
      phone: valueForLayoutField(data, layout, 'phoneField') || undefined,
    });
    

    if (!api.ok) {
      console.warn('[ContactsForm] submitLandingFeedback failed', {
        message: api.message,
        api,
      });
      toast.warning(tContacts('feedback_api_unavailable'), {
        description: api.message,
      });
    }

    reset();
    toast.success(tContacts('feedback_success_title'), {
      description: form.successMessage?.trim() || tContacts('feedback_success_body'),
    });
  });

  return (
    <form className={clsx(styles.root, className)} noValidate onSubmit={onSubmit}>
      <div className={styles.grid}>
        {fields.map((field) => {
          const slot = slotFor(field.name, layout);

          if (field.blockType === 'text') {
            return (
              <div key={field.id} className={clsx(styles.slot, styles[`slot-${slot}`])}>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: f, fieldState: { error } }) => (
                    <label className={styles.field}>
                      <span className={styles.label}>{field.label ?? field.name}</span>
                      <input
                        className={clsx(styles.input, error && styles.inputError)}
                        onBlur={f.onBlur}
                        onChange={f.onChange}
                        placeholder={field.placeholder ?? ''}
                        type='text'
                        value={f.value as string}
                      />
                      {error?.message ? (
                        <span className={styles.error} role='alert'>
                          {error.message}
                        </span>
                      ) : null}
                    </label>
                  )}
                  rules={
                    slot === 'name' || slot === 'surname'
                      ? {
                          required: requiredRule(field.isRequired),
                          validate: validateNameOrSurname,
                        }
                      : { required: requiredRule(field.isRequired) }
                  }
                />
              </div>
            );
          }

          if (field.blockType === 'email') {
            return (
              <div key={field.id} className={clsx(styles.slot, styles[`slot-${slot}`])}>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: f, fieldState: { error } }) => (
                    <label className={styles.field}>
                      <span className={styles.label}>{field.label ?? field.name}</span>
                      <input
                        autoComplete='email'
                        className={clsx(styles.input, error && styles.inputError)}
                        onBlur={(e) => {
                          const normalized = String(e.target.value ?? '')
                            .replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '')
                            .trim();
                          f.onChange(normalized);
                          f.onBlur();
                        }}
                        onChange={(e) => {
                          const next = String(e.target.value ?? '').replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
                          f.onChange(next);
                        }}
                        placeholder={field.placeholder ?? ''}
                        type='email'
                        value={f.value as string}
                      />
                      {error?.message ? (
                        <span className={styles.error} role='alert'>
                          {error.message}
                        </span>
                      ) : null}
                    </label>
                  )}
                  rules={{
                    validate: (raw: unknown) => {
                      const value = String(raw ?? '')
                        .replace(/[\s\u200B\u200C\u200D\uFEFF]/g, '')
                        .trim();
                      if (!value) return true; // let "required" handle empty state
                      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
                      return ok || t('incorrect_email');
                    },
                    required: requiredRule(field.isRequired),
                  }}
                />
              </div>
            );
          }

          if (field.blockType === 'phone-number') {
            return (
              <div key={field.id} className={clsx(styles.slot, styles[`slot-${slot}`])}>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: f, fieldState: { error } }) => (
                    <label className={styles.field}>
                      <span className={styles.label}>{field.label ?? field.name}</span>
                      <input
                        autoComplete='tel'
                        className={clsx(styles.input, error && styles.inputError)}
                        inputMode='numeric'
                        onBlur={f.onBlur}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, MAX_PHONE_DIGITS);
                          f.onChange(digits);
                        }}
                        pattern='[0-9]*'
                        placeholder={field.placeholder ?? ''}
                        type='tel'
                        value={f.value as string}
                      />
                      {error?.message ? (
                        <span className={styles.error} role='alert'>
                          {error.message}
                        </span>
                      ) : null}
                    </label>
                  )}
                  rules={{
                    validate: validatePhoneDigits,
                    required: requiredRule(field.isRequired),
                  }}
                />
              </div>
            );
          }

          if (field.blockType === 'message') {
            return (
              <div key={field.id} className={clsx(styles.slot, styles[`slot-${slot}`])}>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: f, fieldState: { error } }) => (
                    <label className={styles.field}>
                      <span className={styles.label}>{field.label ?? field.name}</span>
                      <textarea
                        className={clsx(styles.textarea, error && styles.inputError)}
                        onBlur={f.onBlur}
                        onChange={f.onChange}
                        placeholder={field.placeholder ?? ''}
                        rows={6}
                        value={f.value as string}
                      />
                      {error?.message ? (
                        <span className={styles.error} role='alert'>
                          {error.message}
                        </span>
                      ) : null}
                    </label>
                  )}
                  rules={{
                    required: requiredRule(field.isRequired),
                    validate: validateDescription,
                  }}
                />
              </div>
            );
          }

          if (field.blockType === 'checkboxGroup') {
            return (
              <div key={field.id} className={clsx(styles.slot, styles[`slot-${slot}`])}>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: f, fieldState: { error } }) => (
                    <div className={styles.terms}>
                      {field.selectList.map(({ name }) => {
                        const checked = Array.isArray(f.value) ? (f.value as string[]).includes(name) : false;
                        return (
                          <label key={name} className={styles.termsRow}>
                            <input
                              checked={checked}
                              className={styles.checkboxInput}
                              onChange={(e) => {
                                const prev = Array.isArray(f.value) ? (f.value as string[]) : [];
                                const next = e.target.checked
                                  ? Array.from(new Set([...prev, name]))
                                  : prev.filter((x) => x !== name);
                                f.onChange(next);
                              }}
                              type='checkbox'
                            />
                            <span aria-hidden className={styles.checkboxBox} />
                            <span className={styles.termsText}>{name}</span>
                          </label>
                        );
                      })}
                      {error?.message ? (
                        <span className={styles.error} role='alert'>
                          {error.message}
                        </span>
                      ) : null}
                    </div>
                  )}
                  rules={{ required: requiredRule(field.isRequired) }}
                />
              </div>
            );
          }

          return null;
        })}

        {terms?.enabled ? (
          <div className={clsx(styles.slot, styles['slot-terms'])}>
            <Controller
              control={control}
              name={termsFieldName}
              render={({ field, fieldState: { error } }) => (
                <div className={styles.terms}>
                  <label className={styles.termsRow}>
                    <input
                      ref={field.ref}
                      checked={Boolean(field.value)}
                      className={styles.checkboxInput}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.target.checked)}
                      type='checkbox'
                    />
                    <span aria-hidden className={styles.checkboxBox} />
                    <span className={styles.termsText}>
                      {terms.text ?? ''}
                      {terms.href ? (
                        <>
                          {' '}
                          <a className={styles.termsLink} href={terms.href}>
                            {terms.linkText ?? terms.href}
                          </a>
                        </>
                      ) : null}
                    </span>
                  </label>
                  {error?.message ? (
                    <span className={styles.error} role='alert'>
                      {error.message}
                    </span>
                  ) : null}
                </div>
              )}
              rules={{
                validate: (v) => v === true || t('required_filed'),
              }}
            />
          </div>
        ) : null}

        <div className={styles.submitRow}>
          <button
            aria-busy={isSubmitting}
            className={clsx(
              styles.submit,
              isValid && styles.submitReady,
              isSubmitting && styles.submitLoading,
            )}
            disabled={isSubmitting}
            type='submit'
          >
            <span className={styles.submitInner}>
              {isSubmitting ? <span aria-hidden className={styles.spinner} /> : null}
              {isSubmitting ? tContacts('sending') : form.submitButtonLabel}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}

