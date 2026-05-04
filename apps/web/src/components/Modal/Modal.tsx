import type { ReactNode } from 'react';
import clsx from 'clsx';
import * as RadixDialog from '@radix-ui/react-dialog';

import styles from './Modal.module.scss';

export type ModalProps = {
  animationType?: 'fade' | 'fromBottom' | 'fromLeft' | 'fromRight' | 'fromTop';
  centeredContent?: boolean;
  className?: string;
  contentClassName?: string;
  overlay?: boolean;
  stopPropagation?: boolean;
  trigger?: ReactNode;
} & RadixDialog.DialogProps;

export const Modal = ({
  animationType = 'fade',
  centeredContent = true,
  children,
  className,
  contentClassName,
  overlay = true,
  stopPropagation,
  trigger,
  ...dialogProps
}: ModalProps) => {
  return (
    <RadixDialog.Root {...dialogProps}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          {...(stopPropagation && {
            onClick: (e) => e.stopPropagation(),
          })}
          asChild
        >
          <div
            className={clsx(
              overlay && styles.overlay,
              centeredContent && styles.centered,
              styles.fade,
              'modal',
              className,
            )}
          >
            <RadixDialog.Content
              asChild
              // onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <div
                className={clsx(styles.content, styles[animationType], contentClassName)}
                data-lenis-prevent='true'
              >
                <RadixDialog.Title></RadixDialog.Title>
                {children}
              </div>
            </RadixDialog.Content>
          </div>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
