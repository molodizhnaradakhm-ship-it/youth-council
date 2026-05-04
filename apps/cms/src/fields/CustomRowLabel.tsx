'use client';

// import React from 'react';
import type { PayloadClientReactComponent, RowLabelComponent } from 'payload';

import { useRowLabel } from '@payloadcms/ui';

export const CustomRowLabel: PayloadClientReactComponent<RowLabelComponent> = () => {
  const { data } = useRowLabel<any>();

  if (data.link) {
    return data.link.label;
  } else {
    return data.title;
  }

  // if (data.style === 'default') {
  //   return data.defaultLink?.link.label;
  // }
  // if (data.style === 'featured') {
  //   return data.featuredLink?.tag;
  // }
  // if (data.style === 'list') {
  //   return data.listLinks?.tag;
  // }
};
