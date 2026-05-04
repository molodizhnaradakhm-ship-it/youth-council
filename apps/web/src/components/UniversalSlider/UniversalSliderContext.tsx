'use client';

import type { Dispatch, PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { SwiperClass } from 'swiper/react';

type UniversalSliderContextValue = {
  setSwiper: Dispatch<React.SetStateAction<SwiperClass | null>>;
  swiper: SwiperClass | null;
} | null;

export const UniversalSliderContext = createContext<UniversalSliderContextValue>(null);

export const UniversalSliderProvider = ({ children }: PropsWithChildren) => {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  return (
    <UniversalSliderContext.Provider value={{ setSwiper, swiper }}>
      {children}
    </UniversalSliderContext.Provider>
  );
};

export const useUniversalSlider = () => {
  const context = useContext(UniversalSliderContext);

  if (context === null) throw new Error('useUniversalSlider hook requires UniversalSliderProvider');

  return context;
};
