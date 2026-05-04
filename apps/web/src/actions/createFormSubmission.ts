'use server';

import { getCmsBaseUrl } from '@/lib/cmsBaseUrl';
import type { FormSubmission } from '@monorepo/cms/src/payload-types';

export type SendFormResult =
  | { doc: unknown; ok: true }
  | { message: string; ok: false; title: string };

type CmsErrorShape = { data?: { title?: string | null } | null; message?: string | null };
type CmsFormSubmissionResponse = {
  doc?: unknown;
  errors?: CmsErrorShape[] | null;
  message?: string | null;
};

function safeJsonParse<T>(raw: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function normalizeCmsError(
  data: CmsFormSubmissionResponse | null,
  fallbackTitle: string,
  fallbackMessage: string,
): { title: string; message: string } {
  const first = data?.errors?.[0];
  const title = first?.data?.title || first?.message || fallbackTitle;
  const message = first?.message || data?.message || fallbackMessage;
  return { message, title };
}

export const sendForm = async ({
  form,
  submissionData,
}: {
  form: string | number;
  submissionData: FormSubmission['submissionData'];
}): Promise<SendFormResult> => {
  let cmsBase: string;
  try {
    cmsBase = getCmsBaseUrl();
  } catch {
    return {
      message: 'Set NEXT_PUBLIC_CMS_URL in the web app environment (Payload origin, e.g. http://localhost:3001).',
      ok: false,
      title: 'Configuration error',
    };
  }

  const formId = String(form);

  const res = await fetch(`${cmsBase}/api/form-submissions`, {
    body: JSON.stringify({
      form: formId,
      submissionData: submissionData.map((row) => ({
        field: row.field,
        value: !row.value ? '' : String(row.value),
      })),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const rawText = await res.text();
  const data = safeJsonParse<CmsFormSubmissionResponse>(rawText);

  if (!res.ok) {
    const fallbackMessage = data?.message || rawText.slice(0, 280) || `HTTP ${res.status}`;
    const err = normalizeCmsError(data, 'Error', fallbackMessage);
    return { ...err, ok: false };
  }

  return { doc: data?.doc, ok: true };
};
