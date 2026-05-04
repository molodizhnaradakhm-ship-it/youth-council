'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { AlertNotification } from '../AlertNotification';

type CopyProps = {
  alertText?: string;
  children?: React.ReactNode;
  className?: string;
  component?: React.ElementType;
  textToCopy: string;
};

export const Copy = ({
  alertText,
  children,
  className,
  component: Component = 'button',
  textToCopy,
  ...restProps
}: CopyProps) => {
  const t = useTranslations('common');
  const [showAlert, setShowAlert] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      <Component
        aria-label='copy to clipboard'
        className={className}
        onClick={handleCopy}
        {...restProps}
      >
        {children}
      </Component>
      <AlertNotification open={showAlert} setOpen={setShowAlert} text={alertText ?? t('copied')} />
    </>
  );
};
