import 'server-only';
import { getAdminSupabase } from './supabase/admin';
import type { BoardSlug } from './boards';
import type {
  PaginatedPosts,
  PostDetail,
  PostListItem,
  PostRow,
  FileRow,
} from './types';

const PAGE_SIZE = 15;

const LIST_COLUMNS =
  'id,board_slug,title,author_name,is_admin_post,is_notice,is_private,views,created_at';

function rowToListItem(r: PostRow): PostListItem {
  return {
    id: r.id,
    board_slug: r.board_slug,
    title: r.title,
    author_name: r.author_name,
    is_admin_post: r.is_admin_post,
    is_notice: r.is_notice,
    is_private: r.is_private,
    views: r.views,
    created_at: r.created_at,
  };
}

export interface ListPostsOptions {
  board: BoardSlug;
  page?: number;
  pageSize?: number;
  search?: string;
}

export async function listPosts(opts: ListPostsOptions): Promise<PaginatedPosts> {
  const sb = getAdminSupabase();
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = opts.pageSize ?? PAGE_SIZE;
  const search = opts.search?.trim();

  // Notices (always shown on top, not paginated)
  const { data: noticeRows, error: noticeErr } = await sb
    .from('posts')
    .select(LIST_COLUMNS)
    .eq('board_slug', opts.board)
    .eq('is_notice', true)
    .order('created_at', { ascending: false });

  if (noticeErr) throw noticeErr;

  let query = sb
    .from('posts')
    .select(LIST_COLUMNS, { count: 'exact' })
    .eq('board_slug', opts.board)
    .eq('is_notice', false);

  if (search) {
    const escaped = search.replace(/[%_]/g, (c) => `\\${c}`);
    query = query.or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: rows, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    notices: (noticeRows ?? []).map((r) => rowToListItem(r as PostRow)),
    items: (rows ?? []).map((r) => rowToListItem(r as PostRow)),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getPost(id: number): Promise<{ post: PostRow; files: FileRow[] } | null> {
  const sb = getAdminSupabase();
  const { data: post, error } = await sb
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!post) return null;
  const { data: files, error: fErr } = await sb
    .from('files')
    .select('*')
    .eq('post_id', id)
    .order('id', { ascending: true });
  if (fErr) throw fErr;
  return { post: post as PostRow, files: (files ?? []) as FileRow[] };
}

export function toPublicDetail(
  post: PostRow,
  files: FileRow[],
  options: { unlocked: boolean; isAdmin: boolean },
): PostDetail {
  const hideContent = post.is_private && !options.unlocked && !options.isAdmin;
  return {
    id: post.id,
    board_slug: post.board_slug,
    title: post.title,
    content: hideContent ? '' : post.content,
    author_name: post.author_name,
    is_admin_post: post.is_admin_post,
    is_notice: post.is_notice,
    is_private: post.is_private,
    views: post.views,
    created_at: post.created_at,
    updated_at: post.updated_at,
    files: hideContent ? [] : files,
  };
}

export async function incrementViews(id: number): Promise<void> {
  const sb = getAdminSupabase();
  // Use RPC-less approach: read and update.
  const { data, error } = await sb
    .from('posts')
    .select('views')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return;
  await sb.from('posts').update({ views: (data.views ?? 0) + 1 }).eq('id', id);
}
