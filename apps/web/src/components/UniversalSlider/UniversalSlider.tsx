'use client';

import React from 'react';
import clsx from 'clsx';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import type { SwiperProps } from 'swiper/react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useUniversalSlider } from './UniversalSliderContext';

import styles from './UniversalSlider.module.scss';

import 'swiper/css';
import 'swiper/css/pagination';

type UniversalSliderProps = {
  children: React.ReactNode;
  className?: string;
  durations?: number[];
  hidePaginationLaptop?: boolean;
  id?: string;
  setSliderControls?: (swiper: SwiperType) => void;
  setSliderIndex?: (index: number) => void;
  swiperProps?: SwiperProps;
  withAutoplay?: boolean;
  withPagination?: boolean;
};

export const UniversalSlider: React.FC<UniversalSliderProps> = ({
  children,
  className,
  hidePaginationLaptop = true,
  id = 'slider',
  setSliderControls,
  setSliderIndex = () => {},
  swiperProps,
  withPagination = true,
}) => {
  const { setSwiper } = useUniversalSlider();

  const onSwiper = (swiper: SwiperType) => {
    if (setSwiper) setSwiper(swiper);
    if (setSliderControls) setSliderControls(swiper);
  };

  return (
    <Swiper
      className={clsx(styles.wrapper, hidePaginationLaptop && styles.hidePagination, className)}
      id={id}
      modules={[Pagination, Autoplay]}
      onInit={(swiper) => {
        setSliderIndex(swiper.realIndex);
      }}
      onSlideChange={(swiper) => {
        setSliderIndex(swiper.realIndex);
      }}
      onSwiper={onSwiper}
      pagination={
        withPagination && {
          bulletActiveClass: `swiper-pagination-bullet-active ${styles.bulletActive}`,
          bulletClass: `swiper-pagination-bullet ${styles.bullet}`,
          clickable: true,
          horizontalClass: styles.bullets,
          renderBullet: function (index: number, className: string) {
            return `<span class="${className}"><span></span></span>`;
          },
        }
      }
      rewind={true}
      {...swiperProps}
    >
      {React.Children.map(children, (child, index) => (
        <SwiperSlide className={styles.list__item} key={index}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
