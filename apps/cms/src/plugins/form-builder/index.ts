// import path from 'path';
import type { Config } from 'payload';

import { ContactSubmissions } from './collections/ContactSubmissions';
import { Forms } from './collections/Forms';
import { FormSubmissions } from './collections/FormSubmissions';
import { NewsletterSubscriptions } from './collections/NewsletterSubscriptions';

export const formBuilder =
  () =>
  (config: Config): Config => {
    return {
      ...config,
      collections: [...(config.collections ?? []), Forms, FormSubmissions, ContactSubmissions, NewsletterSubscriptions],
    };
  };
