import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import SubNav from '@/components/SubNav';
import BoardList from '@/components/BoardList';
import BoardSearch from '@/components/BoardSearch';
import Pagination from '@/components/Pagination';
import { BOARDS, BOARD_SLUGS, getBoard } from '@/lib/boards';
import { listPosts } from '@/lib/posts';

interface PageProps {
  params: Promise<{ board: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}

const SUB_NAV_ITEMS = BOARD_SLUGS.map((slug) => ({
  label: BOARDS[slug].title,
  href: `/bbs/${slug}`,
}));

export async function generateMetadata({ params }: PageProps) {
  const { board } = await params;
  const meta = getBoard(board);
  if (!meta) return { title: '게시판' };
  return { title: meta.title };
}

export default async function BoardListPage({ params, searchParams }: PageProps) {
  const { board } = await params;
  const meta = getBoard(board);
  if (!meta) notFound();
  const { page: pageStr, q } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
  const search = q?.trim() || undefined;

  let result;
  let loadError: string | null = null;
  try {
    result = await listPosts({ board: meta.slug, page, search });
  } catch (err) {
    loadError = err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.';
    result = { notices: [], items: [], total: 0, page, pageSize: 15 };
  }

  const basePath = `/bbs/${meta.slug}`;

  return (
    <>
      <PageHeader
        title={meta.title}
        subtitle={meta.description}
        breadcrumbs={[{ label: '게시판', href: '/bbs/notice' }, { label: meta.title }]}
      />
      <div className="container">
        <div className="page-grid">
          <SubNav title="게시판" items={SUB_NAV_ITEMS} />
          <section className="board-wrap">
            <div className="board-toolbar">
              <BoardSearch basePath={basePath} defaultValue={search} />
              {meta.allowsUserWrite && (
                <Link href={`${basePath}/write`} className="btn btn--primary">
                  글쓰기
                </Link>
              )}
            </div>
            {loadError && (
              <div className="alert alert--error">
                {loadError} (Supabase 환경변수가 설정되었는지 확인하세요.)
              </div>
            )}
            <BoardList
              basePath={basePath}
              notices={result.notices}
              items={result.items}
              total={result.total}
              page={result.page}
              pageSize={result.pageSize}
            />
            <Pagination
              basePath={basePath}
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
              search={search}
            />
          </section>
        </div>
      </div>
    </>
  );
}
