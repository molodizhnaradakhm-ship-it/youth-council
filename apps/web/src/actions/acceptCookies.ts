'use server';

import { cookies } from 'next/headers';

export const acceptCookies = async () => {
  const cookieStorage = await cookies();

  cookieStorage.set({
    expires: new Date().getTime() + 30 * 60 * 24 * 60000,
    httpOnly: true,
    name: 'accepted',
    value: 'true',
  });

  return {
    accepted: true,
  };
};
