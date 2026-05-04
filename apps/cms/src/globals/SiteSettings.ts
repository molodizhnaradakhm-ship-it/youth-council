import type { GlobalConfig } from 'payload';

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings';

export const SiteSettings: GlobalConfig = {
  access: {
    read: () => true,
  },
  admin: {
    description: 'Favicon shown in the browser tab. Leave empty to use the default /favicon.ico from the web app.',
  },
  fields: [
    {
      admin: {
        description: '.ico, .png, or .svg. Recommended at least 32×32 px.',
      },
      label: 'Favicon',
      localized: false,
      name: 'favicon',
      relationTo: 'media',
      required: false,
      type: 'upload',
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  label: 'Site settings',
  slug: 'site-settings',
};
