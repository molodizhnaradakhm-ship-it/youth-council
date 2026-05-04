import { redirect } from 'next/navigation';

import { payload } from '@/api';
import { buildYearFilter } from '@/utils/buildYearFilter';
import { buildParticipantSearchWhere } from '@/utils/participantSearchWhere';
import { BlogView } from '@/views/Blog';
import { ContactsView } from '@/views/Contacts';
import { ExternalLinks } from '@/views/ExternalLinks';
import { Home } from '@/views/Home';
import { ParticipantsView } from '@/views/Participants/Participants';
import { PrivacyPolicy } from '@/views/PrivacyPolicy';
import { ProjectsView } from '@/views/Projects/Projects';
import { UnderDevelopment } from '@/views/UnderDevelopment';
import type { Config, Page } from '@monorepo/cms/src/payload-types';

export type PageQuery = {
  category?: string;
  loadMore?: string;
  year?: string;
  author?: string;
  country?: string;
  /** Participants directory (CMS template) */
  q?: string;
  page?: string;
};

type BlogQuery = {
  query?: PageQuery;
};

const BLOG_PAGE_LIMIT = 6;

export function renderHome({ page }: { page: Page }) {
  return <Home {...page} />;
}

export async function renderBlog({
  page,
  locale,
  query,
}: {
  page: Page;
  locale: Config['locale'];
} & BlogQuery) {
  const currentCategory = query?.category ?? '';
  const currentAuthor = query?.author ?? '';
  const limit = BLOG_PAGE_LIMIT;
  const loadMoreQuery = query?.loadMore || limit;
  const yearFilter = buildYearFilter(query?.year);

  const newsFind = await payload.find({
    collection: 'blog',
    locale,
    sort: '-publishedOn',
    limit: Number(loadMoreQuery),
    where: {
      _status: {
        equals: 'published',
      },
      ...(currentCategory ? { category: { equals: currentCategory } } : {}),
      ...(currentAuthor ? { author: { equals: currentAuthor } } : {}),
      ...yearFilter,
    },
  });

  const newsDocs = newsFind.docs ?? [];
  const totalDocs = newsFind.totalDocs ?? 0;

  const allNewsFind = await payload.find({
    collection: 'blog',
    locale,
    limit: 1000,
    select: {
      publishedOn: true,
      category: true,
      author: true,
    } as any,
    sort: 'publishedOn',
    where: {
      _status: {
        equals: 'published',
      },
    },
  });

  const allNews = allNewsFind.docs ?? [];
  const allDates = allNews.map((doc) => doc.publishedOn);
  const uniqueYears = [...new Set(allDates.map((date) => new Date(date as string).getFullYear()))].sort(
    (a, b) => b - a,
  );

  const categoryIds = [
    ...new Set(
      allNews
        .map((doc) => (typeof doc.category === 'object' ? doc.category?.id : doc.category))
        .filter(Boolean),
    ),
  ];
  const authorIds = [
    ...new Set(
      allNews
        .map((doc) => (typeof doc.author === 'object' ? doc.author?.id : doc.author))
        .filter(Boolean),
    ),
  ];

  const catFind = await payload.find({
    collection: 'blog-categories',
    locale,
    sort: '_order',
    where: {
      id: {
        in: categoryIds,
      },
    },
  });
  const filteredNewsCategories = catFind.docs ?? [];

  const authFind = await payload.find({
    collection: 'blog-authors',
    locale,
    sort: '-createdAt',
    where: {
      id: {
        in: authorIds,
      },
    },
  });
  const filteredBlogAuthors = authFind.docs ?? [];

  return (
    <BlogView
      {...page}
      list={newsDocs}
      limit={limit}
      total={totalDocs}
      pageTitle={page.title}
      publishYears={uniqueYears}
      newsCategories={filteredNewsCategories}
      blogAuthors={filteredBlogAuthors}
      blogReadMoreLabel={page.blogReadMoreLabel}
    />
  );
}

export function renderInformation({ page, query }: { page: Page; query?: PageQuery }) {
  return <PrivacyPolicy {...page} country={query?.country} />;
}

export async function renderExploreRedirect({ locale }: { locale: Config['locale'] }) {
  const { resolveExploreDefaultHref } = await import('@/lib/exploreData');
  const href = await resolveExploreDefaultHref(locale);

  redirect(href ? `/${locale}${href}` : `/${locale}/explore`);
}

export function renderContacts({ page }: { page: Page }) {
  return <ContactsView {...page} />;
}

export function renderExternalLinks({ page }: { page: Page }) {
  return <ExternalLinks {...page} />;
}

export function renderUnderDevelopment({ page }: { page: Page }) {
  return (
    <UnderDevelopment
      backgroundImage={page.underDevelopmentBackground ?? undefined}
      ballImage={page.underDevelopmentBallImage ?? undefined}
    />
  );
}

const PARTICIPANTS_PAGE_SIZE = 20;
const PROJECTS_PAGE_SIZE = 20;

export async function renderProjects({
  locale,
  page,
  query,
}: {
  locale: Config['locale'];
  page: Page;
  query?: PageQuery;
}) {
  const pageRaw = parseInt(String(query?.page ?? '1'), 10);
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const res = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: PROJECTS_PAGE_SIZE,
    locale,
    page: currentPage,
    sort: 'title',
  });

  const slugSegment =
    typeof page.slug === 'string' && page.slug.trim() ? page.slug.trim() : 'projects';

  return (
    <ProjectsView
      currentPage={currentPage}
      headingTitle={page.title}
      listPath={slugSegment}
      pageSize={PROJECTS_PAGE_SIZE}
      projects={res.docs ?? []}
      totalDocs={res.totalDocs ?? 0}
    />
  );
}

export async function renderParticipants({
  locale,
  page,
  query,
}: {
  locale: Config['locale'];
  page: Page;
  query?: PageQuery;
}) {
  const q = typeof query?.q === 'string' ? query.q : '';
  const pageRaw = parseInt(String(query?.page ?? '1'), 10);
  const currentPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const where = buildParticipantSearchWhere(q);

  const res = await payload.find({
    collection: 'participants',
    depth: 1,
    limit: PARTICIPANTS_PAGE_SIZE,
    locale,
    page: currentPage,
    sort: 'title',
    ...(Object.keys(where).length > 0 ? { where: where as never } : {}),
  });

  const slugSegment =
    typeof page.slug === 'string' && page.slug.trim() ? page.slug.trim() : 'participants';

  return (
    <ParticipantsView
      currentPage={currentPage}
      headingTitle={page.title}
      listPath={slugSegment}
      pageSize={PARTICIPANTS_PAGE_SIZE}
      participants={res.docs ?? []}
      query={q}
      totalDocs={res.totalDocs ?? 0}
    />
  );
}

