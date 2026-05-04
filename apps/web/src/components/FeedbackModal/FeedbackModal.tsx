import type { ReactNode } from 'react';
import { useRef } from 'react';
import clsx from 'clsx';
import { Close } from '@radix-ui/react-dialog';

import { CloseMenu } from '@/assets/react-icons/CloseMenu';
import type { Form } from '@monorepo/cms/src/payload-types';

import { CMSForm } from '../CMSForm';
import { Modal } from '../Modal';
import { Text } from '../Text';

import styles from './FeedbackModal.module.scss';

type Props = {
  className?: string;
  form: (string | null) | Form;
  trigger?: ReactNode;
};

export const FeedbackModal = ({ className, trigger, form }: Props) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const formData = form as Form;
  return (
    <Modal
      animationType='fromRight'
      centeredContent={false}
      trigger={trigger}
      className={clsx(styles.wrapper, className)}
      contentClassName={styles.content}
    >
      <div className={styles.formContainer}>
        <Close className={styles.closeBtn} ref={closeRef}>
          <CloseMenu />
        </Close>
        <Text type='h2' className={styles.formTitle}>
          {formData.title}
        </Text>
        <CMSForm
          {...(formData as Form)}
          // onSuccess={() => closeRef.current?.click()}
          className={styles.form}
        />
      </div>
    </Modal>
  );
};
