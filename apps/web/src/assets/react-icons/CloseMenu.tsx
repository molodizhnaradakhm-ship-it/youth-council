type Props = {
  className?: string;
};

export const CloseMenu = ({ className }: Props) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 18 18'
      fill='none'
    >
      <path
        d='M1 16.9199L16.9198 0.999949'
        stroke='#F5F5F5'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
      <path
        d='M1.08008 1.07999L16.9998 17'
        stroke='#F5F5F5'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
};
