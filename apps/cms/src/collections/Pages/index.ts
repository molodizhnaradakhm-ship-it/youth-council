import type { CollectionConfig } from 'payload';

import { link } from '@/fields/link';
import { manualField } from '@/fields/manual';
import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';
import { slugBeforeRead } from '@/hooks/getSlugs';
import { populatePublishedAt } from '@/hooks/populatePublishedAt';

import { exploreContentBlocks } from '../shared/exploreContentBlocks';
import { revalidatePage } from './hooks/revalidatePage';

import {
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical';

export const Pages: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    preview: ({ slug }) => `${process.env.WEB_URL}/${slug}`,
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            {
              fields: [
                {
                  admin: {
                    width: '50%',
                  },
                  label: 'Title',
                  localized: true,
                  name: 'title',
                  required: true,
                  type: 'text',
                },
                {
                  admin: {
                    width: '50%',
                  },
                  defaultValue: 'home',
                  label: 'Page template',
                  name: 'viewType',
                  options: [
                    {
                      label: 'Main screen + blocks (main)',
                      value: 'home',
                    },
                    {
                      label: 'Blog',
                      value: 'blog',
                    },
                    {
                      label: 'Contacts',
                      value: 'contacts',
                    },
                    {
                      label: 'Explore (site section /explore)',
                      value: 'explore',
                    },
                    {
                      label: 'A page with text (Privacy Policy, User Agreement / Offer)',
                      value: 'information',
                    },
                    {
                      label: 'External links (dark layout)',
                      value: 'externalLinks',
                    },
                    {
                      label: 'Subscriptions / Pricing (tariffs + FAQ; slug: subscriptions)',
                      value: 'subscriptions',
                    },
                    {
                      label: 'Participants directory (search + list)',
                      value: 'participants',
                    },
                    {
                      label: 'Projects directory (list + pagination)',
                      value: 'projects',
                    },
                    {
                      label: 'Under development (placeholder; URL = /{locale}/{slug})',
                      value: 'underDevelopment',
                    },
                  ],
                  required: true,
                  type: 'select',
                },
                {
                  admin: {
                    width: '50%',
                    hidden: true,
                  },
                  label: 'Header style',
                  name: 'headerAppearance',
                  options: [
                    {
                      label: 'Default (use global setting)',
                      value: 'default',
                    },
                    {
                      label: 'Dark',
                      value: 'dark',
                    },
                    {
                      label: 'Light',
                      value: 'light',
                    },
                  ],
                  required: false,
                  type: 'select',
                },
              ],
              type: 'row',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'information',
              },

              label: 'Description',
              name: 'description',
              type: 'textarea',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'information',
                description:
                  'Date only, per locale (e.g. March 17, 2025). The label “Last updated:” is translated automatically. Leave empty if you use Description only.',
              },
              label: 'Last updated (date)',
              localized: true,
              name: 'lastUpdated',
              required: false,
              type: 'text',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'information',
                description:
                  'Optional decorative strip at the top. Leave empty for the clean document layout (Privacy Policy PDF style).',
              },
              label: 'Background image',
              name: 'bgImage',
              relationTo: 'media',
              required: false,
              type: 'upload',
            },
          ],
          label: 'Main',
        },
        {
          fields: [
            {
              admin: {
                condition: (data) => data.viewType === 'home',
              },
              blocks: exploreContentBlocks,
              label: 'Blocks',
              labels: {
                plural: 'Blocks',
                singular: 'Block',
              },
              localized: true,
              name: 'homeBlocks',
              type: 'blocks',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'information',
                description:
                  'Default body. Latest wording from the legal document list; may be updated after counsel review. Regional overrides are below.',
              },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [...rootFeatures, EXPERIMENTAL_TableFeature(), UploadFeature()];
                },
              }),
              label: 'Page body',
              localized: true,
              name: 'privacyText',
              type: 'richText',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'information',
                description:
                  'Optional. If any blocks are added, they replace the rich text body on the site. Use “Responsive (mobile / desktop)” to build separate mobile/desktop versions.',
              },
              blocks: exploreContentBlocks,
              label: 'Content blocks (replace body)',
              labels: { plural: 'Blocks', singular: 'Block' },
              localized: true,
              name: 'informationBlocks',
              type: 'blocks',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'information',
                description:
                  'Optional text per jurisdiction. Open the same page with ?country=CODE (e.g. ?country=US). If absent, the main Page body field is shown.',
              },
              fields: [
                {
                  admin: {
                    description: 'e.g. US, EU, KZ, UA (case-insensitive in the URL).',
                  },
                  label: 'Country / region code',
                  name: 'countryCode',
                  required: true,
                  type: 'text',
                },
                {
                  label: 'Text',
                  localized: true,
                  name: 'body',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [...rootFeatures, EXPERIMENTAL_TableFeature(), UploadFeature()];
                    },
                  }),
                  type: 'richText',
                },
              ],
              label: 'Regional variants',
              labels: {
                plural: 'Regional variants',
                singular: 'Regional variant',
              },
              name: 'privacyRegions',
              type: 'array',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'blog',
                readOnly: true,
              },
              label: 'Manual',
              defaultValue: "Posts are added in the 'Content/Blog' section.",
              localized: false,
              name: 'blogManualUi',
              type: 'textarea',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'blog',
                description:
                  'Overrides the “Read more” label on blog cards on the Blog page only. Leave empty to use the website default translation.',
              },
              label: 'Blog cards CTA label (“Read more”)',
              localized: true,
              name: 'blogReadMoreLabel',
              required: false,
              type: 'text',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'explore',
                readOnly: true,
              },
              label: 'Manual',
              defaultValue:
                'Explore lives at /explore. Create sections first (Content → Explore sections), then pages (Content → Explore pages): optional parent for subpages, blocks per page.',
              localized: false,
              name: 'exploreManualUi',
              type: 'textarea',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'underDevelopment',
                readOnly: true,
              },
              label: 'Manual',
              defaultValue:
                'The site shows the «Under development» placeholder at /{locale}/{your-slug} (set Slug in the sidebar). The fixed URL /{locale}/under-development uses the same layout; create a page with slug under-development to customize background and hero image for that route. No blocks — use SEO tab for title/description.',
              localized: false,
              name: 'underDevelopmentManualUi',
              type: 'textarea',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'underDevelopment',
                description:
                  'Optional full-bleed background behind the dot pattern. If empty, solid black is used.',
              },
              label: 'Background image (dark section)',
              name: 'underDevelopmentBackground',
              relationTo: 'media',
              required: false,
              type: 'upload',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'underDevelopment',
                description: 'Optional image instead of the default basketball graphic.',
              },
              label: 'Hero image (replaces ball)',
              name: 'underDevelopmentBallImage',
              relationTo: 'media',
              required: false,
              type: 'upload',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'underDevelopment',
                description:
                  'Optional. If any blocks are added, they replace the default placeholder copy on the site. Use “Responsive (mobile / desktop)” to build separate mobile/desktop versions.',
              },
              blocks: exploreContentBlocks,
              label: 'Content blocks (replace copy)',
              labels: { plural: 'Blocks', singular: 'Block' },
              localized: true,
              name: 'underDevelopmentBlocks',
              type: 'blocks',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'contacts',
              },
              label: 'Contacts page fields',
              fields: [
                {
                  localized: true,
                  label: 'Page title',
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  localized: true,
                  name: 'description',
                  type: 'richText',
                  required: true,
                },
                {
                  admin: {
                    description:
                      'Compose the Contacts page by adding blocks below (you can reorder them). If empty, the website falls back to the default layout.',
                  },
                  blocks: exploreContentBlocks,
                  label: 'Blocks',
                  labels: {
                    plural: 'Blocks',
                    singular: 'Block',
                  },
                  localized: true,
                  name: 'blocks',
                  type: 'blocks',
                },
                manualField(
                  "Other contact information is filled in the 'Globals/Contacts' section",
                ),
              ],
              name: 'contactsPage',
              required: true,
              type: 'group',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'externalLinks',
              },
              label: 'External links page',
              fields: [
                {
                  admin: {
                    description: 'Optional lead text above the list.',
                  },
                  label: 'Intro',
                  localized: true,
                  name: 'intro',
                  required: false,
                  type: 'richText',
                },
                {
                  admin: {
                    components: {
                      RowLabel: '@/fields/CustomRowLabel#CustomRowLabel',
                    },
                  },
                  fields: [
                    link({
                      appearances: false,
                      overrides: {
                        label: 'Link',
                      },
                    }),
                  ],
                  label: 'Links',
                  labels: {
                    plural: 'Links',
                    singular: 'Link',
                  },
                  minRows: 1,
                  name: 'items',
                  required: true,
                  type: 'array',
                },
                {
                  admin: {
                    description: 'Optional bottom button (white pill in the design).',
                  },
                  fields: [
                    link({
                      appearances: false,
                      optional: true,
                    }),
                  ],
                  label: 'Bottom CTA',
                  name: 'cta',
                  required: false,
                  type: 'group',
                },
                {
                  admin: {
                    description:
                      'Optional. If any blocks are added, they replace the whole panel on the site (intro + links + CTA). Use “Responsive (mobile / desktop)” to build separate mobile/desktop versions.',
                  },
                  blocks: exploreContentBlocks,
                  label: 'Content blocks (replace panel)',
                  labels: { plural: 'Blocks', singular: 'Block' },
                  localized: true,
                  name: 'blocks',
                  type: 'blocks',
                },
              ],
              name: 'externalLinksPage',
              required: true,
              type: 'group',
            },
            {
              admin: {
                condition: (data) => data.viewType === 'subscriptions',
              },
              fields: [
                {
                  admin: {
                    description:
                      'Optional. Blocks are rendered above the FAQ section. Use “Responsive (mobile / desktop)” to build separate mobile/desktop versions.',
                  },
                  blocks: exploreContentBlocks,
                  label: 'Content blocks',
                  labels: { plural: 'Blocks', singular: 'Block' },
                  localized: true,
                  name: 'blocks',
                  type: 'blocks',
                },
                {
                  admin: {
                    description: 'Shown above the accordion. Leave empty to use the default translation.',
                  },
                  label: 'FAQ section title',
                  localized: true,
                  name: 'faqTitle',
                  required: false,
                  type: 'text',
                },
                {
                  fields: [
                    {
                      label: 'Question',
                      localized: true,
                      name: 'question',
                      required: true,
                      type: 'text',
                    },
                    {
                      label: 'Answer',
                      localized: true,
                      name: 'answer',
                      required: true,
                      type: 'textarea',
                    },
                  ],
                  label: 'Questions & answers',
                  labels: {
                    plural: 'Items',
                    singular: 'Item',
                  },
                  minRows: 0,
                  name: 'faqItems',
                  type: 'array',
                },
                {
                  label: 'Footer title',
                  localized: true,
                  name: 'faqFooterTitle',
                  required: false,
                  type: 'text',
                },
                {
                  admin: {
                    description: 'e.g. contact line with email.',
                  },
                  label: 'Footer text',
                  localized: true,
                  name: 'faqFooterText',
                  required: false,
                  type: 'textarea',
                },
              ],
              interfaceName: 'SubscriptionsPageFields',
              label: 'Subscriptions page (FAQ)',
              name: 'subscriptionsPage',
              required: false,
              type: 'group',
            },
          ],
          label: 'Content',
        },
        seoFields,
      ],
      type: 'tabs',
    },
    ...slugField(),
  ],
  hooks: {
    beforeRead: [slugBeforeRead] as any,
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
  labels: {
    plural: 'Pages',
    singular: 'Page',
  },
  slug: 'pages',
};
