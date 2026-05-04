import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { Config } from '@monorepo/cms/src/payload-types';

type Props = {
  params: Promise<{ slug?: string; locale: Config['locale'] }>;
};

// Metadata generation
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  void (await params);
  notFound();
};

export default async function SolutionSingle({ params }: Props) {
  void (await params);
  notFound();
}
