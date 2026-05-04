'use server';

import { getGogymApiBase } from '@/lib/gogymApiBase';

import { normalizeApiMessage, normalizeApiTitle, safeJsonParse } from './apiError';

export type SubmitLandingFeedbackInput = {
  description: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type SubmitLandingFeedbackResult =
  | { message?: undefined; ok: true }
  | { message: string; ok: false; title: string };

export async function submitLandingFeedback(
  input: SubmitLandingFeedbackInput,
): Promise<SubmitLandingFeedbackResult> {
  const url = `${getGogymApiBase()}/v1/landing/feedbacks`;

  const phoneDigits = input.phone?.replace(/\D/g, '') ?? '';
  const body = {
    description: input.description.trim(),
    email: input.email.trim(),
    firstName: input.firstName?.trim() || undefined,
    lastName: input.lastName?.trim() || undefined,
    phone: phoneDigits.length ? phoneDigits : undefined,
  };

  const res = await fetch(url, {
    body: JSON.stringify(body),
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

  console.error('[submitLandingFeedback] request failed', {
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
