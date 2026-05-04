import type { ReactNode } from 'react';
import clsx from 'clsx';
import * as AccordionRadix from '@radix-ui/react-accordion';

import styles from './Accordion.module.scss';

export const Accordion = <
  ItemT extends {
    id?: null | string;
  },
>({
  className,
  classNameItem,
  classNameTrigger,
  list,
  renderContent,
  renderTrigger,
  defaultValue,
}: {
  className?: string;
  classNameItem?: string;
  classNameTrigger?: string;
  list: ItemT[];
  defaultValue?: string;
  renderContent: (item: ItemT) => ReactNode;
  renderTrigger: (item: ItemT) => ReactNode;
}) => {
  return (
    <AccordionRadix.Root
      className={clsx(styles.wrapper, className)}
      collapsible
      type='single'
      defaultValue={defaultValue}
    >
      {list &&
        list.map(
          (item) =>
            item.id && (
              <AccordionRadix.Item
                className={clsx(styles.AccordionItem, classNameItem)}
                key={item.id}
                value={item.id}
              >
                <AccordionRadix.Header className={styles.AccordionHeader}>
                  <AccordionRadix.Trigger
                    className={clsx(styles.AccordionTrigger, classNameTrigger)}
                  >
                    {renderTrigger(item)}
                  </AccordionRadix.Trigger>
                </AccordionRadix.Header>
                <AccordionRadix.Content className={clsx(styles.AccordionContent)}>
                  {renderContent(item)}
                </AccordionRadix.Content>
              </AccordionRadix.Item>
            ),
        )}
    </AccordionRadix.Root>
  );
};
