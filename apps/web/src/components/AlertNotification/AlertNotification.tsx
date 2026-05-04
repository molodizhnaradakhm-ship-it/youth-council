import * as React from 'react';
import * as Portal from '@radix-ui/react-portal';
import * as Toast from '@radix-ui/react-toast';

import { Text } from '../Text';

import styles from './AlertNotification.module.scss';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  text: string;
};

export const AlertNotification = ({ open, setOpen, text }: Props) => {
  return (
    <Portal.Root>
      <Toast.Provider swipeDirection='down'>
        <Toast.Root className={styles.ToastRoot} onOpenChange={setOpen} open={open}>
          <Toast.Title className={styles.ToastTitle}>
            <Text type='p2' color='light-violet'>
              {text}
            </Text>
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className={styles.ToastViewport} />
      </Toast.Provider>
    </Portal.Root>
  );
};
