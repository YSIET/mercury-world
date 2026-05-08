/**
 * 레거시 Cafe24 export JSON — 마이그레이션·백업 전용. 런타임 앱 라우트에서는 import하지 않음.
 */
import noticeData from "@/data/notice.json";
import newsData from "@/data/news.json";
import pdsData from "@/data/pds.json";
import freeboardData from "@/data/freeboard.json";
import mercuryEatData from "@/data/mercury_eat.json";
import boardsData from "@/data/_boards.json";

export interface Post {
  id: number;
  board_slug: string;
  thread_root: number;
  thread_parent: number;
  thread_depth: number;
  category_no: number;
  is_notice: boolean;
  author_id: string | null;
  author_name: string;
  author_email: string | null;
  has_secret: boolean;
  title: string;
  content: string;
  is_html: boolean;
  no_br: boolean;
  created_at: string | null;
  hit_count: number;
  vote_count: number;
  legacy_table: string;
  legacy_bd_no: number;
}

export interface Board {
  slug: string;
  title: string;
  description: string;
  legacy_table: string;
  post_count: number;
}

const dataByBoard: Record<string, Post[]> = {
  notice: noticeData as Post[],
  news: newsData as Post[],
  pds: pdsData as Post[],
  freeboard: freeboardData as Post[],
  mercury_eat: mercuryEatData as Post[],
};

function sortByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const da = a.created_at ?? "";
    const db = b.created_at ?? "";
    return db.localeCompare(da);
  });
}

export const boards: Board[] = boardsData as Board[];

export function getPostsByBoard(slug: string): Post[] {
  return sortByDateDesc(dataByBoard[slug] ?? []);
}

export function getRecentPosts(slug: string, limit = 5): Post[] {
  return sortByDateDesc(dataByBoard[slug] ?? []).slice(0, limit);
}

export function getPostByLegacyId(
  slug: string,
  legacyBdNo: number
): Post | null {
  return (
    (dataByBoard[slug] ?? []).find((p) => p.legacy_bd_no === legacyBdNo) ??
    null
  );
}

export function getBoardMeta(slug: string): Board | null {
  return boards.find((b) => b.slug === slug) ?? null;
}
