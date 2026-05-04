import type { ComponentProps } from 'react';
import { forwardRef } from 'react';

import { Container } from '@/components/Container';

/**
 * Site chrome (header / footer): same max-width + horizontal padding as `Container wide`
 * across breakpoints (see Container.module.scss).
 */
export type ChromeContainerProps = Omit<ComponentProps<typeof Container>, 'wide'>;

export const ChromeContainer = forwardRef<HTMLDivElement, ChromeContainerProps>((props, ref) => (
  <Container ref={ref} wide {...props} />
));

ChromeContainer.displayName = 'ChromeContainer';
