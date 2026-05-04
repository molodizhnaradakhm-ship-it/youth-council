import React from 'react';

import { ImageMedia } from './ImageMedia';
import type { Props } from './types';
import { VideoMedia } from './VideoMedia';

export const CMSMedia: React.FC<Props> = (props) => {
  const { resource } = props;

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video');

   
  // const Tag = (htmlElement as any) || Fragment;

  return isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />;
};
