import type { CollectionAfterChangeHook, PayloadRequest } from 'payload';

import type { Form, FormSubmission } from '@/payload-types';

import { replaceDoubleCurlys } from '../utils/replaceDoubleCurlys';
import { serializeRichText } from '../utils/serializeRichText';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const sendEmails = (
  { emails }: Form,
  req: PayloadRequest,
  submissionData: FormSubmission['submissionData'],
) => {
  if (emails) {
    for (const {
      bcc: emailBCC,
      cc: emailCC,
      emailFrom,
      emailTo,
      message,
      replyTo: emailReplyTo,
      subject,
    } of emails) {
      const to = replaceDoubleCurlys(emailTo, submissionData);

      const cc = emailCC ? replaceDoubleCurlys(emailCC, submissionData) : '';

      const bcc = emailBCC ? replaceDoubleCurlys(emailBCC, submissionData) : '';

      const from = replaceDoubleCurlys(emailFrom, submissionData);

      const replyTo = replaceDoubleCurlys(emailReplyTo || emailFrom, submissionData);

      const serializedMesssage = serializeRichText(message.root.children, submissionData);

      req.payload.sendEmail({
        bcc,
        cc,
        from,
        html: `<div>${serializedMesssage}</div>`,
        replyTo,
        subject: replaceDoubleCurlys(subject, submissionData),
        to,
      });
    }
  }
};

const sendTelegramChats = (
  { telegramChatIds }: Form,
  submissionData: FormSubmission['submissionData'],
) => {
  if (telegramChatIds && TELEGRAM_BOT_TOKEN) {
    for (const { chatId, message } of telegramChatIds) {
      const text = replaceDoubleCurlys(message, submissionData);

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        body: JSON.stringify({
          chat_id: chatId,
          parse_mode: 'HTML',
          text,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
    }
  }
};

export const onFormSubmissionCreate: CollectionAfterChangeHook<FormSubmission> = ({
  doc,
  operation,
  req,
}) => {
  if (operation === 'update') return;
  const { form, submissionData } = doc;

  const formID = typeof form === 'string' ? form : form.id;

  req.payload.findByID({ collection: 'forms', id: formID }).then((form) => {
    sendEmails(form, req, submissionData);
    sendTelegramChats(form, submissionData);

    const kind = String((form as any)?.submissionKind ?? 'none');

    // If this is the Contact us form, also create a dedicated record with New/Read status.
    if (kind === 'contact') {
      const pick = (name: string) =>
        submissionData?.find((row) => String(row.field ?? '').trim().toLowerCase() === name)?.value ?? '';

      const name =
        String(pick('name') || pick('firstName') || pick('fullname') || '').trim();
      const email = String(pick('email') || '').trim();
      const phone = String(pick('phone') || pick('tel') || '').trim();
      const message = String(pick('message') || pick('comment') || '').trim();

      req.payload
        .create({
          collection: 'contact-submissions',
          data: {
            status: 'new',
            form: formID,
            formSubmission: doc.id,
            submissionData,
            name,
            email,
            phone,
            message,
          },
          overrideAccess: true,
          req,
        })
        .catch(() => null);
    }

    // If this is the Newsletter form, also create a dedicated record.
    if (kind === 'newsletter') {
      const pick = (name: string) =>
        submissionData?.find((row) => String(row.field ?? '').trim().toLowerCase() === name)?.value ?? '';

      const email = String(pick('email') || pick('mail') || '').trim();
      if (!email) return;

      req.payload
        .create({
          collection: 'newsletter-subscriptions',
          data: {
            status: 'new',
            form: formID,
            formSubmission: doc.id,
            submissionData,
            email,
          },
          overrideAccess: true,
          req,
        })
        .catch(() => null);
    }
  });
};
