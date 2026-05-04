type Props = {
  className?: string;
};

export const NavArrow = ({ className }: Props) => {
  return (
    //
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='10'
      height='7'
      viewBox='0 0 10 7'
      fill='none'
      className={className}
    >
      <path
        d='M3.62078 0.0338758L-9.28473e-09 0.0531025L4.41998 7L5.54294 7L10 1.74846e-06L6.42168 0.019003L5.79961 0.995984L4.23338 0.995984L3.62078 0.0338758Z'
        fill='currentColor'
      />
    </svg>
  );
};
