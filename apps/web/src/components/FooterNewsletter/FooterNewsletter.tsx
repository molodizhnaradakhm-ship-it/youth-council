'use client';

import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { sendForm } from '@/actions/createFormSubmission';
import { submitEmailSubscription } from '@/actions/submitEmailSubscription';
import type { Form } from '@monorepo/cms/src/payload-types';

import styles from './FooterNewsletter.module.scss';

type Props = {
  className?: string;
  form: Form;
  title?: string | null;
};

/** Footer email capture: saves to Payload via form builder, then syncs to GoGym `email-subscriptions` API. */
export const FooterNewsletter = ({ className, form, title }: Props) => {
  const t = useTranslations('footer');

  const emailField = form.fields.find((f) => f.blockType === 'email');

  const { control, handleSubmit, reset } = useForm<Record<string, string>>({
    defaultValues: emailField ? { [emailField.name]: '' } : {},
  });

  if (!emailField) {
    return null;
  }

  const onSubmit = handleSubmit(async (data) => {
    const submissionData = Object.entries(data).map(([field, value]) => ({
      field,
      value,
    }));

    const result = await sendForm({
      form: form.id,
      submissionData,
    });

    if (!result.ok) {
      toast.error(result.title, {
        description: result.message,
        position: 'bottom-right',
      });
      return;
    }

    const email = String(data[emailField.name] ?? '').trim();
    if (email) {
      const api = await submitEmailSubscription(email);
      if (!api.ok) {
        console.warn('[FooterNewsletter] submitEmailSubscription failed', {
          email,
          message: api.message,
          api,
        });
        toast.warning(t('subscription_api_unavailable'), {
          description: api.message,
          position: 'bottom-right',
        });
      }
    }

    reset();
    toast.success(t('subscription_success_title'), {
      description: form.successMessage ?? undefined,
      position: 'bottom-right',
    });
  });

  const heading = title?.trim() || '';

  return (
    <div className={clsx(styles.wrapper, className)}>
      {heading ? <p className={styles.heading}>{heading}</p> : null}
      <form className={styles.form} noValidate onSubmit={onSubmit}>
        <Controller
          control={control}
          name={emailField.name}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div className={styles.field}>
              <input
                autoComplete='email'
                className={clsx(styles.input, error && styles.inputError)}
                onChange={onChange}
                placeholder={emailField.placeholder ?? 'Your Email'}
                type='email'
                value={value}
              />
              {error?.message ? (
                <span className={styles.fieldError} role='alert'>
                  {error.message}
                </span>
              ) : null}
            </div>
          )}
          rules={{
            pattern: {
              message: t('email_invalid'),
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            },
            required: {
              message: t('email_invalid'),
              value: true,
            },
          }}
        />
        <button className={styles.submit} type='submit'>
          {form.submitButtonLabel}
        </button>
      </form>
    </div>
  );
};
