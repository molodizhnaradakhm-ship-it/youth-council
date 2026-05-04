'use client';

import { createContext, useContext } from 'react';

import type { Footer, Header } from '@monorepo/cms/src/payload-types';

export const GlobalsContext = createContext<{
  footer: Footer;
  header: Header;
} | null>(null);

export const useGlobals = () => {
  const globals = useContext(GlobalsContext);

  if (globals === null) {
    throw new Error('useGlobals must be used within a GlobalsProvider');
  }

  return globals;
};
