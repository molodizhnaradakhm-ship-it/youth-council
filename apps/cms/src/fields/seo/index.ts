import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';

export const seoFields = {
  fields: [
    OverviewField({
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
      titlePath: 'meta.title',
    }),
    MetaTitleField({
      hasGenerateFn: true,
    }),
    MetaImageField({
      relationTo: 'media',
    }),
    MetaDescriptionField({}),
    PreviewField({
      descriptionPath: 'meta.description',
      hasGenerateFn: true,
      titlePath: 'meta.title',
    }),
  ],
  label: 'SEO',
  name: 'meta',
};
