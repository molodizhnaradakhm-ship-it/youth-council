import type { CollectionAfterReadHook, CollectionConfig } from 'payload';

type ContactStatus = 'new' | 'read';

const markAsReadOnOpen: CollectionAfterReadHook = async ({ doc, req }) => {
  // Only mark when opened as a single document (admin details view / API by id).
  // Avoid infinite loops by setting a flag on the request.
  const anyReq = req as any;
  if (anyReq?.context?.__contactSubmissionsMarkRead) return doc;
  if (!req.user) return doc; // only staff/admin reads should mark as read

  const status = (doc as any)?.status as ContactStatus | undefined;
  if (status !== 'new') return doc;

  try {
    anyReq.context = { ...(anyReq.context ?? {}), __contactSubmissionsMarkRead: true };
    await req.payload.update({
      collection: 'contact-submissions',
      id: (doc as any).id,
      data: { status: 'read', readAt: new Date().toISOString() },
      overrideAccess: true,
      req,
    });
  } catch {
    // If it fails, we still return the document (read should not error).
  }

  return doc;
};

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact submission',
    plural: 'Contact submissions',
  },
  admin: {
    group: 'Forms',
    useAsTitle: 'id',
    defaultColumns: ['status', 'createdAt', 'email', 'phone', 'name'],
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
      admin: {
        position: 'sidebar',
      },
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
    // Convenience fields for admin table/search
    { name: 'name', label: 'Name', type: 'text', admin: { readOnly: true } },
    { name: 'email', label: 'Email', type: 'text', admin: { readOnly: true } },
    { name: 'phone', label: 'Phone', type: 'text', admin: { readOnly: true } },
    { name: 'message', label: 'Message', type: 'textarea', admin: { readOnly: true } },
  ],
};

