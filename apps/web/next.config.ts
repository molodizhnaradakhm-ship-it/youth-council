import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /** Helps Docker/standalone output trace ESM packages like sonner consistently. */
  transpilePackages: ['sonner'],
  images: {
    /**
     * In Docker, the image optimizer runs inside the `web` container and cannot reach MinIO at
     * http://127.0.0.1:9000 (that is the container itself). Set NEXT_IMAGE_UNOPTIMIZED=true in
     * .deploy/env.web.dev so the browser loads S3/MinIO URLs directly while developing in compose.
     */
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.staging.youth-council.io',
      },
      {
        protocol: 'https',
        hostname: 'staging.youth-council.io',
      },
      {
        protocol: 'https',
        hostname: 'cms.youth-council.io',
      },
      {
        protocol: 'https',
        hostname: 'youth-council.io',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'cms',
      },
      {
        protocol: 'https',
        hostname: 'assets.beta.gogym.club',
      },
      /** Публичный MinIO/S3 (S3_PUBLIC_URL), иначе `next/image` и `/_next/image` блокируют внешний URL. */
      {
        protocol: 'https',
        hostname: '**.gogym.club',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
  },
  sassOptions: {
    additionalData: `@import "@/scss/mixins";`,
  },
  ...(process.env.DISABLE_STANDALONE !== 'true' && { output: 'standalone' }),
};

export default withNextIntl(nextConfig);
