import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getAdminSupabase } from '@/lib/supabase/admin';
import { BOARDS } from '@/lib/boards';
import { formatDateTime } from '@/lib/format';

export const metadata = { title: '게시글 관리' };
export const dynamic = 'force-dynamic';

interface AdminListRow {
  id: number;
  board_slug: keyof typeof BOARDS;
  title: string;
  author_name: string | null;
  is_admin_post: boolean;
  is_notice: boolean;
  is_private: boolean;
  views: number;
  created_at: string;
}

interface PageProps {
  searchParams: Promise<{ board?: string; page?: string; q?: string }>;
}

const PAGE_SIZE = 30;

export default async function AdminPostsPage({ searchParams }: PageProps) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const { board, page: pageStr, q } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1);
  const search = q?.trim();

  const sb = getAdminSupabase();
  let query = sb
    .from('posts')
    .select(
      'id,board_slug,title,author_name,is_admin_post,is_notice,is_private,views,created_at',
      { count: 'exact' },
    );
  if (board && BOARDS[board as keyof typeof BOARDS]) {
    query = query.eq('board_slug', board);
  }
  if (search) {
    const escaped = search.replace(/[%_]/g, (c) => `\\${c}`);
    query = query.or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%`);
  }
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  const rows = (data ?? []) as AdminListRow[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="admin-shell">
      <div className="admin-shell__header">
        <h1>게시글 관리</h1>
        <Link href="/admin/posts/new" className="btn btn--primary">
          + 새 글 작성
        </Link>
      </div>
      <form className="board-toolbar" method="get">
        <select name="board" defaultValue={board ?? ''} style={{ padding: 8 }}>
          <option value="">전체 게시판</option>
          {Object.values(BOARDS).map((b) => (
            <option key={b.slug} value={b.slug}>{b.title}</option>
          ))}
        </select>
        <div className="board-search">
          <input type="search" name="q" defaultValue={search ?? ''} placeholder="제목/내용 검색" />
          <button type="submit" className="btn">검색</button>
        </div>
      </form>

      <div className="board-list__meta">
        총 <strong>{total.toLocaleString()}</strong>건 · {page} / {totalPages}
      </div>
      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>게시판</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={6} className="board-table__empty">검색 결과가 없습니다.</td></tr>
          ) : rows.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{BOARDS[r.board_slug]?.title ?? r.board_slug}</td>
              <td className="board-table__title">
                <Link href={`/admin/posts/${r.id}/edit`}>
                  {r.is_notice && <span className="badge badge--notice">공지</span>}
                  {r.is_private && <span className="badge badge--lock">비공개</span>}
                  {r.is_admin_post && <span className="badge badge--admin">관리자</span>}
                  <span>{r.title}</span>
                </Link>
              </td>
              <td>{r.is_admin_post ? '관리자' : r.author_name ?? '-'}</td>
              <td>{formatDateTime(r.created_at)}</td>
              <td>{r.views}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="페이지 이동">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 3 || p === 1 || p === totalPages)
            .map((p) => {
              const params = new URLSearchParams();
              if (board) params.set('board', board);
              if (search) params.set('q', search);
              if (p > 1) params.set('page', String(p));
              const qs = params.toString();
              return (
                <Link
                  key={p}
                  href={`/admin/posts${qs ? `?${qs}` : ''}`}
                  className={p === page ? 'pagination__page pagination__page--active' : 'pagination__page'}
                >
                  {p}
                </Link>
              );
            })}
        </nav>
      )}
    </div>
  );
}
