export function buildMailtoUrl({
  body,
  email,
  subject,
}: {
  body?: string;
  email: string;
  subject: string;
}): string {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return '';
  }

  const params = new URLSearchParams();
  params.set('subject', subject);
  if (body?.trim()) {
    params.set('body', body.trim());
  }

  return `mailto:${trimmedEmail}?${params.toString()}`;
}
