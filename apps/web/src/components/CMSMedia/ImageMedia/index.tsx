'use client';

import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import type { ImageLoaderProps, StaticImageData } from 'next/image';
import NextImage from 'next/image';

import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';
import { getCmsBaseUrl } from '@/lib/cmsBaseUrl';

import type { Props as MediaProps } from '../types';
import type { Media as MediaType } from '@monorepo/cms/src/payload-types';

// export const cssVariables = {
//   breakpoints: {
//     // '2xl': 1536,
//     // '3xl': 1920,
//     // lg: 1024,
//     // md: 768,
//     // sm: 640,
//     // xl: 1280,
//   },
// };

// const { breakpoints } = cssVariables;

// A base64 encoded image to use as a placeholder while the image is loading

const placeholderBlur =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMwMjY0ZiIvPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwIiB5Mj0iMTAwIj48c3RvcCBzdG9wLWNvbG9yPSIjMzEyNzUxIiBvZmZzZXQ9IjAiLz48c3RvcCBzdG9wLWNvbG9yPSIjNjQzZmNlIiBvZmZzZXQ9IjAuNSIvPjxzdG9wIHN0b3AtY29sb3I9IiM3ZjU4ZmYiIG9mZnNldD0iMSIvPjwvbGluZWFyR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZykiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjMwIiByPSI1MCIgZmlsbD0iI2Y2ZjZmNiIgb3BhY2l0eT0iMC4wNSIvPjxjaXJjbGUgY3g9IjcwIiBjeT0iNzAiIHI9IjYwIiBmaWxsPSIjOTE4MGZmIiBvcGFjaXR5PSIwLjA4Ii8+PC9zdmc+';

function hasValidNextImageSrc(src: StaticImageData | string | undefined): src is StaticImageData | string {
  if (src == null) {
    return false;
  }
  if (typeof src === 'string') {
    return src.trim() !== '';
  }
  if (typeof src === 'object' && 'src' in src && typeof (src as StaticImageData).src === 'string') {
    return (src as StaticImageData).src.trim() !== '';
  }
  return false;
}

function isDockerComposeDev(): boolean {
  // In our dev compose, CMS is addressed via a Docker hostname.
  const cmsUrl = (process.env.NEXT_PUBLIC_CMS_URL ?? '').toLowerCase();
  return cmsUrl.includes('//youth-council-landing-cms') || cmsUrl.includes('//cms');
}

function rewriteLocalMinioForServerFetch(src: string): string {
  // next/image calls `/_next/image?url=...` and the server fetches that `url`.
  // In Docker, `localhost:9000` is NOT MinIO; MinIO is reachable as `minio:9000`.
  if (!isDockerComposeDev()) return src;
  return src
    .replace(/^http:\/\/localhost:9000\b/i, 'http://minio:9000')
    .replace(/^http:\/\/127\.0\.0\.1:9000\b/i, 'http://minio:9000');
}

const mediaCache = new Map<string, MediaType | null>();

async function fetchMediaById(id: string): Promise<MediaType | null> {
  if (mediaCache.has(id)) return mediaCache.get(id) ?? null;
  try {
    const base = getCmsBaseUrl();
    const res = await fetch(`${base}/api/media/${encodeURIComponent(id)}`, {
      cache: 'force-cache',
    });
    if (!res.ok) {
      mediaCache.set(id, null);
      return null;
    }
    const data = (await res.json()) as MediaType;
    mediaCache.set(id, data);
    return data;
  } catch {
    mediaCache.set(id, null);
    return null;
  }
}

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    className,
    loading: loadingFromProps,
    onLoad,
    onLoadingComplete,
    priority,
    quality = 85,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    style,
    withBlur,
  } = props;

  const [resolvedResource, setResolvedResource] = useState<MediaType | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolvedResource(null);

    const id =
      typeof resource === 'string' || typeof resource === 'number' ? String(resource).trim() : '';
    if (!id) return () => void 0;

    fetchMediaById(id).then((doc) => {
      if (cancelled) return;
      setResolvedResource(doc);
    });

    return () => {
      cancelled = true;
    };
  }, [resource]);

  const imageData = useMemo(() => {
    let width: number | undefined;
    let height: number | undefined;
    let alt = altFromProps ?? '';
    let src: StaticImageData | string | undefined = srcFromProps;

    const effectiveResource =
      resource && typeof resource === 'object' ? (resource as any) : (resolvedResource as any);

    if (!src && effectiveResource && typeof effectiveResource === 'object') {
      const { alt: altFromResource, height: fullHeight, updatedAt, url, width: fullWidth } =
        effectiveResource;

      width = typeof fullWidth === 'number' ? fullWidth : undefined;
      height = typeof fullHeight === 'number' ? fullHeight : undefined;
      alt = altFromResource || '';

      const rawUrl = typeof url === 'string' ? url.trim() : String(url ?? '').trim();
      if (rawUrl) {
        const base = resolvePayloadMediaUrl(rawUrl);
        const version = typeof updatedAt === 'string' && updatedAt.trim() !== '' ? updatedAt : '';
        src = version ? `${base}${base.includes('?') ? '&' : '?'}v=${encodeURIComponent(version)}` : base;
      }
    }

    return { alt, height, src, width };
  }, [altFromProps, resolvedResource, resource, srcFromProps]);

  const { alt, height, src, width } = imageData;

  if (!hasValidNextImageSrc(src)) return null;

  const loader = typeof src === 'string'
    ? ({ src: loaderSrc }: ImageLoaderProps) => rewriteLocalMinioForServerFetch(loaderSrc)
    : undefined;

  // Next.js: `priority` and `loading="lazy"` must not be used together.
  const loading = priority ? undefined : (loadingFromProps ?? 'lazy');

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps;
  // ? sizeFromProps
  // : Object.entries(breakpoints)
  //     .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
  //     .join(', ');

  return (
    <NextImage
      alt={alt}
      blurDataURL={withBlur ? placeholderBlur : undefined}
      className={clsx(className)}
      fill={fill}
      height={!fill ? height : undefined}
      {...(loader ? { loader } : {})}
      {...(loading !== undefined ? { loading } : {})}
      onLoad={onLoad}
      onLoadingComplete={onLoadingComplete}
      placeholder={withBlur ? 'blur' : undefined}
      priority={priority}
      quality={quality}
      sizes={sizes}
      src={src}
      style={style}
      width={!fill ? width : undefined}
    />
  );
};
