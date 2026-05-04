'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { LocalizedLink } from '@/components/LocalizedLink';
import type { ExploreNavItem } from '@/lib/exploreTree';

import styles from './ExploreNavTree.module.scss';

function subtreeHasActive(item: ExploreNavItem, activeId: string | null): boolean {
  if (!activeId) {
    return false;
  }

  if (item.id === activeId) {
    return true;
  }

  return item.children?.some((c) => subtreeHasActive(c, activeId)) ?? false;
}

type Props = {
  activeId: string | null;
  items: ExploreNavItem[];
};

function ExploreNavTreeRow({
  activeId,
  item,
  isOpen,
  toggle,
  renderChildren,
}: {
  activeId: string | null;
  item: ExploreNavItem;
  isOpen: boolean;
  toggle: (id: string) => void;
  renderChildren: React.ReactNode;
}) {
  const hasChildren = Boolean(item.children?.length);
  const isActive = item.id === activeId;
  const childActive = hasChildren ? subtreeHasActive(item, activeId) : false;
  const rowActive = isActive || (hasChildren && childActive);

  const rowClassName = hasChildren
    ? rowActive
      ? styles.rowParentActive
      : styles.rowParent
    : isActive
      ? styles.rowLeafActive
      : styles.rowLeaf;

  return (
    <li>
      <div className={rowClassName}>
        {hasChildren ? (
          <>
            <button className={styles.rowLinkButton} type='button' onClick={() => toggle(item.id)}>
              {item.label}
            </button>
            <LocalizedLink aria-label='Open page' className={styles.openParent} href={item.href}>
              ↗
            </LocalizedLink>
            <button
              aria-expanded={isOpen}
              className={styles.chevronBtn}
              type='button'
              onClick={() => toggle(item.id)}
            >
              <span className={isOpen ? styles.chevronOpen : styles.chevronClosed} />
            </button>
          </>
        ) : (
          <LocalizedLink className={styles.rowLink} href={item.href}>
            {item.label}
          </LocalizedLink>
        )}
      </div>
      {hasChildren && isOpen ? renderChildren : null}
    </li>
  );
}

export const ExploreNavTree = ({ activeId, items }: Props) => {
  const initialOpen = useMemo(() => {
    const set = new Set<string>();

    const walk = (list: ExploreNavItem[]) => {
      for (const it of list) {
        if (it.children?.length && subtreeHasActive(it, activeId)) {
          set.add(it.id);
          walk(it.children);
        }
      }
    };

    walk(items);

    return set;
  }, [activeId, items]);

  const [openIds, setOpenIds] = useState(() => initialOpen);

  useEffect(() => {
    setOpenIds((prev) => {
      const next = new Set(prev);

      initialOpen.forEach((id) => next.add(id));

      return next;
    });
  }, [initialOpen]);

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const renderItems = (list: ExploreNavItem[], depth: number) => (
    <ul className={depth === 0 ? styles.listRoot : styles.listNested}>
      {list.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isOpen = hasChildren ? openIds.has(item.id) : false;
        return (
          <ExploreNavTreeRow
            key={item.id}
            activeId={activeId}
            item={item}
            isOpen={isOpen}
            toggle={toggle}
            renderChildren={hasChildren ? renderItems(item.children!, depth + 1) : null}
          />
        );
      })}
    </ul>
  );

  return <nav aria-label='Explore'>{renderItems(items, 0)}</nav>;
};
