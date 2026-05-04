import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { match } from 'ts-pattern';

import { payload } from '@/api';
import {
  type PageQuery,
  renderBlog,
  renderContacts,
  renderExploreRedirect,
  renderExternalLinks,
  renderHome,
  renderInformation,
  renderParticipants,
  renderProjects,
  renderUnderDevelopment,
} from '@/appViewHandlers/pageBySlugViewHandlers';
import { DEFAULT_PAGE_SLUG, PageViewType } from '@/constants/pages';
import { generatePageMetadata } from '@/utils/seoUtils';
import type { Config } from '@monorepo/cms/src/payload-types';

const getPageBySlug = async (slug: string, locale: Config['locale']) => {
  const slugFinal = slug ?? DEFAULT_PAGE_SLUG;
  const res = await payload.find({
    collection: 'pages',
    // NOTE: pages can contain nested blocks (e.g. ResponsiveBlocksBlock → inner blocks → relationships/media).
    // Using depth 4 ensures relationships inside nested blocks are populated reliably.
    depth: 8,
    locale,
    where: {
      slug: {
        equals: slugFinal,
      },
    },
  });
  const docs = res.docs ?? [];
  const doc = docs[0];
  if (!doc) return notFound();

  return doc;
};

type Props = {
  params: Promise<{ slug?: string; locale: Config['locale'] }>;
  searchParams?: Promise<{
    category?: string;
    loadMore?: string;
    year?: string;
    author?: string;
    country?: string;
    q?: string;
    page?: string;
  }>;
};

export const dynamic = 'force-dynamic';

// Metadata generation
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params;

  const doc = await getPageBySlug(slug as string, locale);

  return generatePageMetadata({ doc, basePath: '/' });
};

// Main page component
export default async function Page({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const page = await getPageBySlug(slug as string, locale);
  const query = (await searchParams) as PageQuery | undefined;

  return (
    <>
      {match(page.viewType)
        .with(PageViewType.Home, () => renderHome({ page }))
        .with(PageViewType.Blog, () =>
          renderBlog({
            locale,
            page,
            query,
          }),
        )
        .with(PageViewType.Information, () => renderInformation({ page, query }))
        .with(PageViewType.Explore, () => renderExploreRedirect({ locale }))
        .with(PageViewType.Contacts, () => renderContacts({ page }))
        .with(PageViewType.ExternalLinks, () => renderExternalLinks({ page }))
        .with(PageViewType.Participants, () =>
          renderParticipants({
            locale,
            page,
            query,
          }),
        )
        .with(PageViewType.Projects, () =>
          renderProjects({
            locale,
            page,
            query,
          }),
        )
        .with(PageViewType.UnderDevelopment, () => renderUnderDevelopment({ page }))
        .otherwise(() => null)}
    </>
  );
}
