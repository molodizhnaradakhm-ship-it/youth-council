export type HintVariant = 'primary' | 'info' | 'warning' | 'success';

type Props = {
  variant: HintVariant;
};

const size = 48;

const HINT_VARIANT = {
  Primary: 'primary',
  Info: 'info',
  Warning: 'warning',
  Success: 'success',
} as const satisfies Record<string, HintVariant>;

const VARIANT_FILL: Record<HintVariant, string> = {
  [HINT_VARIANT.Primary]: '#4985BE',
  [HINT_VARIANT.Info]: '#9999a0',
  [HINT_VARIANT.Warning]: '#CDB538',
  [HINT_VARIANT.Success]: '#2FA36B',
};

/** Built-in icons when CMS custom icon is not set (matches exported Hint bar assets). */
export const HintDefaultIcon = ({ variant }: Props) => {
  const fill = VARIANT_FILL[variant];
  const isSuccess = variant === HINT_VARIANT.Success;

  return (
    <svg
      aria-hidden
      className='hint-block__default-svg'
      height={size}
      viewBox='0 0 48 48'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx='24' cy='24' fill={fill} r='22' />
      {isSuccess ? (
        <path
          d='M14 24l7 7 13-13'
          fill='none'
          stroke='#fff'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='3'
        />
      ) : (
        <path d='M24 14v14M24 32v2' stroke='#fff' strokeLinecap='round' strokeWidth='3' />
      )}
    </svg>
  );
};
