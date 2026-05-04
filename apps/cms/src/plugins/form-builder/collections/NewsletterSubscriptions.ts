import type { CollectionAfterReadHook, CollectionConfig } from 'payload';

type Status = 'new' | 'read';

const markAsReadOnOpen: CollectionAfterReadHook = async ({ doc, req }) => {
  const anyReq = req as any;
  if (anyReq?.context?.__newsletterSubscriptionsMarkRead) return doc;
  if (!req.user) return doc;

  const status = (doc as any)?.status as Status | undefined;
  if (status !== 'new') return doc;

  try {
    anyReq.context = { ...(anyReq.context ?? {}), __newsletterSubscriptionsMarkRead: true };
    await req.payload.update({
      collection: 'newsletter-subscriptions',
      id: (doc as any).id,
      data: { status: 'read', readAt: new Date().toISOString() },
      overrideAccess: true,
      req,
    });
  } catch {
    // ignore
  }

  return doc;
};

export const NewsletterSubscriptions: CollectionConfig = {
  slug: 'newsletter-subscriptions',
  labels: {
    singular: 'Newsletter subscription',
    plural: 'Newsletter subscriptions',
  },
  admin: {
    group: 'Forms',
    useAsTitle: 'email',
    defaultColumns: ['status', 'createdAt', 'email'],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterRead: [markAsReadOnOpen],
  },
  fields: [
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'readAt',
      label: 'Read at',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (_data, siblingData) => Boolean(siblingData?.readAt),
      },
    },
    {
      name: 'formSubmission',
      label: 'Original form submission',
      type: 'relationship',
      relationTo: 'form-submissions',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'form',
      label: 'Form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'submissionData',
      label: 'Submission data',
      type: 'array',
      required: true,
      fields: [
        { name: 'field', label: 'Field', type: 'text', required: true },
        { name: 'value', label: 'Value', type: 'text' },
      ],
    },
    { name: 'email', label: 'Email', type: 'text', required: true, admin: { readOnly: true } },
  ],
};

