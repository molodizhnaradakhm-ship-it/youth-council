'use client';

import { Toaster } from 'sonner';

export default function AppToaster() {
  return (
    <Toaster closeButton position='top-right' richColors toastOptions={{ duration: 5200 }} />
  );
}