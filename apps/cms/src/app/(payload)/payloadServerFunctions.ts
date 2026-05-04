'use server';

import type { ServerFunctionClient } from 'payload';

import config from '@payload-config';
import { handleServerFunctions } from '@payloadcms/next/layouts';

import { importMap } from './admin/importMap.js';

/**
 * Dedicated server-actions module keeps a single Payload server-function entrypoint bundled
 * with stable imports (config + importMap). Avoid defining `'use server'` inside nested
 * closures in layout.tsx — that can compile to a brittle action closure in Next.js 15.
 */
export const payloadServerFunction: ServerFunctionClient = async (args) => {
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};
