import type { CollectionBeforeChangeHook } from 'payload';
import { APIError } from 'payload';

import type { Form } from '@/payload-types';

export const preventDuplicateFormEmail: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return data;
  }

  const formId = typeof data.form === 'string' ? data.form : data.form?.id;

  if (!formId) {
    return data;
  }

  const form = await req.payload.findByID({
    collection: 'forms',
    depth: 0,
    id: formId,
    locale: req.locale,
  });

  if (!form || !(form as Form).preventDuplicateEmail) {
    return data;
  }

  const typedForm = form as Form;

  const emailFieldNames = (typedForm.fields || [])
    .filter((f) => f.blockType === 'email')
    .map((f) => f.name);

  if (emailFieldNames.length === 0) {
    return data;
  }

  const submittedEmail = data.submissionData
    ?.find((s: { field: string; value?: string | null }) =>
      emailFieldNames.includes(s.field) && s.value,
    )
    ?.value?.toLowerCase()
    .trim();

  if (!submittedEmail) {
    return data;
  }

  const { docs } = await req.payload.find({
    collection: 'form-submissions',
    depth: 0,
    limit: 5000,
    locale: req.locale,
    where: {
      form: {
        equals: formId,
      },
    },
  });

  const isDuplicate = docs.some((doc) =>
    doc.submissionData?.some(
      (row) =>
        emailFieldNames.includes(row.field) &&
        row.value?.toLowerCase().trim() === submittedEmail,
    ),
  );

  if (!isDuplicate) {
    return data;
  }

  const title = typedForm.duplicateEmailTitle?.trim() || 'Already subscribed';
  const message =
    typedForm.duplicateEmailMessage?.trim() ||
    'This email address is already subscribed to our updates. Please check your inbox or try a different email.';

  throw new APIError(message, 400, { title }, true);
};
