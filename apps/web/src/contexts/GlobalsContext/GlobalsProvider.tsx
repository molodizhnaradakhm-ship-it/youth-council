'use client';

import type { PropsWithChildren } from 'react';

import type { Footer, Header } from '@monorepo/cms/src/payload-types';

import { GlobalsContext } from './GlobalsContext';

type GlobalsProviderProps = {
  footer: Footer;
  header: Header;
};

export const GlobalsProvider = ({
  children,
  footer,
  header,
}: PropsWithChildren<GlobalsProviderProps>) => {
  return (
    <GlobalsContext.Provider value={{ footer, header }}>
      {children}
    </GlobalsContext.Provider>
  );
};
