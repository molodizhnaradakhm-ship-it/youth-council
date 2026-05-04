import { getRequestConfig } from 'next-intl/server';

import { defaultLocale } from '@monorepo/cms/src/config';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? defaultLocale;

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    locale,
  };
});
