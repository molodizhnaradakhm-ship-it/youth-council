import localFont from 'next/font/local';

const PPMori = localFont({
  display: 'swap',
  src: [
    {
      path: '../assets/fonts/PPMori-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  variable: '--font-primary',
});

export { PPMori };
