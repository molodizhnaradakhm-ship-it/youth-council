type Props = {
  className?: string;
};

export const BackIcon = ({ className }: Props) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='17'
      height='17'
      viewBox='0 0 17 17'
      fill='none'
    >
      <path
        d='M16.2021 8.90838L16.202 7.37313L0.849541 7.37255L0.849599 8.9078L16.2021 8.90838Z'
        fill='currentColor'
      />
      <path
        d='M1.0855 9.22719L9.22707 1.08563L8.14144 5.22448e-06L-0.000123309 8.14157L1.0855 9.22719Z'
        fill='currentColor'
      />
      <path
        d='M8.14146 16.2828L9.227 15.1972L1.08482 7.05506L-0.000725885 8.14061L8.14146 16.2828Z'
        fill='currentColor'
      />
    </svg>
  );
};
