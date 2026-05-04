import type { Metadata } from 'next';

import { NotFound } from '@/views/NotFound';

export const metadata: Metadata = {
  description: '404 | Page not found',
  title: '404 | Page not found',
};

const NotFoundPage = () => {
  return <NotFound />;
};

export default NotFoundPage;
