type Props = {
  className?: string;
};

export const CloseModal = ({ className }: Props) => {
  return (
    <svg
      className={className}
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M8.92529 23.0725L23.0674 8.9304' stroke='#D7C4FF' strokeWidth='2' />
      <path d='M8.93237 8.93039L23.0745 23.0725' stroke='#D7C4FF' strokeWidth='2' />
    </svg>
  );
};
