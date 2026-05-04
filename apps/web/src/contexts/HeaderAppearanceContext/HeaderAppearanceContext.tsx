'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type HeaderAppearanceOverride = 'light' | 'dark' | null;

type HeaderAppearanceContextValue = {
  override: HeaderAppearanceOverride;
  setOverride: (value: HeaderAppearanceOverride, owner?: string) => void;
};

const HeaderAppearanceContext = createContext<HeaderAppearanceContextValue | null>(null);

type State = {
  override: HeaderAppearanceOverride;
  owner: string | null;
};

export function HeaderAppearanceProvider({ children }: { children: ReactNode }) {
  const [{ override }, setState] = useState<State>({ override: null, owner: null });

  const setOverride = useCallback((value: HeaderAppearanceOverride, nextOwner?: string) => {
    setState((prev) => {
      // If owner provided, always take it (new route mount wins).
      if (typeof nextOwner === 'string') {
        return { override: value, owner: nextOwner };
      }

      // No owner provided: treat as global/neutral set; don't clear an owned override.
      if (value === null && prev.owner !== null) return prev;
      return { override: value, owner: null };
    });
  }, []);

  const value = useMemo(
    () => ({ override, setOverride }),
    [override, setOverride],
  );

  return (
    <HeaderAppearanceContext.Provider value={value}>{children}</HeaderAppearanceContext.Provider>
  );
}

/** Page-level override from CMS (`pages.headerAppearance`). */
export function useHeaderAppearanceOverride(): HeaderAppearanceOverride {
  return useContext(HeaderAppearanceContext)?.override ?? null;
}

export function useHeaderAppearanceSetter(): HeaderAppearanceContextValue['setOverride'] {
  const ctx = useContext(HeaderAppearanceContext);
  if (!ctx) {
    throw new Error('useHeaderAppearanceSetter must be used within HeaderAppearanceProvider');
  }
  return ctx.setOverride;
}
