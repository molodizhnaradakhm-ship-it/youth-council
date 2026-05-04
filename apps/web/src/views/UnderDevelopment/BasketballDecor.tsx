/** Decorative basketball-style sphere for the “under development” hero */
export const BasketballDecor = ({ className }: { className?: string }) => (
  <div aria-hidden className={className}>
    <svg fill='none' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <radialGradient cx='35%' cy='30%' id='ball' r='65%'>
          <stop offset='0%' stopColor='#ff9f4a' />
          <stop offset='55%' stopColor='#e85d04' />
          <stop offset='100%' stopColor='#9a3412' />
        </radialGradient>
      </defs>
      <circle cx='100' cy='100' fill='url(#ball)' r='96' />
      <g fill='none' opacity='0.88' stroke='#1c1917' strokeWidth='2.2'>
        <ellipse cx='100' cy='100' rx='96' ry='32' />
        <path d='M100 4c-22 48-22 144 0 192' />
        <path d='M4 100c48-22 144-22 192 0' />
        <path d='M28 36c40 32 104 96 144 128' />
        <path d='M172 36c-40 32-104 96-144 128' />
      </g>
    </svg>
  </div>
);
