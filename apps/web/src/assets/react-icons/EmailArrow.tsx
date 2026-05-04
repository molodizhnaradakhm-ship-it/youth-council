type Props = {
  className?: string;
};

export const EmailArrow = ({ className }: Props) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
    >
      <path d='M0 12.7335L1.26656 14L13.9322 1.33534L12.6656 0.0688784L0 12.7335Z' fill='currentColor' />
      <path d='M12.2075 0V13.4329H13.9987V0H12.2075Z' fill='currentColor' />
      <path d='M0.566085 0.000297553V1.79135H14V0.000297553H0.566085Z' fill='currentColor' />
    </svg>
  );
};
