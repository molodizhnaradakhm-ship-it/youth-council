import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone is for production Docker images. In dev it can cause odd server-action / RSC behavior.
  ...(process.env.NODE_ENV === 'production' &&
    process.env.DISABLE_STANDALONE !== 'true' && { output: 'standalone' }),
  /**
   * Standalone trace can miss files that are only reached via server-action chunks.
   * Including `src` keeps Payload config + collections + globals reliably available in Docker.
   */
  // Same glob key `withPayload` merges under; include all of `src` for standalone Docker tracing.
  outputFileTracingIncludes: {
    '**/*': ['./src/**/*'],
  },
};

/**
 * In dev, without `devBundleServerPackages`, `withPayload` externalizes `@payloadcms/*` so Node resolves
 * them without webpack/Turbopack — that breaks CSS from `react-image-crop` in `@payloadcms/ui`.
 * @see https://payloadcms.com/docs/getting-started/installation
 */
export default withPayload(nextConfig, {
  devBundleServerPackages: true,
});
