import type { BoardSlug } from './boards';

export interface PostRow {
  id: number;
  board_slug: BoardSlug;
  title: string;
  content: string;
  author_name: string | null;
  author_password_hash: string | null;
  is_admin_post: boolean;
  is_notice: boolean;
  is_private: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  legacy_id: string | null;
  legacy_board: string | null;
}

export interface FileRow {
  id: number;
  post_id: number;
  filename: string;
  url: string;
  size_bytes: number | null;
  content_type: string | null;
  download_count: number;
  created_at: string;
}

export interface PostListItem {
  id: number;
  board_slug: BoardSlug;
  title: string;
  author_name: string | null;
  is_admin_post: boolean;
  is_notice: boolean;
  is_private: boolean;
  views: number;
  created_at: string;
}

export interface PostDetail extends PostListItem {
  content: string;
  files: FileRow[];
  updated_at: string;
}

export interface PaginatedPosts {
  notices: PostListItem[];
  items: PostListItem[];
  total: number;
  page: number;
  pageSize: number;
}
