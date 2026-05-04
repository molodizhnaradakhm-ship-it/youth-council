'use server';

import { getGogymApiBase } from '@/lib/gogymApiBase';

import { normalizeApiMessage, normalizeApiTitle, safeJsonParse } from './apiError';

export type SubmitEmailSubscriptionResult =
  | { message?: undefined; ok: true }
  | { message: string; ok: false; title: string };

export async function submitEmailSubscription(email: string): Promise<SubmitEmailSubscriptionResult> {
  const trimmed = email.trim();
  if (!trimmed) {
    return { message: 'Email is required', ok: false, title: 'Error' };
  }

  const url = `${getGogymApiBase()}/v1/email-subscriptions`;

  const res = await fetch(url, {
    body: JSON.stringify({ email: trimmed }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (res.ok) {
    return { ok: true };
  }

  const rawText = await res.text();
  const data = safeJsonParse<{ error?: string | null; message?: string | string[] | null }>(rawText);
  const message = normalizeApiMessage(data, rawText, 'Request failed');
  const title = normalizeApiTitle(data, 'Error');

  console.error('[submitEmailSubscription] request failed', {
    url,
    status: res.status,
    message,
    rawTextPreview: rawText.trim().slice(0, 500),
  });

  return {
    message,
    ok: false,
    title,
  };
}
