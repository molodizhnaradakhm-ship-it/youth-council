import type { Metadata } from 'next';

import { payload } from '@/api';
import { UnderDevelopment } from '@/views/UnderDevelopment';
import type { Config } from '@monorepo/cms/src/payload-types';

export const metadata: Metadata = {
  description: 'This section is under development',
  robots: { index: false, follow: false },
  title: 'Under development',
};

async function getUnderDevelopmentPageAssets(locale: Config['locale']) {
  const res = await payload.find({
    collection: 'pages',
    depth: 2,
    locale,
    where: {
      slug: {
        equals: 'under-development',
      },
    },
  });
  const doc = res.docs?.[0];
  if (!doc || doc.viewType !== 'underDevelopment') {
    return null;
  }
  return doc;
}

type Props = {
  params: Promise<{ locale: Config['locale'] }>;
};

/**
 * Same placeholder for any path segment, e.g.:
 * /en/under-development/news, /ru/under-development/faq, /kk/under-development/coming-soon
 * so landing CTAs can stay without removing links.
 *
 * Optional: create a CMS page with template «Under development» and slug `under-development`
 * to customize background and hero image for this fixed route.
 */
export default async function UnderDevelopmentPage({ params }: Props) {
  const { locale } = await params;
  const cms = await getUnderDevelopmentPageAssets(locale);

  return (
    <UnderDevelopment
      backgroundImage={cms?.underDevelopmentBackground ?? undefined}
      ballImage={cms?.underDevelopmentBallImage ?? undefined}
      blocks={cms?.underDevelopmentBlocks ?? null}
    />
  );
}
