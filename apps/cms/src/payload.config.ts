import nodemailer from 'nodemailer';
import path from 'path';
import { buildConfig, type SharpDependency } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Blog } from './collections/Blog';
import { BlogAuthors } from './collections/BlogAuthors';
import { BlogCategories } from './collections/BlogCategories';
import { ExplorePages } from './collections/ExplorePages';
import { ExploreSections } from './collections/ExploreSections';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { Participants } from './collections/Participants';
import { Projects } from './collections/Projects';
import { Users } from './collections/Users';
import { defaultLocale, localesPayloadConfig } from './config';
import { Banner } from './globals/Banner';
import { Contacts } from './globals/Contacts';
import { Footer } from './globals/Footer';
import { Header } from './globals/Header';
import { SiteSettings } from './globals/SiteSettings';
import { ensureS3Bucket } from './lib/ensureS3Bucket';
import { buildLivePreviewUrl } from './lib/livePreview';
import { plugins } from './plugins';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import {
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

const s3Configured = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
);

/** Public base URL for serving files (without Payload proxy). For MinIO: `http://host:9000/bucket-name`. */
const s3PublicBase = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');

export default buildConfig({
  admin: {
    autoLogin: process.env.NODE_ENV === 'development' && {
      email: process.env.AUTOLOGIN_EMAIL ?? 'dev@payloadcms.com',
      password: process.env.AUTOLOGIN_PASSWORD ?? 'test',
    },
    dateFormat: 'dd/MM/yyyy HH:mm',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          height: 844,
          label: 'Mobile',
          name: 'mobile',
          width: 390,
        },
        {
          height: 900,
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
        },
      ],
      collections: [
        'pages',
        'blog',
        'blog-authors',
        'explore-sections',
        'explore-pages',
        'participants',
        'projects',
      ],
      globals: ['header', 'footer', 'contacts', 'banner', 'site-settings'],
      url: buildLivePreviewUrl,
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    ExploreSections,
    ExplorePages,
    Pages,
    Blog,
    BlogCategories,
    BlogAuthors,
    Participants,
    Projects,
  ],
  db: mongooseAdapter({
    migrationDir: path.resolve(dirname, 'migrations'),
    url: process.env.DATABASE_URI || '',
  }),
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures,
        ParagraphFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
        BoldFeature(),
        LinkFeature(),
        BlockquoteFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        FixedToolbarFeature(),
      ];
    },
  }),
  globals: [Header, Footer, Contacts, Banner, SiteSettings],
  async onInit(payload) {
    if (s3Configured) {
      await ensureS3Bucket(payload);
    }

    if (process.env.NODE_ENV !== 'production') {
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
      });

      if (existingUsers.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: process.env.AUTOLOGIN_EMAIL ?? 'dev@payloadcms.com',
            password: process.env.AUTOLOGIN_PASSWORD ?? 'test',
          },
        });
      }
    }
  },
  email: process.env.SMTP_PASS
    ? nodemailerAdapter({
        defaultFromAddress: '',
        defaultFromName: '',
        transport: nodemailer.createTransport({
          auth: {
            pass: process.env.SMTP_PASS,
            user: process.env.SMTP_USER,
          },
          host: process.env.SMTP_HOST,
          port: 465,
          secure: true,
          service: 'Gmail',
          logger: true,
          debug: true,
        }),
      })
    : undefined,
  plugins: [
    s3Storage({
      acl: process.env.S3_ACL === 'public-read' ? 'public-read' : undefined,
      bucket: process.env.S3_BUCKET ?? '',
      collections: {
        media: s3PublicBase
          ? {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) => {
                const key = prefix ? `${prefix}/${filename}` : filename;

                return `${s3PublicBase}/${key}`;
              },
            }
          : true,
      },
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
        ...(process.env.S3_ENDPOINT
          ? {
              endpoint: process.env.S3_ENDPOINT,
              forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
            }
          : {}),
        region: process.env.S3_REGION || 'us-east-1',
      },
      enabled: s3Configured,
    }),
    ...plugins,
  ],
  // Payload localization:
  // - By default, Payload falls back to defaultLocale when a localized field is empty in current locale.
  // - For this project, editors expect each locale to be independent (no automatic fallback).
  localization: {
    defaultLocale,
    fallback: false,
    locales: localesPayloadConfig,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  sharp: sharp as unknown as SharpDependency,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    jobsCollectionOverrides: ({ defaultJobsCollection }) => {
      if (!defaultJobsCollection.admin) {
        defaultJobsCollection.admin = {};
      }

      defaultJobsCollection.admin.hidden = false;
      return defaultJobsCollection;
    },
  },
  folders: {},
});
