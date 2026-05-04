'use client';

import { useState } from 'react';
import clsx from 'clsx';

import { CMSMedia } from '@/components/CMSMedia';
import type { Media } from '@monorepo/cms/src/payload-types';

import { RenderPlayer } from './render-palyer';

import styles from './video.module.scss';

type Props = {
  className?: string;
  photo: Media | string;
  videoLink: string;
};

export const Video = ({ className, photo, videoLink }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    setIsPlaying(true);
  };

  return (
    <div className={clsx(styles.wrapper, className)} onClick={play}>
      {isPlaying && (
        <RenderPlayer
          controls={isPlaying}
          height='100%'
          onClickPreview={play}
          playing={isPlaying}
          url={videoLink}
          width='100%'
        />
      )}
      {!isPlaying && (
        <>
          <CMSMedia className={styles.preview} resource={photo} />
          <button aria-label='Play' className={styles.playBtn} onClick={play}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='18'
              viewBox='0 0 16 18'
              fill='none'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M14.6529 11.3835L4.0001 17.6342C2.21772 18.6801 0 17.3586 0 15.2506V2.74938C0 0.64147 2.21769 -0.680042 4.00006 0.36576L14.6529 6.61625C16.449 7.67015 16.4491 10.3295 14.6529 11.3835Z'
                fill='#362315'
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};
