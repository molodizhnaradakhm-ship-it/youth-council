import type { CSSProperties } from 'react';

export type CSSVars = Record<`--${string}`, string | number | undefined>;

export type StyleWithVars = CSSProperties & CSSVars;

