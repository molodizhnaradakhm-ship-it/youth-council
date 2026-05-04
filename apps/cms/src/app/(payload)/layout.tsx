/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react';

import { importMap } from './admin/importMap.js';

import './custom.scss';

import '@payloadcms/next/css';
import config from '@payload-config';
import { RootLayout } from '@payloadcms/next/layouts';

import { payloadServerFunction } from './payloadServerFunctions';

if (!config || typeof config !== 'object') {
  throw new Error(
    '[payload] `@payload-config` default export is missing. Rebuild the CMS app (and Docker image if used).',
  );
}

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={payloadServerFunction}>
    {children}
  </RootLayout>
);

export default Layout;
