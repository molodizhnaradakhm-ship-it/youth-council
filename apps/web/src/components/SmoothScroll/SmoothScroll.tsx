'use client';

import React from 'react';
import { ReactLenis } from 'lenis/react';

type SmoothScrollProps = {
  children: React.ReactNode;
};

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  // const lenis = useLenis();

  // useEffect(() => {
  //   if (lenis) {
  //     lenis.scrollTo(0);
  //   }
  // }, [lenis]);

  return <ReactLenis root>{children}</ReactLenis>;
};

export default SmoothScroll;
