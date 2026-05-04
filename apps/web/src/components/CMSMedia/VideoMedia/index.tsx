'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';

import { resolvePayloadMediaUrl } from '@/utils/resolvePayloadMediaUrl';

import type { Props as MediaProps } from '../types';

export const VideoMedia: React.FC<MediaProps> = ({ onClick, resource, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoURL = useMemo(() => {
    if (resource == null || typeof resource !== 'object') return null;
    if (!('url' in resource) || !resource.url) return null;
    return resolvePayloadMediaUrl(String(resource.url));
  }, [resource]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    playPromise?.catch((err) => {
      console.warn('Autoplay prevented:', err);
    });
  }, [videoURL]);

  if (!videoURL) return null;

  return (
    <video
      ref={videoRef}
      className={clsx(className)}
      autoPlay
      loop
      muted
      playsInline
      preload='auto'
      onClick={onClick}
      controls={false}
    >
      <source src={videoURL} type='video/mp4' />
    </video>
  );
};
