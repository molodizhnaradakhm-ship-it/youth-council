import type { CollectionConfig, Where } from 'payload';

import { seoFields } from '@/fields/seo';
import { slugField } from '@/fields/slug';

import { exploreContentBlocks } from '../shared/exploreContentBlocks';
import { revalidateExplorePages } from './hooks/revalidateExplorePages';

export const ExplorePages: CollectionConfig = {
  access: {
    read: () => true,
  },
  admin: {
    defaultColumns: ['title', 'section', 'slug', 'navOrder'],
    group: 'Content',
    useAsTitle: 'title',
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
                    description:
                      'Create sections first (Explore sections). Pages are grouped under the matching /explore/{section-slug}/ URL.',
                    width: '50%',
                  },
                  label: 'Section',
                  name: 'section',
                  relationTo: 'explore-sections',
                  required: true,
                  type: 'relationship',
                },
              ],
              type: 'row',
            },
            {
              admin: {
                description:
                  'Optional. Sub-page only. Parent must be a top-level page in the same section (one nesting level).',
              },
              filterOptions: ({ siblingData }): Where => {
                const sectionId = (siblingData as { section?: string })?.section;

                if (!sectionId) {
                  return { id: { equals: '__no_parent_options__' } };
                }

                return {
                  and: [{ section: { equals: sectionId } }, { parent: { exists: false } }],
                };
              },
              label: 'Parent page',
              maxDepth: 0,
              name: 'parent',
              relationTo: 'explore-pages',
              required: false,
              type: 'relationship',
            },
            {
              fields: [
                {
                  defaultValue: 0,
                  label: 'Order in sidebar',
                  min: 0,
                  name: 'navOrder',
                  required: true,
                  type: 'number',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  admin: {
                    description: 'Shown in the nav list instead of the title when set (e.g. version label).',
                    width: '50%',
                  },
                  label: 'Nav label override',
                  localized: true,
                  name: 'navLabel',
                  required: false,
                  type: 'text',
                },
              ],
              type: 'row',
            },
          ],
          label: 'Main',
        },
        {
          fields: [
            {
              admin: {
                description:
                  'Add a “Tabs” block here for tabbed content, or use any other blocks. Tab panels use the same block types as this field (except nested Tabs).',
              },
              blocks: exploreContentBlocks,
              label: 'Content blocks',
              labels: {
                plural: 'Blocks',
                singular: 'Block',
              },
              localized: true,
              name: 'blocks',
              type: 'blocks',
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
    afterChange: [revalidateExplorePages],
  },
  labels: {
    plural: 'Explore pages',
    singular: 'Explore page',
  },
  slug: 'explore-pages',
};
